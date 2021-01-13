 var checkList =  (function(){
        var _public = {};
            var      bs  = zsi.bs.ctrl
                    ,svn = zsi.setValIfNull
            ;

            zsi.ready = function(){
                displayCheckLists();
            }; 
              
            $("#btnSave").click(function () {
               $("#gridCheckList").jsonSubmit({
                         procedure: "checklists_upd"
                        ,optionalItems: ["is_daily"]
                        , onComplete: function (data) {
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            displayCheckLists();
                        }
                });
            });
            
            function displayCheckLists(){
                $("#gridCheckList").dataBind({
             	     sqlCode        : "C208" //checklists_sel
            	    ,width          : $(".zContainer").width()
            	    ,height         : $(document).height() - 260
                    ,blankRowsLimit : 5
                    ,dataRows       : [
                        {text : "Code"      ,width : 85       , style : "text-align:left;"
        		            ,onRender  :  function(d){ 
                                return app.bs({name:"checklist_id"      ,type:"hidden"     ,value: app.svn(d,"checklist_id")}) 
                                     + app.bs({name:"is_edited"         ,type:"hidden"     ,value: app.svn(d,"is_edited")})
                                     + app.bs({name:"checklist_code"    ,type:"input"      ,value: app.svn(d,"checklist_code")});
                            
                            }
        		        }
        		        ,{text : "Description"   ,name : "checklist_desc"   ,type : "input"    ,width : 300      ,style : "text-align:left;"}
        		        ,{text : "Daily?"        ,name : "is_daily"         ,type : "yesno"    ,width : 85       ,style : "text-align:left;"            ,defaultValue:"Y"}
        		        ,{text : "Weekly?"       ,name : "is_weekly"        ,type : "yesno"    ,width : 85       ,style : "text-align:center;"          ,defaultValue:"N"}
        		        ,{text : "Bi Monthly?"   ,name : "is_bi_monthly"    ,type : "yesno"    ,width : 85       ,style : "text-align:center;"          ,defaultValue:"N"}
        		        ,{text : "Monthly?"      ,name : "is_monthly"       ,type : "yesno"    ,width : 85       ,style : "text-align:center;"          ,defaultValue:"N"}
        		        ,{text : "Quarterly?"    ,name : "is_quarterly"     ,type : "yesno"    ,width : 85       ,style : "text-align:center;"          ,defaultValue:"N"}
        		        ,{text : "Yearly?"       ,name : "is_yearly"        ,type : "yesno"    ,width : 85       ,style : "text-align:center;"          ,defaultValue:"N"}
                    ]
                });    
            }

    return _public;
  
 })();
  

                                                                                                             