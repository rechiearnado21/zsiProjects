var users = (function(){
    var   bs                    = zsi.bs.ctrl
        , tblName               = "tblusers"
        , mdlImageUser        = "modalWindowImageUser"
        , mdlAddNewUser         = "modalWindowAddNewUser"
        , mdlInactive           = "modalWindowInactive"
        , mdlOEM                = "modalWindowOEM"
        , mdlAddNewOEM          = "modalWindowAddNewOEM"
        , cuser_id
        , svn                   = zsi.setValIfNull
        , isNew                 = false
        , recipients            = []
        , gTw                   = null
        , gSearchOption         = "" 
        , gSearchValue          = "" 
        , gFilterOption         = ""
        , gFilterValue          = ""
        , gRoleId               = ""
        , gUserId               = null
        , pub                   = {}
        , ctr                   = 0
        , gUsersData             = []
        , gUserIndex             = -1
        , g$NewRow               = {}
    ;

    zsi.ready = function(){
        gTw = new zsi.easyJsTemplateWriter();
        setSearch();
        setInputs();
        displayRecords("");
        getTemplates();
        $(".page-title").html("Users");
        //$(".panel").css("height", $(".page-content").height()); 
        
        $("#btnDeleteUser").click(function(){
            zsi.form.deleteData({
                 code       : "ref-00022"
                ,onComplete : function(data){
                    $('#modalWindowInactive').modal('toggle');
                }
            });     
        });
    };
   
    $.fn.clearValue = function(){
       this.html("<option></option>"); 
    }; 
    
    pub.submitInactive = function(){
        var _$grid = $("#gridInactiveUsers");
            _$grid.jsonSubmit({
                 procedure: "users_upd"
                ,optionalItems: ["is_active","is_contact"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayRecords();
                    displayInactiveUsers();
                }
            });
        $('#' + mdlInactive).modal('hide');     
    }; 
    
    pub.submitNewUsers = function(){
        if( zsi.form.checkMandatory()!==true) return false;
        var res = isRequiredInputFound("#gridNewUsers");
        if(!res.result){
            $("#gridNewUsers").jsonSubmit({
                     procedure  : "users_upd"
                     ,optionalItems: ["is_active","is_contact"]
                     ,notIncludes: ["employee"]
                     ,onComplete : function (data) {
                         if(data.isSuccess===true){
                            zsi.form.showAlert("alert");
                            isNew = false;
                            displayRecords();
                            displayAddNewUser();
                         }
                    }
            });        
            //$('#' + mdlAddNewUser).modal('hide');
        } else {
            alert("Enter " + res.inputName);
        }
    };
    
    pub.getCurrentUser=function(){
        return gUsersData[gUserIndex];
    };

    pub.setOEMItemTmpl  = function(text, value){
        return '<li class="list-group-item" id='+ value +'>' + text 
            +    '<i class="fas fa-minus-circle" aria-hidden="true" id='+ value + ' onclick="users.removeOEM(this);" style="float: right; cursor:pointer;"></i>'
            + '</li>';
    };    
        
    pub.addList = function(self){
        
        addList({
             formSelector    : "#frm_modalWindowOEM"
            ,info            : users.getCurrentUser()
            ,button          : self
        });
       
    };

    pub.removeOEM = function(o){
        var _$li = $(o).closest("li");
        var _oem_id  = _$li.attr("id");
        
        var _info = null;
        
        if ( $(o).closest(".modal").attr("id").toLowerCase().includes("new") ){
            //new    
            _info = g$NewRow.info;
        }
        else{
            //existing data;
           _info = users.getCurrentUser();
            
        }
        
        var _i = _info.keyValue.findIndex( function(x) { return x.value ==  _oem_id;});

        _info.keyValue.splice(_i,1);
        
        var _oem_ids="",_oems="";
        for( var i = 0; i < _info.keyValue.length; i++){ 
            if(_oem_ids !=="") {
                _oem_ids  +=",";
                _oems  +=",";
            }
            _oem_ids  += _info.keyValue[i].value;
            _oems  += _info.keyValue[i].key;
        }
        _info.oem_ids = _oem_ids;
        _info.oems = _oems;
        
        var _$row = $(_info.anchor).closest(".zRow");
        _$row.find("#oem_ids").val(_oem_ids);
        _$row.find("#is_edited").val("Y");        
        _info.anchor.text = _oems;
        _$li.remove();
    };
    
    pub.saveUsersOEM = function(o){
        var _info = users.getCurrentUser();
        $.post( app.procURL + "user_oems_upd "
            + "@upd_user_id='" + _info.user_id + "'"
            + ",@oem_ids='" + _info.oem_ids + "'" 
            ,function(data){
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");        
                } 
        });
    }; 
    
    pub.showModalOEM = function(obj,index){
        gUserIndex = index;
        var _info = users.getCurrentUser();
        _info.anchor = obj;
        var g$mdl = $("#" + mdlOEM);
        var $form = g$mdl.find("form");
        g$mdl.find(".modal-title").text("OEM") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        $form.find("#oem_filter_id").dataBind("oem");
        displayOEMList($form,_info);
        
    };

    pub.showModalAddNewOEM = function(obj,index){
        gUserIndex = index;
        var g$mdl = $("#" + mdlAddNewOEM);
        var $form = g$mdl.find("form");
        g$mdl.find(".modal-title").text("OEM") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        
        $form.find("#oem_filter_id").dataBind("oem");
        
        //requirements for new parameters.
        if( isUD(obj.info) )  { 
            obj.info= {oem_ids:"",oems:"",keyValue:[],anchor:obj};
            g$NewRow  =  $(obj).closest(".zRow");
        }
        g$NewRow.info = obj.info;
        displayOEMList( $form, obj.info);  
    };
    
    pub.addNewList = function(self){
        addList({
             formSelector    : "#frm_modalWindowAddNewOEM"
            ,info            : g$NewRow.info
            ,button          : self
        });
        
    };

    pub.showModalUploadUserImage = function(UserId, name){
        user_id = UserId;
        var m=$('#' + mdlImageUser);
        
        m.find(".modal-title").text("Image User for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
            }
        ); 
    };
    
    pub.uploadImageUser = function(){
        var frm = $("#frm_" + mdlImageUser);
        var fileOrg=frm.find("#file").get(0);
    
        if( fileOrg.files.length<1 ) { 
             alert("Please select image.");
            return;
        }
        var formData = new FormData( frm.get(0));
        $.ajax({
            url: base_url + 'file/UploadImage',  //server script to process data
            type: 'POST',
    
            //Ajax events
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    //submit filename to server
                    $.get(base_url  + "sql/exec?p=dbo.image_file_users_upd @user_id=" + user_id
                                    + ",@img_filename='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageUser).modal('toggle');
                        
                        //refresh latest records:
                        displayRecords();
                    });   
                }else
                    alert(data.errMsg);
            },
            error: errorHandler = function() {
                console.log("error");
            },
            // Form data
            data: formData,
            //Options to tell JQuery not to process data or worry about content-type
            cache: false,
            contentType: false,
            processData: false
        }, 'json');
    };
    
    pub.mouseover = function(filename){
     $("#user-box").css("display","block");
     $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
    };
    
    pub.mouseout = function (){
        $("#user-box").css("display","none");
    }; 
    
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : mdlInactive
            , sizeAttr  : "modal-md"
            , title     : "Inactive Users"
            , body      : gTw.new().modalBodyInactive({grid:"gridInactiveUsers",onClickSaveInactive:"users.submitInactive();"}).html()  
        })
        
        .bsModalBox({
              id        : mdlAddNewUser
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddUsers({grid:"gridNewUsers",onClickSaveNewUsers:"users.submitNewUsers();"}).html()  
        })
        .bsModalBox({
              id        : mdlOEM
            , sizeAttr  : "modal-md"
            , title     : "New User"
            , body      : gTw.new().modalBodyOEM({oemListGroup:"oemList"}).html()  
        })
        .bsModalBox({
              id        : mdlAddNewOEM
            , sizeAttr  : "modal-md"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddNewOEM({oemListGroup:"oemList"}).html()  
        })
        .bsModalBox({
              id        : mdlImageUser
            , sizeAttr  : "modal-md"
            , title     : "Inactive Users"
            , body      : ""
            , footer    : gTw.new().modalBodyImageUser({onClickUploadImageUser:"users.uploadImageUser();"}).html()  
        });
    
    } 

    function removeRecipient(){
        var selected = $("input[name=recp_cb]:checked").getCheckBoxesValues();
        $.each(selected, function(index, row){
            recipients.splice(recipients.findIndex(x => x._userid==row),1);
            $("#AddNewRecpmodalWindow").find("input[name=user_id][value="+row+"]").closest(".zRow").remove();
        });
        alert(selected.length+" recipients removed");
    }

    function initChangeEvent(){
        $("input[name='file_thumbnail']").change(function(){
            fileNameThumbNail= this.files[0].name;
            var fileSize1 =  this.files[0].size / 1000.00; //to kilobytes
            if(fileSize1 > 100){ 
                alert("Please make sure that file size must not exceed 100 KB.");
                this.value="";
            }
        });
        
        $("input[name='file']").change(function(){
            fileNameOrg=this.files[0].name;
            var fileSize2 =  this.files[0].size / 1000.00; //to kilobytes
            if(fileSize2 > 800){ //1mb
                alert("It is recommended that file size must not exceed 800 KB.");
                this.value="";
            }
        });
    }
    
    function isRequiredInputFound(form){
        var result = false;
        var inputName = "";
        $(form).find("input[name='is_edited']").each(function(e){
            if($.trim(this.value) === "Y"){
                var $zRow = $(this).closest(".zRow");
                var logon = $zRow.find("[name='logon']").val();
                var roleID = $zRow.find("[name='role_id']").val();
                
                if ($.trim(logon) === ""){
                    result = true;
                    inputName = "Logon";
                }
                //if ($.trim(firstName) === ""){
                //    result = true;
                //    inputName = "First Name";
                //}
                //if ($.trim(lastName) === ""){
                //    result = true;
                //    inputName = "Last Name";
                //}
                if ($.trim(roleID) === ""){
                    result = true;
                    inputName = "Role";
                }
            }
        });
    
        return {result, inputName};
    }
    
    function markNewUserMandatory(){
        zsi.form.markMandatory({       
          "groupNames":[
                {
                     "names" : ["logon"]
                    ,"type":"M"
                }             
              
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Logon"]}
          ]
        });    
    }
    
    function setSearch(){
        gSearchOption = "";
        gSearchValue = "";
        gFilterOption = "";
        gFilterValue = "";
        gRoleId = "";
        
        $(".search-filter").val("");
        $("select#search_option").val("logon");
        $("select#filter_option").val("region_id");
        $("select#filter_value").dataBind("regions");
        $("select#roles_filter").dataBind("roles");
        
        $("select#filter_option").change(function(){
            var filterValue = "";
            if(this.value){
                if(this.value === "region_id") {
                    filterValue = "regions";
                } else if(this.value === "lead_unit_id") {
                    filterValue = "lead_units";
                }
                
                $("select#filter_value").dataBind(""+ filterValue +"");
            }
        });
    }
    
    function setInputs(){
        logon_id_filter = $("#logon_id_filter");
    }   
    
    function manageItem(id,title){
        cuser_id = id;
        
        displayOemRegion(id);
        
         $("#frm_modalWindowOemRegion .modal-title").text("OEM Region for » " + title);
        $('#modalWindowOemRegion').modal({ show: true, keyboard: false, backdrop: 'static' });
        if (modalWindowOemRegion===0) {
            modalWindowOemRegion=1;
            $("#modalWindowOemRegion").on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }
    }

    function submitItemsUserOR(){
        $("#frm_modalWindowOemRegion").jsonSubmit({
             procedure      : "user_oem_region_upd"
          ,optionalItems  : ["user_oem_region_id,user_id"]
            ,onComplete     : function (data) {
                if(data.isSuccess===true)
                $("#" + tblName2).clearGrid();
                 displayOemRegion(cuser_id);
                 zsi.form.showAlert("alert");
                $("#grid").trigger('refresh');
            }
        });
    }
    
    function displayInactiveUsers(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveUsers").dataBind({
             sqlCode    : "U77"
            ,parameters : {is_active: "N"}
    	    ,height     : 360
            ,dataRows   : [
                
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender :function(d){
                                    return     app.bs({name:"user_id"   ,type:"hidden"  ,value: d.user_id})
                                             + app.bs({name:"is_edited" ,type:"hidden"})
                                             + app.bs({name:"client_id" ,type:"hidden"  ,value: d.client_id})
                                             + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );                          
                                } 
                }
                
                
        	   ,{text  : "Logon"              ,width: 250           ,style: "text-align:left;"            
        	       ,onRender: function(d){
                        return  app.bs({name:"logon"         ,type:"input"   ,value: d.logon})
                              + app.bs({name:"first_name"    ,type:"hidden"  ,value: d.first_name}) 
                              + app.bs({name:"last_name"     ,type:"hidden"  ,value: d.last_name}) 
                              + app.bs({name:"middle_name"   ,type:"input"   ,value: d.middle_name          ,style: "text-align:center;" })  
                              + app.bs({name:"name_suffix"   ,type:"hidden"  ,value: d.name_suffix})   
                              + app.bs({name:"role_id"       ,type:"hidden"  ,value: d.role_id})
                              + app.bs({name:"is_admin"      ,type:"hidden"  ,value: d.is_admin });
                   }
        	   }
               ,{text  : "Active?"  , width : 50    , style : "text-align:center;"  ,type:"yesno"  ,name:"is_active"    ,defaultValue:"N"}
            ]
            ,onComplete: function(o){
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveCustomers input[name='cb']");
            }
        });  
    }
    
    function displayAddNewUser(){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        ctr=-1;
        $("#gridNewUsers").dataBind({
     	     width          : $("#frm_modalWindowAddNewUser").width() - 22
    	    ,height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : [
        		{text  : "Logon "     , width : 155           , style : "text-align:center;"         ,sortColNo:3
                    ,onRender : function(d){ 
                        ctr++;
                        return app.bs({name:"user_id"       ,type:"hidden"   ,value: app.svn(d,"user_id")})
                            +  app.bs({name:"is_edited"     ,type:"hidden"})
                            +  app.bs({name:"client_id"     ,type:"hidden"   ,value: app.userInfo.client_id})
                            +  app.bs({name:"logon"         ,type:"input"    ,value: app.svn(d,"logon")});
                    }
        		}
        		,{text  : "Employee"                ,width: 200           ,style: "text-align:center;"          ,type:"select"      ,name:"employee"
        		    ,onRender: function(d){
                        return app.bs({name:"employee"      ,type:"select"})
                            +  app.bs({name:"first_name"    ,type:"hidden"})
                            +  app.bs({name:"last_name"     ,type:"hidden"})
                            +  app.bs({name:"middle_name"   ,type:"hidden"})
                            +  app.bs({name:"name_suffix"   ,type:"hidden"});
                    }
        		} 
                ,{text  : "Role"                ,width: 160             ,style: "text-align:center;"            ,type: "select"      ,name: "role_id"}
                ,{text  : "Admin?"              ,width: 60              ,style : "text-align:center;"           ,type: "yesno"       ,name: "is_admin"          ,defaultValue: "N"}
                ,{text  : "Active?"             ,width: 60              ,style : "text-align:center;"           ,type: "yesno"       ,name: "is_active"         ,defaultValue: "Y"}
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("input, select").on("change keyup ", function(){
                            $(this).closest(".zRow").find("[name='is_edited']").val("Y");
                });       
                
                this.find("[name='employee']").dataBind({
                     sqlCode : "D1432"
                    ,text    : "fullname"
                    ,value   : "id"
                    ,onChange: function(d){
                        var  _info   = d.data[d.index - 1]
                            ,_firstName = _info.first_name
                            ,_lastName = _info.last_name
                            ,_middleName = _info.middle_name
                            ,_nameSuffix = _info.name_suffix;
                            
                        $(this).closest(".zRow").find("[name='first_name']").val(_firstName);
                        $(this).closest(".zRow").find("[name='last_name']").val(_lastName);
                        $(this).closest(".zRow").find("[name='middle_name']").val(_middleName);
                        $(this).closest(".zRow").find("[name='name_suffix']").val(_nameSuffix);
                    }
                });
                
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
    
                this.find("select[name='role_id']").dataBind({
                     sqlCode : "D1435"
                    ,text   : "role_name"
                    ,value  : "role_id"
                });
    
                markNewUserMandatory();
                
            }
        });    
    }
    
    function displayRecords(user_id){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        ctr=-1;
        $("#grid").dataBind({
             sqlCode        : "U77"
            ,parameters     : {
                                 searchOption   : gSearchOption 
                                ,searchValue    : gSearchValue 
                                ,role_id        : gRoleId
                                ,client_id     : app.userInfo.company_id
            }
     	    ,width          : $("#frm").width()
    	    ,height         : $(window).height() - 302 
    	    ,selectorType   : "checkbox"
            ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [
                { text:"image"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='users.mouseover(\"" +  svn(d,"img_filename") + "\");' onmouseout='users.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='users.showModalUploadUserImage(" + svn(d,"user_id") +",\"" 
    		                           + svn(d,"userFullName") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
        		,{text  : "Logon "     , width : 155           , style : "text-align:center;"         ,sortColNo:3
                    ,onRender : function(d){ 
                        ctr++;
                        return app.bs({name:"user_id"   ,type:"hidden"  ,value:app.svn(d,"user_id") })
                            +  app.bs({name:"is_edited" ,type:"hidden"})
                            +  app.bs({name:"client_id" ,type:"hidden"  ,value:app.svn(d,"client_id")})
                            +  app.bs({name:"logon"     ,type:"input"   ,value:app.svn(d,"logon")   });
                                                 
                    }
        		}
                ,{text  : "First Name"          ,width: 150           ,style: "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4}
                ,{text  : "Last Name"           ,width: 150           ,style: "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      ,width: 130           ,style: "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         ,width: 100           ,style: "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
                ,{text  : "Role"                ,width: 160           ,style: "text-align:center;"          ,type:"select"      ,name:"role_id"         ,displayText:"role_name"}
                ,{text  : "Admin?"              ,width: 60            ,style: "text-align:center;"          ,type:"yesno"       ,name:"is_admin" }
                ,{text  : "Active?"             ,width: 60            ,style: "text-align:center;"             ,defaultValue: "Y"
                    ,onRender : function(d){ 
                        return app.bs({name:"is_active"     ,type:"yesno"  ,value:app.svn(d,"is_active", "Y") ,defaultValue: "Y"});
                    }
                }
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){
                gUsersData = o.data.rows;
                $('.has-tooltip').tooltip();
                if ($("[name='oem_ids']").filter(function() { return $(this).val(); }).length > 0) {
                    $(this).closest(".zRow").find("[name='is_edited']").val("Y");
                    
                }
                
            
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
                this.find("select[name='role_id']").dataBind({
                     sqlCode : "D1435"
                    ,text   : "role_name"
                    ,value  : "role_id"
                });
                this.find("select[name='plant_id']").dataBind("plants");
                this.find("select[name='warehouse_id']").dataBind("warehouse");

                markNewUserMandatory();
                $(".no-data input[name='logon']").checkValueExists({code:"adm-0002",colName:"logon"
                   ,isNotExistShow :  false
                   ,message : "data already exists"
                });
            }
        });    
    } 
    
    function displayOEMList($frm,info){
        var _h = "";
        info.keyValue = [];
        if( info.oem_ids  !== ""){
            $.each(info.oems.split(","), function(i,y){ 
                var oem_id = info.oem_ids.split(",")[i];
                _h +=pub.setOEMItemTmpl(y,oem_id);
                info.keyValue.push(  {key: y, value:oem_id});
            });
            $frm.find("#btnSaveUsersOEM").removeClass("d-none");
        }
        $frm.find("#listItemGroup").html(_h);        
        
    }

    function addList(o){
        var _info = o.info;
        var _$mdl = $(o.button).closest( o.formSelector );
        var _filterText = _$mdl.find("#oem_filter_id :selected").text();
        var _filterValue = _$mdl.find("#oem_filter_id :selected").val();
        var _ids = _info.oem_ids.split(",");
        var _names = _info.oems.split(",");
        
        if(_filterValue ==="" ){
             alert("Please Select OEM.");
             return;
        }
        
        if(_ids.includes(_filterValue) ){
             alert("Already exist.");
             return;
        }
        _$mdl.find("#oemListGroup").find("#listItemGroup").append(pub.setOEMItemTmpl(_filterText,_filterValue) );
        _$mdl.find("#btnSaveUsersOEM").removeClass("d-none"); 
        
        if(_info.oem_ids !=="") {
            _info.oem_ids +=",";
            _info.oems +=",";
        }
        
        _info.oems +=_filterText;
        _info.oem_ids +=_filterValue;
        _info.keyValue.push(  {key: _filterText, value:_filterValue});
        
        if(_info.anchor.text !=="") _info.anchor.text +=",";
        _info.anchor.text +=_filterText;
        
        var _$row = $(_info.anchor).closest(".zRow");
        var _oem_ids= _$row.find("#oem_ids").val();
         
          
        if(_oem_ids !=="") _oem_ids +=",";
        _oem_ids +=_filterValue;
        _$row.find("#oem_ids").val(_oem_ids);
        _$row.find("#is_edited").val("Y"); 
    } 
    
    function showModalUploadImage(filename){
        var m=$('#modalWindow');
        
        m.modal("show");
        var img = "<img src='"  + base_url + "file/viewImage?fileName=" +  filename + "'>";
        m.find('.modal-body').html(img); 
    }
    
    function closeModalSendEmail(){
        $('#modalSendEmail').modal("hide");
    }
    
    function setEditedRow(){
        $("input, select").on("change keyup paste", function(){
            $(this).closest(".zRow").find("#is_edited").val("Y");
        });  
        
        $(".zDdlBtn").on("click", function(){
            $(this).closest(".zRow").find("#is_edited").val("Y");
        });
    }   
    
    $("#btnClear").click(function(){
        setSearch();
        isNew = false;
        displayRecords("");
    });
    
    $("#btnGo").click(function(){
        gSearchOption = $("#search_option").val();
        gSearchValue = $.trim($("#search_value").val());
        gFilterOption = $("#filter_option").val();
        gFilterValue = $.trim($("#filter_value").val());
        gRoleId = $.trim($("#roles_filter").val());
        displayRecords("");
    });
    
    $("#btnSave").click(function () {
        $("#grid").jsonSubmit({
             procedure  : "users_upd"
             ,optionalItems: ["is_admin", "is_active"]
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    displayRecords();
                }
            }
        });
    });
    
    $("#btnNactive").click(function () {
        var g$mdl = $("#" + mdlInactive);
        g$mdl.find(".modal-title").text("Inactive User(s)") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveUsers();
    });
    
    
    
    $("#btnAdd").click(function () {
        var _$mdl = $('#' + mdlAddNewUser);
        _$mdl.find(".modal-title").text("Add New Users");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            console.log("agi");
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewUser();
    });

    $("#btnAddRecp").click(function(){
        var leng    = recipients.length,
            rec     = $("input[name=cb]:checked").getCheckBoxesValues();
            
            $.each(rec, function(index, row){
                elem        = $("#user_id").val(row).closest(".zRow"),
                logon       = elem.find("#logon").get(0).value,
                ln          = elem.find("#last_name").get(0).value,
                fn          = elem.find("#first_name").get(0).value,
                mn          = elem.find("#middle_ini").get(0).value,
                pn          = elem.find("#position").get(0).value,
                role        = elem.find("#role_id").closest(".zCell").find("#text").get(0).innerText,
                region      = elem.find("#region_id").closest(".zCell").find("#text").get(0).innerText,
                lead        = elem.find("#lead_unit_id").closest(".zCell").find("#text").get(0).innerText,
                contact     = elem.find("#contact_nos").get(0).value; 
                
                if(!recipients.isExists({keyName: "_userid", value: row}))
                recipients.push({
                    _userid:    row,
                    _logon:     logon,
                    _ln:        ln,
                    _fn:        fn,
                    _mn:        mn,
                    _pn:        pn,
                    _role:      role,
                    _region:    region,
                    _lead:      lead,
                    _contact:   contact
                });
            });
        
        alert((recipients.length - leng)+" recipients added");
    });
    
    return pub;
})();
                                                