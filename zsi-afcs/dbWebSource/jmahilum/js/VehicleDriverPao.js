 var vehicledriverpao = (function(){
    var   bs                    = zsi.bs.ctrl 
        ,svn                    = zsi.setValIfNull 
        ,bsButton               = zsi.bs.button
        ,gTw                    = null
        , tblName               = "tblusers"
        ,_public                = {}
        ,mdlAddNewVehicleUser   = "modalWindowAddNewVehicleUser"
        ,mdlImageVehicleUser    = "modalWindowImageVehicleUser"
        ,mdlImageEmpl           = "modalWindowImageEmployee"
        ,mdlImageDriverUser     = "modalWindowImageDriverUser"
        ,mdlImageDriverLicence  = "modalWindowImageDriverLicence"
        ,gRoleId                = 0
        ,gPosition              = 0
        ,gCompanyId             = app.userInfo.company_id
        ,mdlAddNewDriverUser    = "modalWindowAddNewDriverUser" 
        ,mdlImageUserVehicle    = "modalWindowImageUser"
        ,mdlImagePaoUser        = "modalWindowImagePaoUser" 
        ,mdlAddNewPao           = "modalWindowAddNewPao"
        ,gSubTabName            = ""
        ,gTabName               = ""
        ,gSqlCode               = ""
    ;
   
    zsi.ready = function(){
        $(".page-title").html("Vehicle Driver/PAO");
        $(".panel-container").css("min-height", $(window).height() - 190); 
        gTw = new zsi.easyJsTemplateWriter();
        displayVehicles(gCompanyId); 
        displayDrivers(gCompanyId);
        displayPAO(gCompanyId);
        getTemplates();
        setSearch();   
    }; 
    gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text());  
    gTabName = $.trim($(".nav-tab-main").find(".nav-item.active").text());  
    $("#searchVal").attr('placeholder','Search vehicles...');
    $("#searchDiv").removeClass("hide");
    $(".nav-tab-main").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gTabName = $.trim($(e.target).text());
        $(".nav-tab-sub").find(".nav-item").removeClass("active");
        $(".nav-tab-sub").find(".nav-item:first-child()").addClass("active"); 
        if(gTabName === "PAO"){
            gRoleId = 2; 
            gPosition = 4;  
            $("#searchDiv").addClass("hide");
        }
        if(gTabName === "Drivers"){
            gPosition = 3;
            gRoleId = 1;    
            displayDrivers(); 
            gSubTabName = $.trim($(".nav-sub-mfg").find(".nav-item.active").text()); 
            $("#searchVal").attr('placeholder','Search drivers...');
            $("#searchDiv").removeClass("hide");
        }
        if(gTabName === "Vehicles"){
            $("#searchVal").attr('placeholder','Search vehicles...');
            $("#searchDiv").removeClass("hide");
            displayVehicles(gCompanyId);
        } 
    });  
    $(".nav-tab-sub").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());  
        displayDrivers();   
    });  
    $(".nav-tab-vhs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());  
        displayVehicles(gCompanyId);   
    }); 
    _public.mouseover = function(filename){
         $("#user-box").css("display","block");
         $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
    },
    _public.mouseout = function (){
        $("#user-box").css("display","none");
    };  
    _public.showVehicleUploadUserImage = function(Ids, name,license){   
        _paramId = Ids;
        _license = license;
        var m=$('#' + mdlImageUserVehicle); 
        if(gTabName==="Vehicles") m.find(".modal-title").text("Vehicle image for » " + name);
        if(gTabName==="PAO") m.find(".modal-title").text("PAO image for » " + name);
        if(gTabName==="Drivers") m.find(".modal-title").text("Driver image for » " + name);
        if(license) m.find(".modal-title").text("Driver's licence image for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data"); 
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
            }
        ); 
    };  
    _public.uploadImageUserVehicle = function(){ 
        var frm = $("#frm_" + mdlImageUserVehicle);
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
                    if(gTabName==="Vehicles"){
                        $.get(base_url  + "sql/exec?p=image_vehicles_upd @vehicle_id=" + _paramId
                                    + ",@vehicle_img_filename='user." +  fileOrg.files[0].name + "'"
                        ,function(data){
                            zsi.form.showAlert("alert");
                            $('#' + mdlImageUserVehicle).modal('toggle');
                            if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                            //refresh latest records:
                            displayVehicles(gCompanyId);
                        });   
                    }
                    if(gTabName==="PAO" || gTabName==="Drivers"){
                        $.get(base_url  + "sql/exec?p=image_driver_pao_upd @user_id=" + _paramId
                                    + ",@img_filename='user." +  fileOrg.files[0].name + "'"
                        ,function(data){
                            zsi.form.showAlert("alert");
                            $('#' + mdlImageUserVehicle).modal('toggle');  
                            //refresh latest records:
                            if(gTabName==="PAO") displayPAO(gCompanyId); 
                            if(gTabName==="Drivers") displayDrivers(gCompanyId); 
                        });     
                    }
                    if(_license){
                        $.get(base_url  + "sql/exec?p=image_drivers_image_licence_upd @user_id=" + _paramId
                                    + ",@driver_licence_img_filename='user." +  fileOrg.files[0].name + "'"
                        ,function(data){
                            zsi.form.showAlert("alert");
                            $('#' + mdlImageUserVehicle).modal('hide'); 
                            //refresh latest records:
                            displayDrivers(gSubTabName); 
                        });
                    }
                    
                    
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
    _public.showModalViewPaoImage = function (eL,id,fullName,fileName,hashKey){ 
        var _frm = $("#frm_modalPao");  
        var _imgFilename = fileName !=="" ? "/file/viewImage?fileName="+fileName : "../img/avatar-m.png";
        _frm.find("#nameId").text(fullName);  
        _frm.find("#imgFilename").attr("src", _imgFilename); 
        if(gTabName==="Drivers")  _frm.find("#positionId").text("DRIVER"); 
        if(gTabName==="PAO")  _frm.find("#positionId").text("PUBLIC ASSISTANCE OFFICER (PAO)"); 
        $('#modalPao').modal({ show: true, keyboard: false, backdrop: 'static' });
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:100,height:100}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
    };  
    _public.showModalViewInfoVehicles = function (eL,id,vehiclePlateNo,vehicleType,hashKey,fileName) {
        var _frm = $("#frm_modalVehicleId");
        var _fileName = fileName ? "/file/loadFile?filename="+ fileName : "../images/no-image2.jpg";
        var _$vehicleType = $(eL).closest(".zRow").find('[name="vehicle_type_id"] option[value="'+vehicleType+'"]').text();
        _frm.find("#plateNoId").text(vehiclePlateNo);
        _frm.find("#vehicleTypeId").text(_$vehicleType);
        _frm.find("#imgFilename").attr("src", _fileName); 
        $('#modalVehicleId').modal({ show: true, keyboard: false, backdrop: 'static' });
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:100,height:100}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
    }; 
    _public.submitNewPaoUsers = function(){
        $("#gridNewPao").jsonSubmit({
                 procedure  : "drivers_pao_employee_upd"
                 ,optionalItems: ["is_active"] 
                 ,onComplete : function (data) {
                     if(data.isSuccess===true){
                        zsi.form.showAlert("alert");
                        isNew = false;
                        displayPAO(gCompanyId);
                        displayAddNewPao(gRoleId,gPosition,gCompanyId);
                     }
                }
        });
        
    };  
    _public.submitNewDriverUsers = function(){
        $("#gridNewDriverUsers").jsonSubmit({
                 procedure  : "drivers_upd"
                 ,optionalItems: ["is_active"] 
                 ,onComplete : function (data) {
                     if(data.isSuccess===true){
                        zsi.form.showAlert("alert");
                        isNew = false;
                        displayDrivers();
                        displayAddNewDriverUser(gRoleId,gPosition,gCompanyId);
                     }
                }
        });
        
    };  
      
    function setSearch(){
        var _searchVal = "";
        $("#searchVal").on('keyup',function(e){
            _searchVal = $.trim($(this).val()); 
            if($(this).val() === ""){
                if(gTabName === "Vehicles")  displayVehicles(gCompanyId,_searchVal); 
                else if(gTabName === "PAO") displayPAO(gCompanyId,_searchVal);
                else if(gTabName === "Drivers") displayDrivers(_searchVal);
            }
            if (e.which == 13) {
                if(gTabName === "Vehicles")  displayVehicles(gCompanyId,_searchVal); 
                else if(gTabName === "PAO") displayPAO(gCompanyId,_searchVal); 
                else if(gTabName === "Drivers") displayDrivers(_searchVal);
            }  
        }); 
        $("#btnSearchVal").click(function(){  
            if(gTabName === "Vehicles") displayVehicles(gCompanyId,_searchVal); 
            if(gTabName === "PAO") displayPAO(gCompanyId,_searchVal); 
            if(gTabName === "Drivers") displayDrivers(_searchVal);
        });   
    } 
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())  
        .bsModalBox({
              id        : mdlImageUserVehicle
            , sizeAttr  : "modal-md"
            , title     : "Inactive Users"
            , body      : ""
            , footer    : gTw.new().modalBodyVehicleImageUser({onClickUploadImageUser:"vehicledriverpao.uploadImageUserVehicle();"}).html()  
        }) 
        .bsModalBox({
              id        : mdlImageDriverUser
            , sizeAttr  : "modal-md"
            , title     : "Image Driver Users"
            , body      : ""
            , footer    : gTw.new().modalBodyImageDriverUser({onClickUploadImageDriverUser:"vehicledriverpao.uploadImageDriverUser();"}).html()  
        })
        .bsModalBox({
              id        : mdlImagePaoUser
            , sizeAttr  : "modal-md"
            , title     : "Image Driver Users"
            , body      : ""
            , footer    : gTw.new().modalBodyImagePaoUser({onClickUploadImagePaoUser:"vehicledriverpao.uploadImagePaoUser();"}).html()  
        }) 
        .bsModalBox({
              id        : mdlImageDriverLicence
            , sizeAttr  : "modal-md"
            , title     : "Driver's Licence"
            , body      : ""
            , footer    : gTw.new().modalBodyImageDriverLicence({onClickUploadImageDriverLicence:"vehicledriverpao.uploadImageDriverLicence();"}).html()  
        }) 
        .bsModalBox({
              id        : mdlAddNewDriverUser
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddDriverUsers({grid:"gridNewDriverUsers",onClickSaveNewDriverUsers:"vehicledriverpao.submitNewDriverUsers();"}).html()  
        })
         
        .bsModalBox({
              id        : mdlAddNewPao
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddPaoUsers({grid:"gridNewPao",onClickSaveNewPao:"vehicledriverpao.submitNewPaoUsers();"}).html()  
        });
        
    }   
    function displayDrivers(searchVal){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var ctr=-1
            ,_params = {
                client_id: gCompanyId
                ,tab_id : 0
                ,searchVal:(searchVal ? searchVal : "")
            }; 
        switch(gTabName){  
            case "Drivers":  
                switch (gSubTabName) {  
                    case "(15)Days for Renewal":  
                        _params.tab_id = 2;
                    break;
                    case "(30)Days for Renewal":  
                        _params.tab_id = 3;
                    break;
                    case "Expired License":  
                       _params.tab_id = 4;
                    break; 
                }
            break; 
        }  
        $("#gridDriversLicensed").dataBind({
             sqlCode        : "D1232"  
            ,parameters     : _params
    	    ,height         : $(window).height() - 300 
    	    ,selectorType   : "checkbox" 
            ,dataRows       : [ 
        		{ text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
    		        ctr++;
                        var mouseMoveEvent= "onmouseover='vehicledriverpao.mouseover(\"" +  app.svn(d,"img_filename") + "\");' onmouseout='vehicledriverpao.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicledriverpao.showVehicleUploadUserImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
		        ,{ text:"Driver's Licence"             , width:90      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='vehicledriverpao.mouseover(\"" +  app.svn(d,"driver_licence_img_filename") + "\");' onmouseout='vehicledriverpao.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicledriverpao.showVehicleUploadUserImage(\""+ app.svn (d,"user_id") +"\",\"" 
    		                           + app.svn(d,"full_name") + "\",\""+ "License" +"\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
        		,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++; 
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewPaoImage(this,\""+ app.svn (d,"user_id") +"\",\""+ app.svn (d,"full_name") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : ""); 
                    }
                }
                
                ,{text  : "Last Name"     , width : 150           , style : "text-align:center;"    ,sortColNo:4
                    ,onRender : function(d){ 
                        return app.bs({name:"user_id"           ,type:"hidden"      ,value: app.svn(d,"user_id")}) 
                            +  app.bs({name:"client_id"         ,type:"hidden"     ,value: gCompanyId})
                            +  app.bs({name:"emp_hash_key"      ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")}) 
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"last_name"         ,type:"input"       ,value: app.svn(d,"last_name")});
                    }
        		}
                ,{text  : "First Name"                  , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"  ,sortColNo:5} 
                ,{text  : "Middle Initial"              ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"middle_name"}
                ,{text  : "Name Suffix"                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"name_suffix"}
                ,{text  : "Academy No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_academy_no"}
                ,{text  : "License No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_license_no"}
                ,{text  : "License Expr. Date"          ,width : 120           ,style : "text-align:center;"          
                     ,onRender : function(d){ 
                        return app.bs({name:"driver_license_exp_date"       ,type:"input"       ,value: app.svn(d,"driver_license_exp_date").toShortDate()}) 
                            +  app.bs({name:"position_id"               ,type:"hidden"      ,value: gPosition});
                    }
                } 
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}  
            ] 
            ,onComplete: function(o){
                 var _zRow = this.find(".zRow");
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
                _zRow.find("[name='driver_license_exp_date']").datepicker({
                     autoclose : true
                    ,todayHighlight: false  
                }).datepicker("setDate",'0');
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
            }
        });    
    }  
    function displayVehicles(gCompanyId,searchVal){ 
        $("#linkDiv").addClass("hide"); 
        var ctr=-1
            ,_params = {
                client_id: gCompanyId
                ,tab_id : 0
                ,searchVal:(searchVal ? searchVal : "")
            }
            ,_sqlCode = "V1229"; 
        switch(gTabName){  
            case "Vehicles":  
                switch (gSubTabName) {  
                    case "All":  
                       $("#linkDiv").addClass("hide");
                       $("#gridVehicles").removeClass("hide");
                       $("#forExpiration").addClass("hide"); 
                    break;
                    case "For Registration":  
                        displayForRegistration(gCompanyId);
                        $("#linkDiv").removeClass("hide");
                        $("#gridVehicles").addClass("hide"); 
                        $("#forExpiration").removeClass("hide"); 
                    break;
                    case "Registration Expired": 
                        $("#forExpiration").addClass("hide"); 
                        $("#gridVehicles").removeClass("hide");
                        $("#linkDiv").addClass("hide");
                    break;
                    case "Insurance": 
                        displayForRegistration(gCompanyId);
                        $("#linkDiv").removeClass("hide");
                        $("#gridVehicles").addClass("hide"); 
                        $("#forExpiration").removeClass("hide"); 
                    break;
                }
            break; 
        } 
        
        $("#gridVehicles").dataBind({
             sqlCode        :  (_sqlCode ? _sqlCode : gSqlCode) 
            ,parameters     : {client_id: gCompanyId, searchVal:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 240
            ,dataRows       : [
                { text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='vehicledriverpao.mouseover(\"" +  app.svn(d,"vehicle_img_filename") + "\");' onmouseout='vehicledriverpao.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicledriverpao.showVehicleUploadUserImage(" + app.svn(d,"vehicle_id") +",\"" 
    		                           + app.svn(d,"vehicle_plate_no") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
                ,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewInfoVehicles(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\", \""+ app.svn (d,"vehicle_type_id") +"\",\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Vehicle Plate No."                 ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"company_id"               ,type:"hidden"      ,value: gCompanyId}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"vehicle_plate_no"         ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")}) ; 
                        }
                }
                ,{text: "Route"                                                                 ,width : 100   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return    app.bs({name:"route_id"                  ,type:"select"      ,value: app.svn(d,"route_id")})  
                                 +  app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")}) ; 
                        }
                }
                ,{text: "Vehicle Type"                                                          ,width : 160   ,style : "text-align:left;"
                            ,onRender  :  function(d)  
                        { return    app.bs({name:"vehicle_type_id"          ,type:"select"      ,value: app.svn(d,"vehicle_type_id")})  
                                 +  app.bs({name:"transfer_type_id"         ,type:"hidden"      ,value: app.svn(d,"transfer_type_id")})
                                 +  app.bs({name:"bank_id"                  ,type:"hidden"      ,value: app.svn(d,"bank_id")})   
                                 +  app.bs({name:"transfer_no"              ,type:"hidden"      ,value: app.svn(d,"transfer_no")})      
                                 +  app.bs({name:"account_name"             ,type:"hidden"      ,value: app.svn(d,"account_name")}); 
                        }        
                }
                ,{text:"Exp Registration Date"                                                                      ,width:120       ,style:"text-align:left"
                    ,onRender: function(d){ return app.bs({name:"exp_registration_date"     ,type:"input"    ,value: app.svn(d,"exp_registration_date").toShortDate()});
                       
                    }
                }
                ,{text:"Exp Insurance Date"                                                                         ,width:120       ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({name:"exp_insurance_date"        ,type:"input"       ,value: app.svn(d,"exp_insurance_date").toShortDate()})
                             + app.bs({name:"vehicle_maker_id"          ,type:"hidden"      ,value: app.svn(d,"vehicle_maker_id")});
                    }
                }
                ,{text:"Odometer Reading"                   ,type:"input"           ,name:"odometer_reading"         ,width:150       ,style:"text-align:left"} 
                ,{text: "Active?"                           ,name:"is_active"                   ,type:"yesno"       ,width : 55    ,style : "text-align:center;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "R1224"
                   ,text         : "route_code"
                   ,value        : "route_id"
                });
                _zRow.find("[name='vehicle_type_id']").dataBind({
                    sqlCode      : "D1307"
                   ,text         : "vehicle_type"
                   ,value        : "fare_id"
                });
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
                _zRow.find("[name='bank_id']").dataBind({
                    sqlCode      : "B1245"
                   ,text         : "bank_code"
                   ,value        : "bank_id"
                });
                exportToExcel(this);
            }
        });
    }   
    function displayPAO(companyId, searchVal){    
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        var ctr=-1;
        $("#gridPAO").dataBind({
             sqlCode        : "P1233" 
            ,parameters     : {client_id: companyId, searchVal:(searchVal ? searchVal : "")}
    	    ,height         : $(window).height() - 300 
    	    ,selectorType   : "checkbox"
    	    ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [ 
        		{ text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){  
                        var mouseMoveEvent= "onmouseover='vehicledriverpao.mouseover(\"" +  app.svn(d,"img_filename") + "\");' onmouseout='vehicledriverpao.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicledriverpao.showVehicleUploadUserImage(" + app.svn(d,"user_id") +",\"" 
    		                           + app.svn(d,"full_name") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    } 
        		,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++; 
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewPaoImage(this,\""+ app.svn (d,"user_id") +"\",\""+ app.svn (d,"full_name") +"\",\""+ app.svn (d,"img_filename") +"\",\""+ app.svn (d,"hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : ""); 
                    }
                }
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"      ,sortColNo:4
                    ,onRender : function(d){
                         return app.bs({name:"user_id"          ,type:"hidden"      ,value: app.svn(d,"user_id")}) 
                            +  app.bs({name:"client_id"         ,type:"hidden"      ,value: companyId})
                            +  app.bs({name:"emp_hash_key"      ,type:"hidden"      ,value: app.svn(d,"hash_key")})   
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"first_name"        ,type:"input"       ,value: app.svn(d,"first_name")});
                    }
                }
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"       ,sortColNo:6}
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return      app.bs({name:"name_suffix"              ,type:"input"       ,value: app.svn(d,"name_suffix")}) 
                                +   app.bs({name:"position_id"               ,type:"hidden"      ,value:  gPosition}) 
                    }
                }
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
    function displayAddNewDriverUser(role_id,position,company_id){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var _dataRows = [];
        
        _dataRows.push(
                 {text  : "Last Name"     , width : 150           , style : "text-align:center;"
                    ,onRender : function(d){ 
                        return app.bs({name:"user_id"           ,type:"hidden"      ,value: app.svn(d,"user_id")}) 
                            +  app.bs({name:"client_id"         ,type:"hidden"     ,value: company_id})
                            +  app.bs({name:"emp_hash_key"      ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")}) 
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"last_name"         ,type:"input"       ,value: app.svn(d,"last_name")});
                    }
        		}
                ,{text  : "First Name"                  , width : 150          , style : "text-align:left;"            ,type:"input"       ,name:"first_name" } 
                ,{text  : "Middle Initial"              ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"middle_name"}
                ,{text  : "Name Suffix"                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"name_suffix"}
                ,{text  : "Academy No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_academy_no"}
                ,{text  : "License No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_license_no"}
                ,{text  : "License Expr. Date"          ,width : 120           ,style : "text-align:center;"          
                     ,onRender : function(d){ 
                        return app.bs({name:"driver_license_exp_date"       ,type:"input"       ,value: app.svn(d,"driver_license_exp_date").toShortDate()}) 
                            +  app.bs({name:"position_id"               ,type:"hidden"      ,value: position});
                    }
                } 
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            
            ); 
        $("#gridNewDriverUsers").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : _dataRows
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter1']").setCheckEvent("#gridNewDriverUsers input[name='cb']");
                 _zRow.find("[name='driver_license_exp_date']").datepicker({
                     autoclose : true
                    ,todayHighlight: false  
                }).datepicker("setDate",'0'); 
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
    function displayAddNewPao(role_id,position,company_id){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        var _dataRows = [];
        
        _dataRows.push(
                 {text  : "First Name"     , width : 150           , style : "text-align:center;"
                    ,onRender : function(d){ 
                        return app.bs({name:"user_id"           ,type:"hidden"      ,value: app.svn(d,"user_id")}) 
                            +  app.bs({name:"client_id"        ,type:"hidden"       ,value: company_id})
                            +  app.bs({name:"emp_hash_key"      ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")})   
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"first_name"        ,type:"input"       ,value: app.svn(d,"first_name")});
                    }
        		}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name" }
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return      app.bs({name:"name_suffix"              ,type:"input"       ,value: app.svn(d,"name_suffix")}) 
                                +   app.bs({name:"position_id"               ,type:"hidden"      ,value: position}) 
                    }
                }
                ,{text  : "Active?"                     ,width : 60            ,style : "text-align:center;"          ,type:"yesno"       ,name:"is_active"       ,defaultValue: "Y"}
            ); 
        
        $("#gridNewPao").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : _dataRows
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter1']").setCheckEvent("#gridNewPao input[name='cb']");
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
                _zRow.find("[name='driver_license_exp_date']").datepicker({
                     autoclose : true
                    ,todayHighlight: false  
                }).datepicker("setDate",'0');
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
            }
        });    
    }  
    function exportToExcel(grid){   
        var _$grid = $("#" + grid[0].id);  
        $("#btnUploadExcel").click(function(e){
             e.preventDefault();
            var _$wrap = $("#cloneWrapper");
            var _filename = gTabName;  
            _$grid.clone().appendTo("#cloneWrapper");
            setTimeout(function(){ 
                _$grid.convertToTable(
                    function($table){  
                        $table.htmlToExcel({
                        fileName: _filename
                    }); 
                     _$wrap.empty(); 
                    }
                ); 
            },1000);
        });
         
    }  
    function displayForRegistration(companyId,link){
        var _sqlCode = "P1233";
        if(link=="expire") _sqlCode = "P1233"
        if(link=="renew") _sqlCode = "P1234" 
         
        $("#gridExpiration").dataBind({
             sqlCode    : _sqlCode
            ,parameters : {client_id:companyId, is_active: "Y"}
     	    ,width      : $("#frm_modalInactivePao").width() - 15
    	    ,height     : 360
            ,dataRows   : [ 
                {text  : "First Name"     , width : 150           , style : "text-align:center;"
                    ,onRender : function(d){ 
                        return app.bs({name:"user_id"           ,type:"hidden"      ,value: app.svn(d,"user_id")}) 
                            +  app.bs({name:"client_id"         ,type:"hidden"       ,value: companyId})
                            +  app.bs({name:"emp_hash_key"      ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")})   
                            +  app.bs({name:"is_edited"         ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"first_name"        ,type:"input"       ,value: app.svn(d,"first_name")});
                    }
        		}
                ,{text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name" }
                ,{text  : "Middle Initial"      , width : 130           , style : "text-align:center;"          ,type:"input"       ,name:"middle_name" }
                ,{text  : "Name Suffix"         , width : 100           , style : "text-align:center;" 
                    ,onRender : function(d){ 
                        return      app.bs({name:"name_suffix"              ,type:"input"       ,value: app.svn(d,"name_suffix")}) 
                                +   app.bs({name:"position_id"               ,type:"hidden"      ,value:  gPosition}) 
                    }
                }
                ,{text  : "Active?"  , width : 70    , style : "text-align:center;"  ,type:"yesno"  ,name:"is_active"    ,defaultValue:"N"}
            ]
            ,onComplete: function(o){ 
                this.find("[name='cbFilter']").setCheckEvent("#gridInactivePao input[name='cb']");
            }
        });  
    }
     $("#forExp").click(function(){ 
        displayForRegistration(gCompanyId,"expire");
    });
    $("#forRen").click(function(){ 
        displayForRegistration(gCompanyId,"renew");
    });
    $("#btnSaveVehicles").click(function () {
       $("#gridVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
            }
        });
    });  
    $("#btnSaveInactiveVehicles").click(function () {
       $("#gridInactiveVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
                $('#modalInactiveVehicles').modal('toggle');
            }
        });
    }); 
    $("#btnDeleteVehicles").click(function(){
        zsi.form.deleteData({
             code       : "ref-00015"
            ,onComplete : function(data){
                $('#gridVehicles').trigger('refresh');
                $('#modalInactiveVehicles').modal('toggle');
            }
        });       
    }); 
    $("#btnNactivePao").click(function () {
        var _$body = $("#frm_modalInactivePao").find(".modal-body"); 
        g$mdl = $("#modalInactivePao");
        g$mdl.find(".modal-title").text("Inactive Pao(s)") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactivePao();
    }); 
    $("#btnAddDrivers").click(function () {
        var _$mdl = $('#' + mdlAddNewDriverUser);
        _$mdl.find(".modal-title").text("Add New " + "Driver(s)");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewDriverUser(gRoleId,gPosition,gCompanyId);
    });
    $("#addNewPao").click(function () {
        var _$mdl = $('#' + mdlAddNewPao);
        _$mdl.find(".modal-title").text("Add New " + "PAO(s)");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewPao(gRoleId,gPosition,gCompanyId);
    }); 
    $("#btnSavePaoTable").click(function () {
        $("#gridPAO").jsonSubmit({
             procedure  : "drivers_pao_employee_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    displayPAO(gCompanyId);  
                }
            }
        });
    }); 
    $("#btnSaveUpdateDrivers").click(function () {
        $("#gridDriversLicensed").jsonSubmit({
             procedure  : "drivers_upd"
            ,optionalItems: ["is_active"] 
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    displayDrivers();  
                }
            }
        });
    }); 
    return _public;
})();                                                                      