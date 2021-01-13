var users = (function(){
    var   bs                    = zsi.bs.ctrl
        , tblName               = "tblusers"
        , mdlAddNewUser         = "modalWindowAddNewUser"
        , mdlInactive           = "modalWindowInactive"
        , cuser_id
        , svn                   = zsi.setValIfNull
        , isNew                 = false
        , recipients            = []
        , gTw                   = null
        , gSearchOption         = "" 
        , gSearchValue          = "" 
        , gFilterOption         = ""
        , gFilterValue          = ""
        , gUserId               = null
        , pub                   = {}
        , ctr                   = 0
    ;

    zsi.ready = function(){
        gTw = new zsi.easyJsTemplateWriter();
        setSearch();
        displayRecords("");
        getTemplates();
        $(".page-title").html("Users"); 
        
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
                     ,optionalItems: ["is_active","is_admin"]
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
        } else {
            alert("Enter " + res.inputName);
        }
    };  
        
    
    pub.mouseout = function (){
        $("#user-box").css("display","none");
    }; 
    function isRequiredInputFound(form){
        var result = false;
        var inputName = "";
        $(form).find("input[name='is_edited']").each(function(e){
            if($.trim(this.value) === "Y"){
                var $zRow = $(this).closest(".zRow");
                var logon = $zRow.find("[name='logon']").val();
                var emplId = $zRow.find("[name='employee']").val();
                var roleID = $zRow.find("[name='role_id']").val();
                
                if ($.trim(logon) === ""){
                    result = true;
                    inputName = "Logon";
                }  
                if ($.trim(roleID) === ""){
                    result = true;
                    inputName = "Role";
                }
                 if ($.trim(emplId) === ""){
                    result = true;
                    inputName = "Employee";
                }
            }
        });
    
        return {result, inputName};
    }
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
    
    function displayInactiveUsers(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveUsers").dataBind({
             sqlCode    : "U77"
            ,parameters : {is_active: "N"}
    	    ,height     : 360
            ,dataRows   : [
                
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender :function(d){
                                console.log("d",d)
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
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveUsers input[name='cb']");
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
                            +  app.bs({name:"client_id"     ,type:"hidden"   ,value: app.userInfo.company_id})
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
                this.find("[name='role_id']").dataBind({
                     sqlCode : "D1435"
                    ,text    : "role_name"
                    ,value   : "role_id" 
                });
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']"); 
    
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
                                ,client_id      : app.userInfo.company_id
            }
     	    ,width          : $("#frm").width()
    	    ,height         : $(window).height() - 302 
    	    ,selectorType   : "checkbox"
            ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [
                 
        		{text  : "Logon "     , width : 155           , style : "text-align:center;"         ,sortColNo:3
                    ,onRender : function(d){ 
                        ctr++;
                        return app.bs({name:"user_id"   ,type:"hidden"  ,value:app.svn(d,"user_id") })
                            +  app.bs({name:"is_edited" ,type:"hidden" })
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
                   ,text    : "role_name"
                   ,value   : "role_id"
                });
              
                this.find("select[name='plant_id']").dataBind("plants");
                this.find("select[name='warehouse_id']").dataBind("warehouse");
                this.find("[name='logon']").attr("readonly",true);
                markNewUserMandatory();
                $(".no-data input[name='logon']").checkValueExists({code:"adm-0002",colName:"logon"
                   ,isNotExistShow :  false
                   ,message : "data already exists"
                });
                if(app.userInfo.is_admin!=="Y"){
                    $("#btnDiv").addClass("hide");
                    this.find("input,select").attr("disabled",true);
                }
            }
        });    
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
    $("#btnDeleteUser").click(function(){ 
        $("#gridInactiveUsers").deleteData({
            tableCode: "ref-00018"
            ,onComplete : function(d){
                $("#gridInactiveUsers").trigger("refresh");
            }
         });      
    });
    
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
            // ,notIncludes: ["employee"]
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
                                                    