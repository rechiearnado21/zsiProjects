var vehicles = (function(){
    var _pub                = {}
        ,bs                 = zsi.bs.ctrl
        ,gtw                = null
        ,mdlAddNewUser      = "modalWindowAddNewUser"
        ,gMdlUploadExcel    = "modalWindowUploadExcel"
        ,gCompanyId         = app.userInfo.company_id
        ,mdlImageUser       = "modalWindowImageUser"
    ;
    zsi.ready = function(){
        $(".page-title").html("Vehicles");
        gtw = new zsi.easyJsTemplateWriter();
        displayVehicles(gCompanyId);
        getTemplates();
    };
    
   _pub.excelFileUpload = function(){
        var frm      = $("#frm_modalWindowUploadExcel");
        var formData = new FormData(frm.get(0));
        var files    = frm.find("input[name='file']").get(0).files; 
    
        if(files.length===0){
            alert("Please select excel file.");
            return;    
        } 
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
    _pub.showModalUpload = function(o,tabName){
        $.get(app.execURL +  "excel_upload_sel @load_name ='" + tabName +"'"
        ,function(data){
            g$mdl = $("#" + gMdlUploadExcel);
            g$mdl.find(".modal-title").text("Upload Excel for » " + tabName ) ;
            g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            $("#tmpData").val(data.rows[0]);
            
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
            , footer    : gtw.new().modalBodyImageUser({onClickUploadImageUser:"vehicles.uploadImageUser();"}).html()  
        })
        .bsModalBox({
              id        : mdlAddNewUser
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gtw.new().modalBodyAddUsers({grid:"gridNewVehicles",onClickSaveNewUsers:"vehicles.submitNewVehicles();"}).html()  
        })
        .bsModalBox({
              id        : gMdlUploadExcel
            , sizeAttr  : "modal-lg"
            , title     : ""
            , body      : gtw.new().modalBodyUploadExcel({onClickUploadExcel:"excelFileUpload();"}).html()  
        });
         
    }
    
    function displayVehicles(company_id,searchVal){
        $("#gridVehicles").dataBind({
             sqlCode        : "V1229" 
            ,parameters     : {searchVal:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 240
            ,dataRows       : [
                { text:"Photo"             , width:40      , style:"text-align:center;" 
    		    ,onRender : function(d){ 
                        var mouseMoveEvent= "onmouseover='vehicles.mouseover(\"" +  app.svn(d,"vehicle_img_filename") + "\");' onmouseout='vehicles.mouseout();'";
                        var html = "<a href='javascript:void(0);' "+ mouseMoveEvent +" class='btn btn-sm has-tooltip' onclick='vehicles.showModalUploadUserImage(" + app.svn(d,"vehicle_id") +",\"" 
    		                           + app.svn(d,"vehicle_plate_no") + "\");' data-toggle='tooltip' data-original-title='Upload Image'><i class='fas fa-image'></i> </a>";
                        return (d!==null ? html : "");
                    }
    		    }
                ,{text:"Info"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicles.showModalViewInfo(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\", \""+ app.svn (d,"vehicle_type_id") +"\",\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Vehicle Plate No."                 ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"company_id"               ,type:"hidden"      ,value: company_id}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"vehicle_plate_no"         ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")}) ;
                                 
                        }
                }
                ,{text: "Route"                                                                 ,width : 100   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_id"                  ,type:"select"      ,value: app.svn(d,"route_id")})  
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")});
                                 
                        }
                }
                ,{text: "Vehicle Type"                      ,name:"vehicle_type_id"             ,type:"select"      ,width : 160   ,style : "text-align:left;"}
                ,{text: "Transfer Type"                     ,name:"transfer_type_id"            ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Bank"                              ,name:"bank_id"                     ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Transfer No"                       ,name:"transfer_no"                 ,type:"input"       ,width : 100   ,style : "text-align:left;"}
                ,{text: "Account Name"                      ,name:"account_name"                ,type:"input"       ,width : 150   ,style : "text-align:left;"}
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
            }
        });
    }
    
    function displayAddNewVehicle(company_id){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        
        $("#gridNewVehicles").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: "Vehicle Plate No."                 ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"company_id"               ,type:"hidden"      ,value: company_id}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"vehicle_plate_no"         ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")}) ;
                                 
                        }
                }
                ,{text: "Route"                                                                 ,width : 100   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_id"                  ,type:"select"      ,value: app.svn(d,"route_id")})  
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")});
                                 
                        }
                }
                ,{text: "Vehicle Type"                      ,name:"vehicle_type_id"             ,type:"select"      ,width : 160   ,style : "text-align:left;"}
                ,{text: "Transfer Type"                     ,name:"transfer_type_id"            ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Bank"                              ,name:"bank_id"                     ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Transfer No"                       ,name:"transfer_no"                 ,type:"input"       ,width : 100   ,style : "text-align:left;"}
                ,{text: "Account Name"                      ,name:"account_name"                ,type:"input"       ,width : 150   ,style : "text-align:left;"}
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
                    sqlCode      : "V1230"
                   ,text         : "vehicle_type"
                   ,value        : "vehicle_type_id"
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
            }
        });    
    }
    
    function displayInactiveVehicles(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveVehicles").dataBind({
             sqlCode        : "V1229" 
            ,parameters     : {is_active:'N'}
            ,height         : 360
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                                 + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + (d !==null ? app.bs({name:"cb"    ,type:"checkbox"}) : "" );
                            
                        }
                }
                ,{text: "Vehicle Plate No."                                                                  ,width : 250   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"vehicle_plate_no"          ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")})
                                 + app.bs({name:"route_id"                  ,type:"hidden"      ,value: app.svn(d,"route_id")})
                                 + app.bs({name:"company_code"              ,type:"hidden"      ,value: app.svn(d,"company_code")})
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                 + app.bs({name:"vehicle_type_id"           ,type:"hidden"      ,value: app.svn(d,"vehicle_type_id")});
                                 
                        }
                }
                ,{text: "Active?"                      ,name:"is_active"               ,type:"yesno"       ,width : 55   ,style : "text-align:left;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveVehicles input[name='cb']");
            }
        });
    }
     _pub.mouseover = function(filename){
         $("#user-box").css("display","block");
         $("#user-box img").attr("src",base_url + "file/viewImage?fileName=" +  filename + "&isThumbNail=n");
    },
    _pub.mouseout = function (){
        $("#user-box").css("display","none");
    };
    _pub.showModalViewInfo = function (eL,id,vehiclePlateNo,vehicleType,hashKey,fileName) {
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
    _pub.submitNewVehicles = function(){
        $("#gridNewVehicles").jsonSubmit({
                 procedure: "vehicle_upd"
                ,optionalItems: ["route_id","vehicle_type_id","is_active"]
                ,onComplete : function (data) {
                    if(data.isSuccess===true){
                       zsi.form.showAlert("alert");
                       isNew = false;
                       displayVehicles(gCompanyId);
                       displayAddNewVehicle(gCompanyId);
                    }
                }
        });
        
    };
    
    _pub.showModalUploadUserImage = function(UserId, name){
        vehicle_id = UserId;
        var m=$('#' + mdlImageUser);
        
        m.find(".modal-title").text("Vehicle image for » " + name);
        m.modal("show");
        m.find("form").attr("enctype","multipart/form-data");
        
        $.get(base_url + 'page/name/tmplImageUpload'
            ,function(data){
                m.find('.modal-body').html(data);
                m.find("#prefixKey").val("user.");
            }
        ); 
    };
    
    _pub.uploadImageUser = function(){
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
                    $.get(base_url  + "sql/exec?p=image_vehicles_upd @vehicle_id=" + vehicle_id
                                    + ",@vehicle_img_filename='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert");
                        $('#' + mdlImageUser).modal('toggle');
                        
                        //refresh latest records:
                        displayVehicles(gCompanyId);
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
    
    $("#btnAdd").click(function () {
        var _$mdl = $('#' + mdlAddNewUser);
        _$mdl.find(".modal-title").text("Add New Vehicle(s)");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewVehicle(gCompanyId);
    });
    
    $("#btnInactive").click(function(){
       var _$body = $("#frm_modalInactive").find(".modal-body"); 
        g$mdl = $("#modalInactiveVehicles");
        g$mdl.find(".modal-title").text("Inactive Vehicles") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveVehicles();
    });
    
    $("#btnSaveVehicles").click(function () {
       $("#gridVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,optionalItems: ["route_id","vehicle_type_id","is_active"]
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
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        displayVehicles(gCompanyId,_searchVal);
        
    }); 
    
    $("#searchVal").on('keypress',function(e){
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           displayVehicles(gCompanyId,_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            displayVehicles(gCompanyId);
        }
    });
    
    return _pub;
})();                            