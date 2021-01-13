var driverpaoloader = (function(){
    var   bs                    = zsi.bs.ctrl
        , tblName               = "tblusers"
        ,_public                = {}
        ,mdlImageEmpl           = "modalWindowImageEmployee"
        ,mdlImageUser           = "modalWindowImageUser"
        ,mdlImageDriverLicence  = "modalWindowImageDriverLicence"
        ,gRoleId                = 1
        ,gPosition              = "DRIVER"
        ,gCompanyId             = app.userInfo.company_id
        ,mdlAddNewUser          = "modalWindowAddNewUser"
        ,mdlInactive            = "modalWindowInactive"
        ,gMdlUploadExcel        = "modalWindowUploadExcel"
        ,gName                  = ""
        ,gTw                    = null
        ,gActiveTab             = ""
        
    ;
   
    zsi.ready = function(){
        $(".page-title").html("Driver/PAO");
        $(".panel-container").css("min-height", $(window).height() - 190); 
        gTw = new zsi.easyJsTemplateWriter();
        displayDrivers();
        displayPAO();
        getTemplates();
        gActiveTab = "drivers";
        gName = "Driver(s)";
    };
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
        switch(target){
            case "#nav-drivers":
                gRoleId = 1;
                gPosition = "DRIVER";
                gActiveTab = "drivers";
                gName = "Driver(s)";
                break;
            case "#nav-pao":
                gRoleId = 2;
                gPosition = "PUBLIC ASSISTANCE OFFICER (PAO)";
                gActiveTab = "pao";
                gName = "PAO(s)";
                break;
          default:break;
      }
    });
    
    _public.excelFileUpload = function(){
        var frm      = $("#frm_modalWindowUploadExcel");
        var formData = new FormData(frm.get(0));
        var files    = frm.find("input[name='file']").get(0).files; 
    
        if(files.length===0){
            alert("Please select excel file.");
            return;    
        }
        
        //disable button and file upload.
        $("btnUploadFile").hide();
        $("#loadingStatus").html("<div class='loadingImg'></div> Uploading...");
    
        $.ajax({
            url: base_url + 'file/templateUpload',  //server script to process data
            type: 'POST',
            //Ajax events
            success: completeHandler = function(data) {
                if(data.isSuccess){
                     alert("Data has been successfully uploaded.");
                }
                else
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
    _public.showModalUpload = function(o,tabName){
        $.get(app.execURL +  "excel_upload_sel @load_name ='" + tabName +"'"
        ,function(data){
            g$mdl = $("#" + gMdlUploadExcel);
            g$mdl.find(".modal-title").text("Upload Excel for » " + tabName ) ;
            g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            $("#tmpData").val(data.rows[0].value);
            $("input[name='file']").val(""); 
        });
    };     
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : mdlImageUser
            , sizeAttr  : "modal-md"
            , title     : "Inactive Users"
            , body      : ""
            , footer    : gTw.new().modalBodyImageUser({onClickUploadImageUser:"driverpaoloader.uploadImageUser();"}).html()  
        })
        .bsModalBox({
              id        : mdlImageDriverLicence
            , sizeAttr  : "modal-md"
            , title     : "Driver's Licence"
            , body      : ""
            , footer    : gTw.new().modalBodyImageDriverLicence({onClickUploadImageDriverLicence:"driverpaoloader.uploadImageDriverLicence();"}).html()  
        })
        .bsModalBox({
              id        : mdlAddNewUser
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddUsers({grid:"gridNewUsers",onClickSaveNewUsers:"driverpaoloader.submitNewUsers();"}).html()  
        })
        .bsModalBox({
              id        : mdlInactive
            , sizeAttr  : "modal-lg"
            , title     : "Inactive Users"
            , body      : gTw.new().modalBodyInactive({grid:"gridInactiveUsers",onClickSaveInactive:"driverpaoloader.submitInactive();"}).html()  
        });
    }
   
    function displayDrivers(searchVal){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var ctr = 0;
        ctr=-1;
        $("#gridDrivers").dataBind({
             sqlCode        : "D1232" 
            ,parameters     : {searchVal:(searchVal ? searchVal : "")}
    	    ,height         : $(window).height() - 300 
    	    ,selectorType   : "checkbox"
    	    ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [ 
        		{ text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='driverpaoloader.mouseover(\"" +  app.svn(d,"img_filename") + "\");' onmouseout='driverpaoloader.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='driverpaoloader.showModalUploadUserImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
		        ,{ text:"Driver's Licence"             , width:90      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='driverpaoloader.mouseover(\"" +  app.svn(d,"driver_licence_img_filename") + "\");' onmouseout='driverpaoloader.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='driverpaoloader.showModalUploadDriverLicenceImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
        		,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='driverpaoloader.showModalViewId(this,\""+ app.svn (d,"user_id") +"\",\""+ app.svn (d,"userFullName") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"role_id") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
                ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){
            
                this.find("[name='role_id']").dataBind("roles");
            }
        });    
    }
    
    function displayPAO(searchVal){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var ctr = 0;
        ctr=-1;
        $("#gridPAO").dataBind({
             sqlCode        : "P1233" 
            ,parameters     : {searchVal:(searchVal ? searchVal : "")}
    	    ,height         : $(window).height() - 300 
    	    ,selectorType   : "checkbox"
    	    ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [ 
        		{ text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='driverpaoloader.mouseover(\"" +  app.svn(d,"img_filename") + "\");' onmouseout='driverpaoloader.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='driverpaoloader.showModalUploadUserImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
    		   
        		,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++;
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='driverpaoloader.showModalViewId(this,\""+ app.svn (d,"user_id") +"\",\""+ app.svn (d,"userFullName") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"role_id") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;"          ,type:"input"       ,name:"name_suffix" }
                ,{text  : "Active?"             , width : 60            , style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){
            
                this.find("[name='role_id']").dataBind("roles");
            }
        });    
    }
    
    function displayAddNewUser(role_id,position,company_id){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var _dataRows = [];
        
        _dataRows.push(
                 {text  : "First Name"     , width : 150           , style : "text-align:center;"
                    ,onRender : function(d){ 
                        return app.bs({name:"user_id"           ,type:"hidden"      ,value: app.svn(d,"user_id")})
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"company_id"         ,type:"hidden"     ,value: company_id})
                            +  app.bs({name:"first_name"        ,type:"input"       ,value: app.svn(d,"first_name")});
                    }
        		}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name" }
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
            
            );
        
        if(role_id === 1){
            _dataRows.push(
                 {text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return app.bs({name:"name_suffix"       ,type:"input"       ,value: app.svn(d,"name_suffix")})
                            +  app.bs({name:"hash_key"          ,type:"hidden"      ,value: app.svn(d,"hash_key")})  
                            +  app.bs({name:"position"          ,type:"hidden"      ,value: position});
                    }
                }
                ,{text  : "Transfer Type"               ,width : 160           ,style : "text-align:center;"          ,type:"select"      ,name:"transfer_type_id"}
                ,{text  : "Bank"                        ,width : 160           ,style : "text-align:center;"          ,type:"select"      ,name:"bank_id"}
                ,{text  : "Transfer No"                 ,width : 130           ,style : "text-align:center;"          
                    ,onRender : function(d){ 
                        return app.bs({name:"transfer_no"       ,type:"input"       ,value: app.svn(d,"transfer_no")})
                            +  app.bs({name:"role_id"           ,type:"hidden"      ,value: role_id});
                    }
                }
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            );
        }else{
            _dataRows.push(
                 {text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return app.bs({name:"name_suffix"       ,type:"input"       ,value: app.svn(d,"name_suffix")})
                            +  app.bs({name:"hash_key"          ,type:"hidden"      ,value: app.svn(d,"hash_key")})  
                            +  app.bs({name:"position"          ,type:"hidden"      ,value: position})
                            +  app.bs({name:"transfer_type_id"          ,type:"hidden"      ,value: app.svn(d,"transfer_type_id")})
                            +  app.bs({name:"bank_id"          ,type:"hidden"      ,value: app.svn(d,"bank_id")})
                            +  app.bs({name:"transfer_no"          ,type:"hidden"      ,value: app.svn(d,"transfer_no")})
                            +  app.bs({name:"role_id"          ,type:"hidden"      ,value: role_id});
                    }
                }
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            );
            
        }
        
        
        $("#gridNewUsers").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : _dataRows
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "tranfer_type"
                   ,value        : "tranfer_type_id"
                });
                _zRow.find("[name='bank_id']").dataBind({
                    sqlCode      : "B1245"
                   ,text         : "bank_code"
                   ,value        : "bank_id"
                });
            }
        });    
    }
    
    function displayInactiveUsers(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveUsers").dataBind({
             sqlCode    : "U77"
            ,parameters : {is_active: "N"}
     	    ,width      : $("#frm_modalWindowInactive").width() - 15
    	    ,height     : 360
            ,dataRows   : [
                
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender :function(d){
                                    return     app.bs({name:"user_id"   ,type:"hidden"  ,value: d.user_id})
                                             + app.bs({name:"is_edited" ,type:"hidden"})
                                             + app.bs({name:"oem_ids"   ,type:"hidden"  ,value:d.oem_ids })
                                             + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );                          
                                } 
                }
                
                
        	   ,{text  : "Corplear logon "     , width : 200           , style : "text-align:center;"          ,type:"input"      ,name:"logon"}
               ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"   }
               ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"    }
               ,{text  : "Middle Initial"      , width : 100           , style : "text-align:center;"           
                   ,onRender: function(d){
                        return  app.bs({name:"middle_name"   ,type:"input"   ,value: d.middle_name})  
                              + app.bs({name:"name_suffix"   ,type:"hidden"  ,value: d.name_suffix})   
                              + app.bs({name:"role_id"       ,type:"hidden"  ,value: d.role_id})
                              + app.bs({name:"is_admin"      ,type:"hidden"  ,value: d.is_admin })
                              +  app.bs({name:"plant_id"     ,type:"hidden"  ,value: d.plant_id})
                              +  app.bs({name:"warehouse_id" ,type:"hidden"  ,value: d.warehouse_id});
                   }
               }
               ,{text  : "Active?"  , width : 70    , style : "text-align:center;"  ,type:"yesno"  ,name:"is_active"    ,defaultValue:"N"}
            ]
            ,onComplete: function(o){
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveCustomers input[name='cb']");
            }
        });  
    }
    
    _public.showModalViewId = function (eL,id,fullName,fileName,positionId,hashKey) {
        var _frm = $("#frm_modalEmpoloyeeId");
        var _$position = $(eL).closest(".zRow").find('[name="role_id"] option[value="'+positionId+'"]').text();
        var _imgFilename = fileName !=="" ? "/file/viewImage?fileName="+fileName : "../img/avatar-m.png";
        _frm.find("#nameId").text(fullName);
        _frm.find("#positionId").text(_$position);
         _frm.find("#idNo").text(id);
        _frm.find("#imgFilename").attr("src", "../img/avatar-m.png");
        $('#modalEmployeesId').modal({ show: true, keyboard: false, backdrop: 'static' });
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:100,height:100}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
    };
    
    _public.showModalUploadUserImage = function(UserId, name){
        user_id = UserId;
        var m =$('#' + mdlImageUser);
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
    
    _public.showModalUploadDriverLicenceImage = function(UserId, name){
        user_id = UserId;
        var m=$('#' + mdlImageDriverLicence);
        m.find(".modal-title").text("Driver's licence image for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
            }
        ); 
    };
    
    _public.uploadImageUser = function(){
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
                    $.get(base_url  + "sql/exec?p=image_driver_pao_upd @user_id=" + user_id
                                    + ",@img_filename='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageUser).modal('toggle');
                        //refresh latest records:
                        displayDrivers();
                        displayPAO();
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
    },
    
    _public.uploadImageDriverLicence = function(){
        var frm = $("#frm_" + mdlImageDriverLicence);
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
                    $.get(base_url  + "sql/exec?p=image_drivers_image_licence_upd @user_id=" + user_id
                                    + ",@driver_licence_img_filename='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageDriverLicence).modal('toggle');
                        
                        //refresh latest records:
                        displayDrivers();
                        displayPAO();
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
    },
    _public.mouseover = function(filename){
         $("#user-box").css("display","block");
         $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
    },
    _public.mouseout = function (){
        $("#user-box").css("display","none");
    };
    _public.submitInactive = function(){
        var _$grid = $("#gridInactiveUsers");
            _$grid.jsonSubmit({
                 procedure: "users_upd"
                ,optionalItems: ["is_active","is_contact"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayDrivers();
                    displayInactiveUsers();
                }
            });
        $('#' + mdlInactive).modal('hide');     
    };
    _public.submitNewUsers = function(){
        $("#gridNewUsers").jsonSubmit({
                 procedure  : "drivers_pao_upd"
                 ,optionalItems: ["is_active","transfer_type_id","bank_id"]
                 ,onComplete : function (data) {
                     if(data.isSuccess===true){
                        zsi.form.showAlert("alert");
                        isNew = false;
                        displayDrivers();
                        displayAddNewUser(gRoleId,gPosition,gCompanyId);
                     }
                }
        });
        
    };
    
    $("#btnNactive").click(function () {
        var g$mdl = $("#" + mdlInactive);
        g$mdl.find(".modal-title").text("Inactive Users") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveUsers();
    });
    
    $("#btnAdd").click(function () {
        var _$mdl = $('#' + mdlAddNewUser);
        _$mdl.find(".modal-title").text("Add New " + gName);
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewUser(gRoleId,gPosition,gCompanyId);
    });
    
    $("#btnSave").click(function () {
        $("#grid").jsonSubmit({
             procedure  : "users_upd"
            ,optionalItems: ["is_active"]
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    $("#grid").trigger("refresh");
                }
            }
        });
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        if(gActiveTab === "drivers") displayDrivers(_searchVal);
        else displayPAO(_searchVal);
        
    }); 
    
    $("#searchVal").on('keypress',function(e){
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           if(gActiveTab === "drivers") displayDrivers(_searchVal);
           else displayPAO(_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            if(gActiveTab === "drivers") displayDrivers();
            else displayPAO();
        }
    });

    
    return _public;
})();                                                 