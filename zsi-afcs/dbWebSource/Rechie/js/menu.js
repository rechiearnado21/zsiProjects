(function(){
        
         var bs                          = zsi.bs.ctrl
            ,svn                        = zsi.setValIfNull
            ,modalProcess               = "modalWindowProcess"
            ,tmplPageProcess            = ""
            ,tmplPageProcessAction      = ""
            ,tmplPageProcessActionProc  = ""
            ,tmplPageProcessRoles       = ""
            ,tmplDialog                 = ""
            ,g_page_id                  
            ,modalProcessAction         = "modalWindowProcessAction"
            ,contextModalProcessAction  = {  id         : modalProcessAction
                                            ,sizeAttr   : "pageProcessActionWidth"
                                          }
        
            ,g_page_process_id
            ,modalProcessActionProc     = "modalWindowProcessActionProc"
            ,contextModalProcessActionProc = {  id          : modalProcessActionProc
                                                , sizeAttr  : "pageProcessActionProcWidth"
                                             }
            ,modalProcessRoles          = "modalWindowProcessActionRoles"
            ,contextModalProcessRoles   = {  id             : modalProcessRoles
                                                , sizeAttr  : "pageProcessRolesWidth"
                                          }
            
        ;
        
        zsi.ready=function(){
            // getTemplates();
            $(".page-title").html("Menu");
            displayRecords();
            $(".panel").css("height", $(".page-content").height());
         };
        
        var contextModalProcess = { id : modalProcess
            , sizeAttr: "pageProcessWidth"
        };
                
        // function getTemplates(){
        //     $.get(base_url + "templates/bsDialogBox.txt",function(d){
        //         tmplDialog = Handlebars.compile(d); 
        //         $("body").append(tmplDialog(contextModalProcess));
        //     });    
        //     $.get(base_url + 'page/name/tmplPageProcess', function(d){tmplPageProcess=d;});  
        //     $.get(base_url + 'page/name/tmplPageProcessAction', function(d){ tmplPageProcessAction =d; });
        //     $.get(base_url + 'page/name/tmplPageProcessActionProc', function(d){ tmplPageProcessActionProc=d;});  
        //     $.get(base_url + 'page/name/tmplPageProcessRoles', function(d){ tmplPageProcessRoles=d;});  
        // }  
        
        function showModalPageProcess(id, title){
            page_id = id;
            var m = $("#" + modalProcess);
            $("#" + modalProcess + " .modal-title").text("Process for » " + title);
            m.modal("show");
            m.find('.modal-body').html(tmplPageProcess);
           // initPageProcessTemplate(page_id);
        }
                
        $("#btnSave").click(function () {
            $("#grid").jsonSubmit({
                procedure: "menus_upd"
                ,optionalItems: ["is_default","is_admin","is_dev"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#grid").clearGrid(); 
                    displayRecords();
                }
            });
            
        });
            
        function displayRecords(){   
            var cb = app.bs({name:"cbFilter1",type:"checkbox"});
                 $("#grid").dataBind({
        	     url            : app.execURL + "menus_sel"
        	    ,width          : $(".zContainer").width()
        	    ,height         : $(document).height() - 320
        	    ,selectorType   : "checkbox"
                ,blankRowsLimit:5
                ,isPaging : false
                ,dataRows : [
                         {text  : cb                                                                , type  : "hidden"        , width    : 25        , style : "text-align:left;"       
                		    , onRender      :  function(d){ 
                        		                   return     app.bs({name:"menu_id"                ,type:"hidden"      ,value: svn (d,"menu_id")})
                        		                               + app.bs({name:"is_edited"           ,type:"hidden"      ,value: svn(d,"is_edited")})
                                                               +  (d !==null ? app.bs({name:"cb"    ,type:"checkbox"}) : "" );
                                    }
                    }	 
                		,{text  : "Parent Menu"              , name  : "pmenu_id"                   , type  : "select"        , width : 120       , style : "text-align:left;"}
                		,{text  : "Menu Name"                , name  : "menu_name"                  , type  : "input"         , width : 200       , style : "text-align:left;"}
                		,{text  : "Page Name"                , name  : "page_id"                    , type  : "select"        , width : 200       , style : "text-align:left;"}
                		,{text  : "Parameters"               , name  : "parameters"                 , type  : "input"         , width : 200       , style : "text-align:left;"}
                		,{text  : "Seq #"                    , name  : "seq_no"                     , type  : "input"         , width : 80        , style : "text-align:left;"}
                		,{text  : "Icon"                     , name  : "icon"                       , type  : "input"         , width : 150       , style : "text-align:left;"}
                		,{text  : "Default"                  , name  : "is_default"                 , type  : "yesno"         , width : 80        , style : "text-align:left;"}
                		,{text  : "Admin"                    , name  : "is_admin"                   , type  : "yesno"         , width : 80        , style : "text-align:left;"}
                		,{text  : "Developer"                , name  : "is_dev"                     , type  : "yesno"         , width : 80        , style : "text-align:left;"}
                // 		,{text  : "Process"                  , width : 80                           , style : "text-align:center;"      
                // 		    ,onRender  : 
                //                 function(d){
                //                     if(d!==null && (d.page_id !=="") )
                //                         return "<a href='javascript:showModalPageProcess(" + d.page_id  + ",\"" +  d.menu_name  + "\");'><span class='badge'>" + d.ProcessCount + "</span></a>";
                //                     else 
                //                         return "";
                //             }
                //         }
        	    ]
        	     ,onComplete: function(){
        	         $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                     $("select[name='pmenu_id']").dataBind("menus");
                     $("select[name='page_id']").dataBind( "pages");
                     $("select[name='page_process_id']").dataBind( "page_processes");
                }  
            });    
        }
        
        $("#btnDelete").click(function(){
            zsi.form.deleteData({
                 code       : "sys-0002"
                ,onComplete : function(data){
                            displayRecords();
                          }
            });      
        });
})();        


        