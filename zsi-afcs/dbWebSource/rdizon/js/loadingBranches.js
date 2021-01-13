var driverpaoloader = (function(){
    var   bs                    = zsi.bs.ctrl
        , tblName               = "tblusers"
        ,_public                = {}
        ,mdlImageDriverLicence  = "modalWindowImageDriverLicence"
        ,gCompanyId             = app.userInfo.company_id
        ,mdlAddNewUser          = "modalWindowAddNewUser"
        ,mdlAddNewBranchDeposit = "modalWindowAddNewBranchDeposit"
        ,mdlInactive            = "modalWindowInactive"
        ,gTw                    = null
        ,gActiveTab             = ""
        ,gLoadingBranchesId     = null
        
    ;
   
    zsi.ready = function(){
        $(".page-title").html("Loading Branches");
        $(".panel-container").css("min-height", $(window).height() - 190); 
        gTw = new zsi.easyJsTemplateWriter();
        displayLoadingBranches(gCompanyId);
        getTemplates();
        gActiveTab = "branches";
        $("#loadingBranchId").select2({placeholder: "LOADING BRANCH",allowClear: true});
        
    };
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
        switch(target){
            case "#nav-branches":
                gActiveTab = "branches";
                $("#loadingBranchDiv").addClass("hide");
                $("#dummyDiv").removeClass("hide");
                break;
            case "#nav-branches-deposit":
                gActiveTab = "branches-deposit";
                $("#loadingBranchDiv").removeClass("hide");
                $("#dummyDiv").addClass("hide");
                setFooterFreezed("#gridLoadingBranchDeposit");
                break;
          default:break;
      }
    });
    
    function displaySelects(){
        $("#loadingBranchId").dataBind({
             sqlCode    : "D1305" //dd_loading_branchs_sel
            ,text       : "store_code"
            ,value      : "loading_branch_id" 
            ,required   : true
            ,onChange   : function(){ 
                gLoadingBranchesId = this.val();  
            }
        });
    }
    
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : mdlAddNewUser
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddUsers({grid:"gridNewUsers",onClickSaveNewUsers:"driverpaoloader.submitNewUsers();"}).html()  
        })
        .bsModalBox({
              id        : mdlAddNewBranchDeposit
            , sizeAttr  : "modal-full"
            , title     : "New Branch Deposit"
            , body      : gTw.new().modalBodyAddBranchDeposit({grid:"gridNewBranchDeposit",onClickSaveNewBranchDeposit:"driverpaoloader.submitNewBranchDeposit();"}).html()  
        })
        .bsModalBox({
              id        : mdlInactive
            , sizeAttr  : "modal-sm"
            , title     : "Inactive Users"
            , body      : gTw.new().modalBodyInactive({grid:"gridInactiveUsers",onClickSaveInactive:"driverpaoloader.submitInactive();"}).html()  
        });
    }
   
    function displayLoadingBranches(company_id,searchVal){
        zsi.getData({
                 sqlCode    : "L1298" //loading_branches_sel
                ,parameters     : {searchVal:(searchVal ? searchVal : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = 0;
                    var _dRows = d.rows;
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot     +=_info.load_balance;
                    }
                    
                    //create additional row for total
                    var _total = {
                             store_code       : "Total Amount"
                            ,load_balance     : _tot
                            ,is_active        : " "
                    };
                    
                    d.rows.push(_total);
                    $("#gridLoadingBranches").dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 240
                        ,dataRows       : [
                            {text: "Store Code"                 ,width : 200   ,style : "text-align:left;"
                                ,onRender  :  function(d)  
                                    { return   app.bs({name:"loading_branch_id"         ,type:"hidden"      ,value: app.svn(d,"loading_branch_id")}) 
                                             + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                             + app.bs({name:"company_id"                ,type:"hidden"      ,value: company_id}) 
                                             + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                             + app.bs({name:"store_code"                ,type:"input"       ,value: app.svn(d,"store_code")}) ;
                                             
                                    }
                            }
                            ,{text: "Load Balance"                                                                 ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"
                                ,onRender: function(d){
                                    return app.bs({name: "load_balance"   ,type: "input"   ,value: app.svn(d,"load_balance") ? app.svn(d,"load_balance").toMoney() : app.svn(d,"load_balance")    ,style : "text-align:right;padding-right: 0.3rem;"});
                                }
                            }
                            ,{text: "Active?"                           ,name:"is_active"                   ,type:"yesno"       ,width : 55    ,style : "text-align:center;"    ,defaultValue:"Y"}
                             
                        ]
                        ,onComplete: function(o){
                            var _this  = this; 
                	        var _zRow  = _this.find(".zRow");
                	        if(_dRows.length < 1) $("#nav-tab").find("[aria-controls='nav-branches-deposit']").hide();
                	        _zRow.unbind().click(function(){
                	            console.log("asdads")
                	            var _self=this;
                	            setTimeout(function(){ 
                    	            var _i      = $(_self).index();
                    	            var _data   = _dRows[_i];
                    	            var _loadingBranchesId  = _data.loading_branch_id;
                    	            gLoadingBranchesId = _loadingBranchesId;
                    	            displaySelects();
                    	            _loadingBranchesId ? $("#nav-tab").find("[aria-controls='nav-branches-deposit']").show() : $("#nav-tab").find("[aria-controls='nav-branches-deposit']").hide();
                    	            setTimeout(function(){
                    	                $("#loadingBranchId").val(_loadingBranchesId).trigger('change');
                    	            }, 200);
                                    displayLoadingBranchDeposit(_loadingBranchesId);
            
                	            }, 200);
                	        });
                	        _this.on('dragstart', function () {
                                return false;
                            });
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="store_code"]').css({"font-weight":"bold","text-align":"right"});
                            $(".zRow:last-child()").find('[name="load_balance"]').css("text-align","right");
                            $(".zRow:last-child()").find('[name="is_active"]').addClass("hide");
                            setTimeout (function(){
                                setFooterFreezed("#gridLoadingBranches");
                            },1000);
                        }
                });
            }
        });
        /*$("#gridLoadingBranches").dataBind({
             sqlCode        : "L1298" //loading_branches_sel
            ,parameters     : {searchVal:(searchVal ? searchVal : "")}
            ,height         : $(window).height() - 240
            ,dataRows       : [
                {text: "Store Code"                 ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"loading_branch_id"         ,type:"hidden"      ,value: app.svn(d,"loading_branch_id")}) 
                                 + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"company_id"                ,type:"hidden"      ,value: company_id}) 
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                 + app.bs({name:"store_code"                ,type:"input"       ,value: app.svn(d,"store_code")}) ;
                                 
                        }
                }
                ,{text: "Load Balance"                                                                 ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"
                    ,onRender: function(d){
                        return app.bs({name: "load_balance"   ,type: "input"   ,value: app.svn(d,"load_balance") ? app.svn(d,"load_balance").toMoney() : app.svn(d,"load_balance")    ,style : "text-align:right;padding-right: 0.3rem;"});
                    }
                }
                ,{text: "Active?"                           ,name:"is_active"                   ,type:"yesno"       ,width : 55    ,style : "text-align:center;"    ,defaultValue:"Y"}
            ]
            ,onComplete: function(o){
                var _dRows = o.data.rows;
                var _this  = this;
    	        var _zRow  = _this.find(".zRow");
    	        if(_dRows.length < 1) {
    	                $("#nav-tab").find("[aria-controls='nav-branches-deposit']").hide();
    	            }
    	        _zRow.unbind().click(function(){
    	            console.log("asdads")
    	            var _self=this;
    	            setTimeout(function(){ 
        	            var _i      = $(_self).index();
        	            var _data   = _dRows[_i];
        	            var _loadingBranchesId  = _data.loading_branch_id;
        	            gLoadingBranchesId = _loadingBranchesId;
        	            displaySelects();
        	            $("#nav-tab").find("[aria-controls='nav-branches-deposit']").show();
        	            setTimeout(function(){
        	                $("#loadingBranchId").val(_loadingBranchesId).trigger('change');
        	            }, 200);
                        displayLoadingBranchDeposit(_loadingBranchesId);

    	            }, 200);
    	        });
    	        _this.on('dragstart', function () {
                    return false;
                });
            }
        });*/
    }
    
    function displayLoadingBranchDeposit(loadingBranchesId,searchVal){
        var cb = app.bs({name:"cbFilter3",type:"checkbox"});
        zsi.getData({
                 sqlCode    : "L1300" //loading_branch_deposits_sel
                ,parameters     : {loading_branch_id:loadingBranchesId}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = 0;
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot     +=_info.deposit_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             deposit_ref_no     : "Total Amount"
                            ,deposit_amount     : _tot
                           
                    };
                    
                    d.rows.push(_total);
                    $("#gridLoadingBranchDeposit").dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 240
                        ,dataRows       : [
                            {text: cb  ,width : 25   ,style : "text-align:left"
                                        ,onRender  :  function(d)  
                                            { return   app.bs({name:"loading_branch_deposit_id"     ,type:"hidden"  ,value: app.svn(d,"loading_branch_deposit_id")})
                                                     + app.bs({name:"is_edited"                     ,type:"hidden"  ,value: app.svn(d,"is_edited")}) 
                                                     + app.bs({name:"loading_branch_id"             ,type:"hidden"  ,value: loadingBranchesId})
                                                     + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            }
                                    }        
                            ,{text: "Deposit Date"                                                                             ,width : 100   ,style : "text-align:left;"
                                ,onRender: function(d){
                                    return app.bs({name: "deposit_date"   ,type: "input"   ,value: app.svn(d,"deposit_date").toShortDate()});
                                }
                            }
                            ,{text: "Deposit Ref No."                   ,name:"deposit_ref_no"              ,type:"input"      ,width : 200   ,style : "text-align:left;"}
                            ,{text: "Deposit Amount"                                                                           ,width : 100   ,style : "text-align:left;"
                                ,onRender: function(d){
                                    return app.bs({name: "deposit_amount"   ,type: "input"   ,value: app.svn(d,"deposit_amount") ? app.svn(d,"deposit_amount").toMoney() : app.svn(d,"deposit_amount")    ,style : "text-align:right;padding-right: 0.3rem;"});
                                }
                            }
                             
                        ]
                        ,onComplete: function(o){
                            var _this = this;
                            var _zRow = _this.find(".zRow");
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="deposit_ref_no"]').css({"font-weight":"bold","text-align":"right"});
                            $(".zRow:last-child()").find('[name="deposit_amount"]').css("text-align","right");
                            _zRow.find("[name='deposit_date']").datepicker({
                                autoPickTime : false
                                ,todayHighlight: true
                                ,autoclose : true
                            })
                            _zRow.find("[name='cbFilter3']").setCheckEvent("#gridLoadingBranchDeposit input[name='cb']");
                            
                    }
                });
            }
        });
        
    }
    
    function displayAddNewUser(company_id,tab){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridNewUsers").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : [
                    {text: "Store Code"                 ,width : 200   ,style : "text-align:left;"
                        ,onRender  :  function(d)  
                            { return   app.bs({name:"loading_branch_id"         ,type:"hidden"      ,value: app.svn(d,"loading_branch_id")}) 
                                     + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                     + app.bs({name:"company_id"                ,type:"hidden"      ,value: company_id}) 
                                     + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                     + app.bs({name:"store_code"                ,type:"input"       ,value: app.svn(d,"store_code")}) ;
                                     
                            }
                    }
                    ,{text: "Load Balance"                                                                 ,width : 100   ,style : "text-align:left;"
                        ,onRender  :  function(d)  
                            { return   app.bs({name:"load_balance"                  ,type:"input"      ,value: app.svn(d,"load_balance")});}
                    }
                    ,{text: "Active?"                           ,name:"is_active"                   ,type:"yesno"       ,width : 55    ,style : "text-align:center;"    ,defaultValue:"Y"}
                ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
            }
        });    
    }
    
    function displayAddNewBranchDeposit(loadingBranchesId){   
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        
        $("#gridNewBranchDeposit").dataBind({
    	     height         : 360 
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit : 5
            ,dataRows       : [
                    {text: cb  ,width : 25   ,style : "text-align:left"
                        ,onRender  :  function(d)  
                            { return   app.bs({name:"loading_branch_deposit_id"     ,type:"hidden"  ,value: app.svn(d,"loading_branch_deposit_id")})
                                     + app.bs({name:"is_edited"             ,type:"hidden"  ,value: app.svn(d,"is_edited")})
                                     + app.bs({name:"loading_branch_id"             ,type:"hidden"  ,value: loadingBranchesId})  
                                     + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                            }
                    }     
                    ,{text: "Deposit Date"                      ,name:"deposit_date"                ,type:"input"      ,width : 100   ,style : "text-align:left;"}
                    ,{text: "Deposit Ref No."                   ,name:"deposit_ref_no"              ,type:"input"      ,width : 200   ,style : "text-align:left;"}
                    ,{text: "Deposit Amount"                    ,name:"deposit_amount"              ,type:"input"      ,width : 100   ,style : "text-align:right;"}
                ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                _zRow.find("[name='deposit_date']").datepicker({
                    autoPickTime : false
                    ,todayHighlight: true
                    ,autoclose : true
                })
                this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
            }
        });    
    }
    
    function displayInactiveLoadingBranches(company_id){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridInactiveUsers").dataBind({
             sqlCode    : "L1298" //loading_branches_sel
            ,parameters : {is_active: "N"}
    	    ,height     : 360
            ,dataRows   : [
                
                {text: cb  ,width : 25   ,style : "text-align:left;"
                    ,onRender :function(d){
                        return     app.bs({name:"loading_branch_id"         ,type:"hidden"      ,value: app.svn(d,"loading_branch_id")}) 
                                 + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"company_id"                ,type:"hidden"      ,value: company_id}) 
                                 + app.bs({name:"hash_key"                  ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                                 + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );                          
                    } 
                }
                
                
        	   ,{text  : "Store Code"                                                            , width : 190           , style : "text-align:center;"          
        	       ,onRender :function(d){
                        return     app.bs({name:"store_code"                ,type:"input"        ,value: app.svn(d,"store_code")}) 
                                 + app.bs({name:"load_balance"              ,type:"hidden"       ,value: app.svn(d,"load_balance")});                          
                    } 
        	   }
               
               ,{text  : "Active?"  , width : 60                            ,type:"yesno"  ,name:"is_active"    ,defaultValue:"N"}
            ]
            ,onComplete: function(o){
                this.find("[name='cbFilter']").setCheckEvent("#gridInactiveCustomers input[name='cb']");
            }
        });  
    }
    
    function setFooterFreezed(zGridId){
        var _zRows = $(zGridId).find(".zGridPanel .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height() - 20;
        var _zTotal = _tableRight.find(".zTotal");
        _zTotal.css({"top": _zRowsHeight}); 
        _zTotal.prev().css({"margin-bottom":23 });
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() {
                   _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().top - _zRows.offset().top) });
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
    }
   
    _public.submitInactive = function(){
        var _$grid = $("#gridInactiveUsers");
            _$grid.jsonSubmit({
                 procedure: "loading_branches_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayLoadingBranches(gCompanyId);
                    displayInactiveLoadingBranches(gCompanyId);
                }
            });
        $('#' + mdlInactive).modal('hide');     
    };
    _public.submitNewUsers = function(){
        $("#gridNewUsers").jsonSubmit({
                 procedure  : "loading_branches_upd"
                 //,optionalItems: ["is_active","transfer_type_id","bank_id"]
                 ,onComplete : function (data) {
                     if(data.isSuccess===true){
                        zsi.form.showAlert("alert");
                        isNew = false;
                        displayLoadingBranches();
                        displayAddNewUser(gCompanyId,gActiveTab);
                     }
                }
        });
        
    };
    
    _public.submitNewBranchDeposit = function(){
        $("#gridNewBranchDeposit").jsonSubmit({
                 procedure  : "loading_branch_deposits_upd"
                 //,optionalItems: ["is_active","transfer_type_id","bank_id"]
                 ,onComplete : function (data) {
                     if(data.isSuccess===true){
                        zsi.form.showAlert("alert");
                        isNew = false;
                        displayLoadingBranchDeposit(gLoadingBranchesId);
                        displayAddNewBranchDeposit(gLoadingBranchesId);
                     }
                }
        });
        
    };
    
    $("#btnNactive").click(function () {
        var g$mdl = $("#" + mdlInactive);
        g$mdl.find(".modal-title").text("Inactive Loading Branche(s)") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveLoadingBranches(gCompanyId);
    });
    
    $("#btnAdd").click(function () {
        var _$mdl = $('#' + mdlAddNewUser);
        _$mdl.find(".modal-title").text("Add New Branch(s)");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            console.log("agi");
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewUser(gCompanyId,gActiveTab);
    });
    
    $("#btnAddBranchDeposit").click(function () {
        var _$mdl = $('#' + mdlAddNewBranchDeposit);
        _$mdl.find(".modal-title").text("Add New Branch Deposit");
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        if (_$mdl.length === 0) {
            console.log("agi");
            _$mdl = 1;
            _$mdl.on("hide.bs.modal", function () {
                    if (confirm("You are about to close this window. Continue?")) return true;
                    return false;
            });
        }    
        displayAddNewBranchDeposit(gLoadingBranchesId);
    });
    
    $("#btnSave").click(function () {
        $("#gridLoadingBranches").jsonSubmit({
             procedure  : "loading_branches_upd"
            ,optionalItems: ["is_active"]
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    $("#gridLoadingBranches").trigger("refresh");
                }
            }
        });
    });
    
    $("#btnSaveBranchDeposit").click(function () {
        $("#gridLoadingBranchDeposit").jsonSubmit({
             procedure  : "loading_branch_deposits_upd"
            ,onComplete : function (data) {
                if(data.isSuccess===true){
                    zsi.form.showAlert("alert");
                    $("#gridLoadingBranchDeposit").trigger("refresh");
                }
            }
        });
    });
    
    $("#btnFilterLoadingBranch").click(function(){
        displayLoadingBranchDeposit(gLoadingBranchesId);
    });
    
    $("#btnSearchVal").click(function(){ 
        var _searchVal = $.trim($("#searchVal").val()); 
        if(gActiveTab === "branches") displayLoadingBranches(gCompanyId,_searchVal);
        else displayLoadingBranchDeposit(gLoadingBranchesId,_searchVal);
        
    }); 
    
    $("#searchVal").on('keypress',function(e){
        var _searchVal = $.trim($("#searchVal").val()); 
        if(e.which == 13) {
           if(gActiveTab === "branches") displayLoadingBranches(gCompanyId,_searchVal);
           else displayLoadingBranchDeposit(gLoadingBranchesId,_searchVal);
        }
    });

    $("#searchVal").keyup(function(){
        if($(this).val() === "") {
            if(gActiveTab === "branches") displayLoadingBranches(gCompanyId);
            else displayLoadingBranchDeposit(gLoadingBranchesId);
        }
    });

    
    return _public;
})();                                                  