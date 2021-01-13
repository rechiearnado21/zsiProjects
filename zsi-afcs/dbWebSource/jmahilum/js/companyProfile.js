    
  var ci = (function(){
    var  bs                  = zsi.bs.ctrl
        ,_pub                = {}
        ,gOrderListIndex     = null
        ,gCompanyId          = null
        ,gTw                 = null
        ,mdlImageUser        = "modalWindowImageUser"
        ,gCompanyInfoData    = []
        ,count               = 0
    ;
    
    zsi.ready = function(){
        gTw = new zsi.easyJsTemplateWriter();
        $(".page-title").html("Company Information");
        getTemplates();
        displayCompanyInfo();
        displayCompanyProfile();
        displaySaveButton();
        var _developer = $("#modalCompanyInfo").find("#frm_modalCompanyInfo");
        var _notDeveloper = $("#panelNotDeveloper");
        if(app.userInfo.company_id == 2){ 
            $("#panelDeveloper").removeClass("hide");
            companyProfileMandatory(_developer); 
        }else{
            $("#panelNotDeveloper").removeClass("hide");
            companyProfileMandatory(_notDeveloper);
        }
       
    };
    _pub.getOrderListData = function(){
        return gCompanyInfoData[gOrderListIndex]; 
    };
    _pub.showUpdateCompanyInfo = function(data){ 
        gCompanyId = data.company_id;
        var _$mdl = $("#modalCompanyInfo");
        var _$frm = $("#frm_modalCompanyInfo");
            _$mdl.find(".modal-title").html("Company Information");
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            _$frm.find("#company_id").val(data.company_id); 
            _$frm.find("#company_codes").val(data.company_code);
            _$frm.find("#company_name").val(data.company_name);
            _$frm.find("#contact_name").val(data.contact_name);
            _$frm.find("#company_landline").val(data.company_landline);
            _$frm.find("#company_mobile").val(data.company_mobile);
            _$frm.find("#company_tin").val(data.company_tin);
            _$frm.find("#company_tins").val(data.company_tin);
            _$frm.find("#emal_add").val(data.emal_add);  
            _$frm.find("#account_no").val(data.account_no);
            _$frm.find("#company_address").val(data.company_address);  
            _$frm.find("#city_id").attr("selectedValue",data.city_id);
            _$frm.find("#bank_id").attr("selectedValue",data.bank_id);
            _$frm.find("#bank_id").dataBind({
                 sqlCode    : "B1245" //bank_sel 
                ,text       : "bank_code"
                ,value      : "bank_id" 
            });
            $("#state_id").dataBind({
                sqlCode : "D1275" //dd_states_sel
                ,text : "state_name"
                ,value : "state_id"
                ,onChange : function(d){
                    var _info = d.data[d.index - 1]
                        ,state_id = isUD(_info) ? "" : _info.state_id;
                       
                    $("#city_id").dataBind({
                        sqlCode      : "D1273" //dd_cities_sel
                        ,parameters   : {state_id:state_id}
                        ,text         : "city_name"
                        ,value        : "city_id"
                        ,onChange     : function(d){
                            var _info = d.data[d.index - 1]
                                ,city_id = isUD(_info) ? "" : _info.city_id;
                        }
                    });
                }
            }); 
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
                    $.get(base_url  + "sql/exec?p=dbo.image_file_upd @company_id=" + company_id
                                    + ",@company_logo='user." +  fileOrg.files[0].name + "'"
                    ,function(data){
                        zsi.form.showAlert("alert"); 
                        $('#' + mdlImageUser).modal('toggle');  
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
    _pub.showModalUploadUserImage = function(UserId, name){
        company_id = UserId;
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
    
    function companyProfileMandatory(grid){ 
        grid.markMandatory({       
            "groupNames":[
                {
                     "names" : ["company_name","contact_name","company_mobile","company_landline","company_address","city_id","bank_id","account_no"]
                } 
            ]      
            ,"groupTitles":[ 
                 {"titles" : ["Company Name","Contact Name","Company Mobile","Company Landline","Company Address","Province/State to proceed city","Bank","Account No"]}
            ]
        }); 
     } 
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty()) 
        .bsModalBox({
              id        : mdlImageUser
            , sizeAttr  : "modal-md"
            , title     : "Inactive Users"
            , body      : ""
            , footer    : gTw.new().modalBodyImageUser({onClickUploadImageUser:"ci.uploadImageUser();"}).html()  
        }) ;
    } 
    function getRowIndexUpdateInfo(){
        var _indx = $("#gridCompanyInfo").find("input[type='radio']:checked").closest(".zRow").index();
        if(isUD(_indx)) _indx = -1;
        return _indx;
    }
    function displayCompanyInfo(){ 
        var rb = app.bs({name:"rb",type:"radio",style:" width: 13px; margin:0 5px;", value:""});
        $("#gridCompanyInfo").dataBind({
             sqlCode        : "C1319" //[company_info_for_developer_sel]
            ,height         : $(window).height() - 240
            ,blankRowsLimit : 5
            ,dataRows       : [
                { text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"company_id"                ,type:"hidden"      ,value: app.svn (d,"company_id")}) 
                                 + app.bs({name:"is_edited"               ,type:"hidden"      ,value: app.svn (d,"is_edited")})
                                 + (d !==null ? app.bs({name:"rb"         ,type:"radio",style:" width: 13px; margin:0 5px;", value:""}) : "" ); 
                        }
                }
                ,{text: "Registration Code"         ,name:"registration_code"           ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Company Code"              ,name:"company_code"                ,type:"input"       ,width : 120   ,style : "text-align:left;"}
                ,{text: "Company Name"              ,name:"company_name"                ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Contact Name"              ,name:"contact_name"                ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Company Landline"          ,name:"company_landline"            ,type:"input"       ,width : 120   ,style : "text-align:left;"}
                ,{text: "Company Mobile"            ,name:"company_mobile"              ,type:"input"       ,width : 120   ,style : "text-align:left;"}
                ,{text: "Company Tin"               ,name:"company_tin"                 ,type:"input"       ,width : 120   ,style : "text-align:left;"}
                ,{text: "Email Add"                 ,name:"emal_add"                    ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Bank"                      ,name:"bank_name"                   ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Account No."               ,name:"account_no"                  ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Company Address"           ,name:"company_address"             ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "City"                      ,name:"city_name"                   ,type:"input"       ,width : 150   ,style : "text-align:left;"} 
            ]
            ,onComplete: function(o){
                gCompanyInfoData = o.data.rows; 
                $("[name='cbFilter1']").setCheckEvent("#gridCompanyInfo input[name='rb']");
            }
        });
    }
    function displayCompanyProfile(){
        var _companyId = app.userInfo.company_id;  
        zsi.getData({ 
             sqlCode        : "C1278" //C1278 
            ,onComplete : function(d) {
                var data = d.rows[0]; 
                var _$frm =  $("#panelNotDeveloper").find("#frm_CompanyInfo"); 
                /*_$frm.find("#city_id").select2({placeholder: "",allowClear: true});
                _$frm.find("#bank_id").select2({placeholder: "",allowClear: true});
                _$frm.find("#state_id").select2({placeholder: "",allowClear: true});*/
                _$frm.find("#company_id").val(data.company_id); 
                _$frm.find("#company_codes").val(data.company_code);
                _$frm.find("#company_name").val(data.company_name);
                _$frm.find("#contact_name").val(data.contact_name);
                _$frm.find("#company_landline").val(data.company_landline);
                _$frm.find("#company_mobile").val(data.company_mobile);
                _$frm.find("#company_tin").val(data.company_tin);
                _$frm.find("#company_tins").val(data.company_tin);
                _$frm.find("#emal_add").val(data.emal_add);  
                _$frm.find("#account_no").val(data.account_no);
                _$frm.find("#company_address").val(data.company_address);  
                _$frm.find("#city_id").attr("selectedValue",data.city_id);
                _$frm.find("#bank_id").attr("selectedValue",data.bank_id); 
                _$frm.find("#state_id").dataBind({
                    sqlCode : "D1275" //dd_states_sel
                    ,text : "state_name"
                    ,value : "state_id"
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? "" : _info.state_id;
                           
                        _$frm.find("#city_id").dataBind({
                            sqlCode      : "D1273" //dd_cities_sel
                            ,parameters   : {state_id:state_id}
                            ,text         : "city_name"
                            ,value        : "city_id"
                            ,onChange     : function(d){
                                var _info = d.data[d.index - 1]
                                    ,city_id = isUD(_info) ? "" : _info.city_id;
                            }
                        });
                    }
                });
                _$frm.find("#bank_id").dataBind({
                     sqlCode    : "B1245" //bank_sel 
                    ,text       : "bank_code"
                    ,value      : "bank_id" 
                });
            }
        });
    }
    function displaySaveButton(){ 
        var _companyName = app.userInfo.company_code;
        var _companyId   = app.userInfo.company_id; 
        if(app.userInfo.company_id == 2){
            $("#modalCompanyInfo").find("#btnUploadLogo").click(function(){  
                _pub.showModalUploadUserImage(_companyId,_companyName);
            });
            $("#modalCompanyInfo").find("#btnSaveUpdateInfo").click(function(){ 
                var _$frm = $("#modalCompanyInfo").find("#frm_modalCompanyInfo");
                if(_$frm.checkMandatory()!==true) return false; 
                _$frm.jsonSubmit({
                     procedure: "company_info_upd" 
                    ,isSingleEntry: true
                    ,onComplete: function (data) { 
                        if(data.isSuccess){
                            var _id = data.returnValue;
                            console.log("Id",_id);
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                            console.log("data",data);
                            displayCompanyInfo();
                            setTimeout(function(){
                                $("#modalCompanyInfo").find(".close").click();
                            },1000);
                           
                        }
                    }
                });
            });
        }
        else{
            $("#panelNotDeveloper").find("#btnUploadLogo").click(function(){  
                _pub.showModalUploadUserImage(_companyId,_companyName);
            });
            $("#panelNotDeveloper").find("#btnSaveUpdateInfo").click(function(){ 
                 if($("#panelNotDeveloper").checkMandatory()!==true) return false;
                var _$frm = $("#panelNotDeveloper").find("#frm_CompanyInfo"); 
                _$frm.jsonSubmit({
                     procedure: "company_info_upd" 
                    ,isSingleEntry: true
                    ,notIncludes : ["state_id"]
                    ,onComplete: function (data) { 
                        if(data.isSuccess){
                            if(data.isSuccess===true) zsi.form.showAlert("alert");
                           
                        }
                    }
                });
            });
        }
    }
    
    $("#btnUpdateInfo").click(function(){
         if(getRowIndexUpdateInfo() !== -1){ 
            if($(window).height() <= 700) $("#frm_modalCompanyInfo").css({"height":$(window).height() - 208,"overflow-y":"auto","overflow-x":"hidden"});
            else $("#frm_modalCompanyInfo").css({"height":$(window).height() - 360,"overflow-y":"auto","overflow-x":"hidden"});
           gOrderListIndex = getRowIndexUpdateInfo(); 
            var _data = ci.getOrderListData();   
            _pub.showUpdateCompanyInfo(_data); 
        } 
    }); 
     
    return _pub;
})();                      











                 