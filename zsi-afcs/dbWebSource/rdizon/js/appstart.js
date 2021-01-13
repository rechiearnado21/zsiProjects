//initialize Settings.
var app = (function() {
    var _app = {
         procURL    : base_url + "sql/proc?p=" 
        ,execURL    : base_url + "sql/exec?p="
        ,optionsURL : base_url + "selectoption/code/" 
        ,bs         : zsi.bs.ctrl
        ,svn            : zsi.setValIfNull
        ,currentHash:  { page:"",methods : []}
        ,hash : {
                 getPageParams      : function(keys){
                    if( ! app.currentHash.params) return {}; 
                    return app.currentHash.params.setParamKeys(keys) || {}; 
                    
                 }
                ,getMethodParams    : function(name,keys){
                    var _r={};
                    var _m = app.currentHash.methods;
                    for(var i=0; i < _m.length; i++){		 
                        if (_m[i].n === name){
                            _r = app.hash.create(_m[i].params,keys);
                            break;
                        }
                    }
                    return _r;
                }
                ,create             : function(params,keys){
                    var _info = {};
                    if(typeof params === "undefined") return;
                    for(var i=0; i < keys.length; i++){		
                        if(params[i]) _info[keys[i]]=params[i];
                    }
                    return _info;
                
                }
                ,createPathState    : function(o){
                    /*
                    o.functionName  
                    o.parameters 
                    o.option(optional) = history hash path option
                        0 or null or undefined = concatenated hash
                        1 = replace all hash parameters;
                    */
                    var _a = o.parameters;
                    var _hashOptions = o.option || 0;
                    var _params ="";
                    var _fn = o.functionName; //_a.callee.name;
                    var _hashPath="";
                    var _hash = window.location.hash;
                    var _hashItems = _hash.split('#').filter(function(x) { return x !==""});
                    var _isHistoryReplace = false;
                    var _checkParams = function(fname){
                        var _params = "m/" + fname + "/" + _a.join("/");
                        for (var i=0; i <_hashItems.length ;i++){
                            var _info = _hashItems[i];
                            var _i = app.getURLMethod(_info);
                            if( _i.n === fname ) {
                              
                                if( i === _hashItems.length -1 ) _isHistoryReplace = true;
                              	if(_params !== _info) {
                                	_hashItems[i] = _params;
                                }
                               return;
                            }
                        }
                        _hashItems.push(_params);
                    }; 

                    var _writeParams = function(params){
                        var _result="";
                        
                        for( var i=0;i< params.length; i++){
                            if(_result!=="") _result +="/";
                            _result +=params[i];
                        }
                        return _result;
                    };
                    
                    _checkParams(_fn);

                    _params = _writeParams(_a);
                    switch(_hashOptions){
                        case "undefined":
                        case 0:
                             _hashPath = "#" + _hashItems.join("#");
                            break;
                        case 1:
                              _hashPath = "#m/" +_fn + "/" + _params;
                            break;
                        default: break;
                    }
                    if(_isHistoryReplace)
                        history.replaceState(null, null,_hashPath );
                    else 
                        history.pushState(null, null,  _hashPath);
            
                }                
        }
    }    
    ,_cookie         = {
        create : function(name,value,days) {
            var expires;
            if (days) {
            	var date = new Date();
            	date.setTime(date.getTime()+(days*24*60*60*1000));
            	expires = "; expires="+date.toGMTString();
            }
            else expires = "";
            document.cookie = name+"="+value+expires+"; path=/";
        }
        
        ,read : function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
            	var c = ca[i];
            	while (c.charAt(0)==' ') c = c.substring(1,c.length);
            	if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        
        ,delete : function(name) {
            //document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
        
            
        
    }
    ,_initPageLoad = function(){
        var _hash = window.location.hash;
        var _items = _hash.split('#');
        var _methods = [];
        var _executeMethods = function(){
            if(_methods.length > 0){
                var _m = _methods.splice(0,1)[0];
                switch(_m.type){ 
                    case "p": //page 
                            app.loadPage(_m.n,function(){
                                _executeMethods();
                            });
                            break;
                    case "m": //method or function 
                            console.log("function call:",_m.n);
                            try {
                                var _func = eval(_m.n);
                                _func(_m.params)
                                .then(
                                    function(){
                                        console.log("fired back _executeMethods");
                                        _executeMethods(); 
                                    }
                                ); 
                            }
                            catch(err) {
                                console.log("appstart.executeMethods.err:",_m.n,"not defined.");
                            }
                            break;
                            
                    default:  break;
                }
            }

        };

        _items.forEach(function(item,i) {
            _info = app.getURLMethod(item);
            if(_info.type!==""){
                _methods.push (_info);
               if(_info.type=="p") 
                    app.currentHash = { page : _info.n , params: _info.params,methods:[]} ;
                else 
                    app.currentHash.methods.push(_info);

            }
        });
        
        _executeMethods();
    }
    ,gNotifData = []
    ,gSumTotal  = 0
    ,gOrderQty  = 0 
    ,gOrderData = []
    ,gOrderListData = []
    ,gOrderPartData = [] 
    ,gPSN_no        = null
    ,gPSNid         = null
    ,gshipModeId    = null
    ;

    _app.init   = function(){
        /* Page Initialization */
        zsi.initDatePicker  = function(){
           var inputDate =$('input[id*=date]').not("input[type='hidden']");
           inputDate.attr("placeholder","mm/dd/yyyy");
           inputDate.keyup(function(){      
                 if(this.value.length==2 || this.value.length==5 ) this.value += "/";
           });
           
           if(inputDate.length > 0){
               if(inputDate.datepicker){
                  inputDate.datepicker({
                      format: 'mm/dd/yyyy'
                      ,autoclose:true
                      //,daysOfWeekDisabled: [0,6]
                  }).on('show', function(e){
                      var l_dp     = $('.datepicker');
                       l_dp.css("z-index",zsi.getHighestZindex() + 1);
                  });
               }
           }
           
           //for datetime picker
           var $dtPicker = $('.zDateTimePicker');
           if( $dtPicker.length > 0) $dtPicker.datetimepicker({ format: "m/d/Y H:i"});
        };   
        
        $.fn.dateTimePicker=function(o){
            if(typeof o ===ud) o = {}; 
            if(typeof o.format !==ud)  o.format ="m/d/Y H:i";
            return  this.datetimepicker(o);
        };
        
        zsi.initDatePicker();

        zsi.init({
              baseURL : base_url
             ,errorUpdateURL    :  base_url + "sql/logerror"
             ,sqlConsoleName    :  "runsql"
             ,excludeAjaxWatch  :  ["checkDataExist","searchdata"]
             ,getDataURL        :  base_url + "data/getRecords"
        });
        
        $.ajaxSetup({ cache: false });        
        app.getUserInfo(function(){
            app.getNotification();
            if(app.userInfo.img_filename !=="") $(".profile-image").attr({src: base_url +  "file/loadFile?filename=" + app.userInfo.img_filename }); 
            if(app.userInfo.company_logo !=="") $(".zsi-page-logo").attr({src: base_url +  "file/loadFile?filename=" + app.userInfo.company_logo }); 
            if(app.userInfo.company_name !=="") $(".page-logo-text").text(app.userInfo.company_name); 
            
        });
        
        app.getAppProfile();
        app.loadPublicTemplates(function(){
            var menuItems = localStorage.getItem("menuItems");
            if(menuItems){
                app.displayMenu( JSON.parse(menuItems));
            }else{
                app.loadMenu(function(data){
                    if(data.rows.length>0) app.saveLocalStorageAndDisplay(data);
                });
            }


            app.checkBrowser(function(isIE){
                 if(isIE) return true;
            });
    
            window.onpopstate = function(event) {
                _initPageLoad();
            };    
        
            if(zsi.ready) zsi.ready();  
            _initPageLoad();

        });
    };
    _app.addManageMenu              = function(){
            var ul =  $(".fa-tasks").closest("li").find("ul");
            var createLI  = function(link, icon, text){
                return '<li><a href="/' + link + '" class="waves-effect waves-themed" title="'+ text +'" data-filter-tags="'+ text +'"><span class="nav-link-text"><i class="'+ icon +'"></i>&nbsp;' + text + '</span></a></li>';
            };
            
        };  
    _app.addSystemMenu              = function(){
            var ul =  $(".fa-cog").closest("li").find("ul");
            var createLI  = function(link, icon, text){
                return '<li><a href="/' + link + '"  class="waves-effect waves-themed" title="'+ text +'" data-filter-tags="'+ text +'"><span class="nav-link-text"><i class="'+ icon +'"></i>&nbsp;' + text + '</span></a></li>';
            };
            
            ul.append( createLI('page'           ,'fab fa-leanpub'          ,'Pages'));
            ul.append( createLI('pagetemplate'   ,'far fa-newspaper'        ,'Page Templates'));
            ul.append( createLI('javascript'     ,'fab fa-js'               ,'Javascripts'));
            ul.append( createLI('sql'            ,'fas fa-database'         ,'SQL Console'));
    };
    _app.checkBrowser               = function (callBack){
        var _isIE = function() {
            ua = navigator.userAgent;
            return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
        }();
        if(_isIE){
            var _id="ieAdvisory";
            var _tw = new zsi.easyJsTemplateWriter();
            var modal = _tw.new().bsModalBox({
                 title  : '<span style="font-size:16px;color:red;">Application Advisory</span>'
                ,id     : _id
                ,body   : "<span style='font-size:12px;color:rgba(70, 183, 217, 1);'>Google Chrome or Microsoft Edge </span >is the recommended browser. <br />If not installed, please click here: <a style='color:red;' href='https://help.lear.com/heat/' target='_blank' >https://help.lear.com/heat/</a><br />Go to > Service Catalog > Non Standard Service Request (NSSR)"
            }).html();
            $('body').append(modal);
            $("#"+ _id).modal();
            if(callBack) callBack(true);
            return;
        }
        console.log(typeof callBack);
        if( typeof callBack !=="undefined" ) callBack(false);
    };
    _app.editCode                   = function(type){
        var _hash = window.location.hash;
        var _typePath = (type=="js" ? 'javascript' : 'pagetemplate' ) ;
        var _paths = window.location.pathname.split('/');
        var _codeName = _paths[_paths.length -1 ];
        var _url =  base_url + _typePath + '/source/'; 
        if(_hash !== ""  && _hash.indexOf("#p") >  -1 ){
          _codeName =  app.currentHash.page;
        }
        window.open(_url + _codeName,'_blank');
    };
    _app.isLocalStorageSupport      = function(){
        if(typeof(Storage) !== "undefined") return true; else return false;
    };
    _app.loadMenu                   = function(callback){
        var isZSILogin = _cookie.read("zsi_login");
        
        if (_cookie.read("zsi_login")!=="Y"){
            $.getJSON(app.procURL + "user_menus_sel", function(data){
               if(callback) callback(data);
            }); 
        }
        else{
            $.getJSON(base_url + "sql/exec?p=menus_sel", function(data){
                 if(callback) callback(data);
           });
                        
        }
    
    };
    _app.loadPublicTemplates        = function(callBack){
        var _name ="publicTemplates";
        var _tmpls = localStorage.getItem(_name);
        if(_tmpls === null){
            $.get(base_url + "pub/tmplPublic", function(html){
                if(html.indexOf("</html>") < 0) localStorage.setItem(_name, html);
                if(callBack) callBack();
            });
        }    
        else 
            callBack();
    };
    _app.saveLocalStorageAndDisplay = function(data){
        localStorage.setItem("menuItems", JSON.stringify(data));
        _app.displayMenu(data);

    };
    _app.displayMenu                = function(data){
        _app.displaySmartAdminMenus(data.rows);
        _app.addSystemMenu();
        _app.addManageMenu();
        $(myapp_config.navHooks).navigationDestroy(); 
        initApp.buildNavigation(myapp_config.navHooks);
    };
    _app.displaySmartAdminMenus     = function(data){
        var _tw = new zsi.easyJsTemplateWriter();
        var _parentMenuItems = $.grep(data,function(x){ return x.pmenu_id === ""; });
        var _h="";
        var _navMenu = $("#js-nav-menu"); 
        
        $.each(_parentMenuItems,function(){
             var _self      = this;
             var _subItems  = $.grep(data,function(x){ return x.pmenu_id === _self.menu_id; });
             var _subH      = "";
             
             $.each(_subItems,function(){
                _subH += _tw.new().saSubMenuItem({base_url: this.base_url, page_name: this.page_name , title: this.menu_name, icon: this.icon }).html();
                 
             });
             if(_subH!=="")  _subH = "<ul>" + _subH + "</ul>";
             //PARENT MENUS HAS NO LINK. PUTTING LINK MAY CAUSE CHANGING THE COLOR OF THE PARENT MENUS.
             _h += _tw.new().saParentMenuItem({icon: this.icon, title: this.menu_name,page_name: (_subH !=="" ? "#" :  ( this.page_name !== "" ? "#p/" + this.page_name : "#")) , subItems:_subH}).html();
             
        }); 
    
        if(_navMenu.length > 0 ) _navMenu.html(_h);
     };
    _app.getImageURL                = function(fileName){
        return base_url + "file/viewImage?fileName="  + fileName; 
    };
    _app.getPageURL                 = function(pageName){
        return base_url + "page/" + pageName;
    };
    _app.getProjectImageURL         = function(id,fileName){
        return base_url + "file/viewImage?fileName=projects/" + id + "/"  + fileName; 
    };
    _app.getOptionsURL              = function(code){
        return base_url + "selectoption/code/" + code ;
    };
    _app.getUserInfo              = function(callBack){
        var _lsName ="userInfo"
        var _userInfo = localStorage.getItem(_lsName);
        if(_userInfo){
            app.userInfo =JSON.parse(_userInfo); 
            callBack();
        }
        else{    
            zsi.getData({
                 sqlCode : "U77"
                ,parameters    : {search_user_id : userId }
                ,onComplete : function(d) {
                    if(d.rows.length > 0 ){ 
                        app.userInfo = d.rows[0];
                        localStorage.setItem(_lsName, JSON.stringify(app.userInfo));
                    }
                    if(callBack) callBack(app.userInfo);
                }
            });
        }

    };
    _app.getURLMethod = function(item){
          var _a = item.split("/");
          var _info ={ type:_a[0], n:_a[1], params:[]};
          for( var i = 2; i < _a.length;i++ ){
            _info.params.push(_a[i]);
          }
        	return  _info;  
    };
        
    _app.loadPage                   = function(pageUrl,callBack){
        $.get(
             base_url + "page/" + pageUrl
            ,function(html){
                $("#js-page-content").html(html);
                if(zsi.ready) zsi.ready();
                if(callBack) callBack();
            }
        );
    };
    _app.getAppProfile = function(){
        var _lsName ="appProfile"
        var _appProfile = localStorage.getItem(_lsName);
        if(_appProfile){
            app.profile =JSON.parse(_appProfile); 
        }
        else{    
            zsi.getData({
                 sqlCode : "A1"
                ,onComplete : function(d) {
                    if(d.rows.length > 0 ){ 
                        app.profile = d.rows[0];
                        localStorage.setItem(_lsName, JSON.stringify(app.profile));
                    }
                }
            });
        }
    };
    _app.getTmplNotification = function(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : "modalOrderPartDetails"
            , sizeAttr  : "modal-full"
            , title     : ""
            , body      : '<div class="panel mb-0 border-bottom-0" id="panelNotifOrderInfo">'
            +'                <div class="panel-hdr text-primary">'
            +'                    <h2>'
            +'                        <span class="mr-2"><i class="far fa-clipboard-list"></i></span>Order Info -  '
            +'                        <ol class="breadcrumb bg-transparent p-0 m-0">'
            +'                            <li class="breadcrumb-item" data-breadcrumb-seperator="-">'
            +'                                &nbsp; OEM » <span id="oem_name" name="oem_name"></span>'
            +'                            </li> &nbsp; &nbsp; &nbsp; &nbsp;'
            +'                            <li class="breadcrumb-item" data-breadcrumb-seperator="-">'
            +'                                Platform » <span id="platform_code" name="platform_code"></span>'
            +'                            </li> &nbsp; &nbsp; &nbsp; &nbsp;'
            +'                            <li class="breadcrumb-item" data-breadcrumb-seperator="-">'
            +'                                Program » <span id="program_code" name="program_code"></span>'
            +'                            </li> &nbsp; &nbsp; &nbsp; &nbsp;'
            +'                            <li class="breadcrumb-item" data-breadcrumb-seperator="-">'
            +'                                PO No. » <span id="po_no" name="po_no"></span>'
            +'                            </li> &nbsp; &nbsp; &nbsp; &nbsp;'
            +'                            <li class="breadcrumb-item" data-breadcrumb-seperator="-">'
            +'                                Line No. » <span id="line_no" name="line_no"></span>'
            +'                            </li> &nbsp; &nbsp; &nbsp; &nbsp;'
            +'                            <li class="breadcrumb-item main-status" data-breadcrumb-seperator="-">'
            +'                                Status » <span id="status_desc" name="status_desc"></span>'
            +'                            </li> &nbsp; &nbsp; &nbsp; &nbsp;'
            +'                            <li class="breadcrumb-item revNo" data-breadcrumb-seperator="-">'
            +'                                Rev. No. » <span id="rev_no" name="rev_no"></span>'
            +'                            </li>'
            +'                        </ol>'
            +'                    </h2>'
            +'                    <div class="panel-toolbar">'
            +'                        <button class="btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"><i class="fal fa-window-minimize"></i></button>'
            +'                        <button class="btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"><i class="fal fa-expand"></i></button>'
            +'                        <button class="btn btn-panel s-xl w-auto h-auto close" data-dismiss="modal" data-toggle="tooltip" data-offset="0,10" data-original-title="Close"><i class="fal fa-times"></i></button>'
            +'                    </div>'
            +'                </div>'
            +'                <div class="panel-container collapse show" id="a">'
            +'                    <div class="panel-content">'
            +'                        <div class="form-row">'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="customer" class=" col-form-label p-0">Customer</label> '
            +'                                <span class=" form-control inputText form-control-sm p" id="customer" name="customer"></span>'
            +'                            </div>'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="customer_part_no" class=" col-form-label p-0"><b>Customer Part No.</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="customer_part_no" name="customer_part_no"></span>'
            +'                            </div> '
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="customer_contact" class=" col-form-label p-0">Customer Contact</label> '
            +'                                <span class=" form-control inputText form-control-sm p" id="customer_contact" name="customer_contact"></span>'
            +'                            </div>'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="site_code" class=" col-form-label p-0">Site Code</label>' 
            +'                                <span class=" form-control inputText form-control-sm p" id="site_code" name="site_code"></span>'
            +'                            </div>'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="customer_mrd" class=" col-form-label p-0"><b>Customer MRD</b></label>'
            +'                                <span class="form-control form-control-sm inputText" id="customer_mrd" name="customer_mrd"></span>'
            +'                            </div>'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="red_border_status" class=" col-form-label p-0"><b>Ship To Address</b></label>'
            +'                                <div class="form-control inputText form-control-sm" id="ship_address" name="ship_address"></div>'
            +'                            </div>' 
            +'                        </div>'  
            +'                        <div class="form-row">' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="oem_part_no" class=" col-form-label p-0"><b>OEM Part No.</b></label>'
            +'                                <span class="form-control form-control-sm inputText" id="oem_part_no" name="oem_part_no" ></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">' 
            +'                                <label for="build_phase" class=" col-form-label p-0">Build Phase</label>'
            +'                                <span class=" form-control inputText form-control-sm p" id="build_phase" name="build_phase"></span>'
            +'                            </div>'
            +'                             <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="harness_family" class=" col-form-label p-0"><b>Harness Family</b></label>'
            +'                                <span class="form-control form-control-sm inputText" id="harness_family" name="harness_family" ></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">' 
            +'                                <label for="model_year" class=" col-form-label p-0">Model Year</label>'
            +'                                <span class=" form-control inputText form-control-sm p" id="model_year" name="model_year"></span>'
            +'                            </div>'
            +'                             <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="po_issue_date" class=" col-form-label p-0"><b>PO Issue Date</b></label>'
            +'                                <span class="form-control form-control-sm inputText" id="po_issue_date" name="po_issue_date" ></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="order_qty" class=" col-form-label p-0"><b>Order Part Qty.</b></label>'
            +'                                <span class="form-control form-control-sm inputText" id="order_qty" name="order_qty" ></span>'
            +'                            </div>' 
            +'                        </div>'
            +'                        <div class="form-row">'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="order_type" class=" col-form-label p-0"><b>Order Type</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="order_type" name="order_type"></span>'
            +'                            </div> '
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">' 
            +'                                <label for="engr_manager" class=" col-form-label p-0">Engineer Manager</label>'
            +'                                <span class="form-control inputText form-control-sm p" id="engr_manager" name="engr_manager"></span>'
            +'                            </div> '
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">' 
            +'                                <label for="program_manager" class=" col-form-label p-0">Program Manager(s)</label>'
            +'                                <span class="form-control inputText form-control-sm p" id="program_manager" name="program_manager"></span>'
            +'                            </div> '
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">' 
            +'                                <label for="car_leader" class=" col-form-label p-0">Car Leader(s)</label>'
            +'                                <span class="form-control inputText form-control-sm p" id="car_leader" name="car_leader"></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">' 
            +'                                <label for="launch_manager" class=" col-form-label p-0">Launch Manager(s)</label>'
            +'                                <span class="form-control inputText form-control-sm p" id="launch_manager" name="launch_manager"></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="warehouse_contact" class=" col-form-label p-0"><b>Warehouse Contact(s)</b></label>'
            +'                                <span class="form-control form-control-sm inputText" id="warehouse_contact" name="warehouse_contact"></span>'
            +'                            </div>'
            +'                        </div>' 
            +'                        <div class="form-row">'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="plant" class=" col-form-label p-0"><b>Plant</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="plant" name="plant"></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="warehouse" class=" col-form-label p-0"><b>Warehouse</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="warehouse" name="warehouse"></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="rate_flow" class=" col-form-label p-0"><b>Rate and Flow</b></label>'
            +'                                <span class="form-control form-control-sm inputText" id="rate_flow" name="rate_flow" ></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="red_border_no" class=" col-form-label p-0"><b>Red Border No.</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="red_border_no" name="red_border_no"></span>'
            +'                            </div>' 
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="red_border_status" class=" col-form-label p-0"><b>Red Border Status</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="red_border_status" name="red_border_status"></span>'
            +'                            </div>'
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="red_border_no" class=" col-form-label p-0"><b>Ship Mode</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="ship_mode" name="ship_mode"></span>'
            +'                            </div>' 
            +'                        </div>' 
            +'                	   	<div class="form-row">'
            +'                	   	    <div class="col-sm-6 col-md-4 mb-2">'
            +'                                <label class="col-form-label p-0"><b>Attachment(s)</b></label>'
            +'                                <div id="divAttachment" class="list-group list-group-flush overflow-auto"></div>'
            +'                            </div>'   
            +'                            <div class="col-sm-6 col-md-2 mb-2">'
            +'                                <label class="col-form-label p-0"><b>Comment(s)</b></label>'
            +'                                <div id="divComment" class="accordion accordion-hover accordion-clean overflow-auto"></div>'
            +'                            </div>'  
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'            		            <label for="" class="col-form-label text-label">Shipped to Customer QTY</label>'
            +'            		            <span class="form-control inputText form-control-sm" id="shipped_customer_qty" name="shipped_customer_qty"></span>'
            +'            		          </div>'  
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'            		            <label for="" class="col-form-label text-label">Account No</label>'
            +'            		            <span class="form-control inputText form-control-sm" id="acct_no" name="acct_no"></span>'
            +'            		        </div>'  
            +'                            <div class="form-group col-md-2 col-sm-6 col-xs-12 mb-2">'
            +'                                <label for="red_border_status" class=" col-form-label p-0"><b>Special Instruction</b></label>'
            +'                                <span class="form-control inputText form-control-sm" id="special_instruction" name="special_instruction"></span>'
            +'                            </div>'
            +'                	   	</div>'
            +'                    </div>'
            +'                </div>'
            +'            </div>'
            +'            <div class="panel mb-0" id="panelNotifOrderPartDetails">'
            +'                <div class="panel-hdr text-primary">'
            +'                    <h2>'
            +'                        <span class="mr-2"><i class="far fa-list-alt"></i></span>Details' 
            +'                    </h2>'
            +'                    <div class="panel-toolbar ml-2">'
            +'                        <button class="btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"><i class="fal fa-window-minimize"></i></button>'
            +'                        <button class="btn btn-panel bg-transparent fs-xl w-auto h-auto rounded-0 waves-effect waves-themed" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"><i class="fal fa-expand"></i></button>'
            +'                    </div>'
            +'                </div>'
            +'                <div class="panel-container collapse show">'
            +'                    <div class="panel-content">'
            +'                        <div class="row">'
            +'                            <div class="col-md-12 col-sm-12 col-xs-12">'
            +'                                <div class="zGrid" id="gridNotifOrderPartsDetail"></div>'
            +'                            </div>'
            +'                        </div>'
            +'                    </div>'
            +'                    <div class="panel-content hide" id="panelButtons">'
            +'                        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>'
            +'                        <button type="button" class="btn btn-primary btn-sm" id="btnSaveOrderPartsDetail">Save Changes</button>'
            +'                    </div>'
            +'                </div>'
            +'            </div>'
        });
    };
    _app.getNotification = function(){
        var _hideBtnNotif = function(){
            $("#ddNotification").find(".tab-pane").addClass("d-none");
            $("#ddNotification").find(".rounded-bottom").removeClass("d-block").addClass("d-none");
        };
     
        if(app.userInfo.role_id===5){
            $.get(app.procURL + "request_for_approval_count_sel", function(d){
            if(isUD(d.rows[0])) return;
            
            var _tw = new zsi.easyJsTemplateWriter();
            var _noRequest = d.rows[0].no_requests;
            var _data = [];
            var _ctr = -1;
            $("#btnNotification").attr("title", "You got " + _noRequest + " notification(s).")
            $("#divNotification").find(".count").text(_noRequest);
            if(_noRequest===0) _hideBtnNotif();
            
            $("#gridNotification").dataBind({
                 sqlCode            : "R323"
                ,width              :  $("#ddNotification").width()
                //,blankRowsLimit     : 0
                ,dataRows           : [
                    {text: ''                                               ,width : 25                 ,style : "text-align:left"  
                        ,onRender : function(d){ 
                            _ctr++;
                            return  (d !==null ?  app.bs({name:"rb",type:"radio",style:" width: 13px; margin:0 5px;", value:""}) : "");
                        }
                    }
                    ,{text:"Id"                              ,width:30       ,style:"text-align:center"
                       ,onRender: function(d) {
                           return app.svn(d,"request_id");
                       }
                    }
                    ,{text:"Request Date"                   ,width:90       ,style:"text-align:center"
                       ,onRender: function(d) {
                           return app.svn(d,"request_date").toShortDate();
                       }
                    }
                    ,{text:"Requested By"                     ,width:120       ,style:"text-align:left"
                       ,onRender: function(d) {
                           return app.svn(d,"requestor");
                       }
                    }
                    ,{text:"PO No."                     ,width:120       ,style:"text-align:center"
                       ,onRender: function(d) {
                            var _link = "<a href='javascript:void(0)' onclick='app.showModalOrderList(\""+ _ctr +"\")'>"+ app.svn(d,"po_no") +"</a>";
                            return (d !== null ? _link : "");   
                       }
                    }
                    ,{text:"Line No."                     ,width:50       ,style:"text-align:center"
                       ,onRender: function(d) {
                           return app.svn(d,"line_no");
                       }
                    }
                    ,{text:"OEM Part No."                     ,width:120       ,style:"text-align:center"
                       ,onRender: function(d) {
                           return app.svn(d,"oem_part_no");
                       }
                    }
                    ,{text:"Change To"                     ,width:220       ,style:"text-align:left"
                       ,onRender: function(d) {
                           return app.svn(d,"requested_status");
                       }
                    }
                    ,{text:"Comment"                     ,width:220       ,style:"text-align:left"
                       ,onRender: function(d) {
                           return app.svn(d,"request_comment");
                       }
                    }
                ]
                ,onComplete: function(o){ 
                    var _$grid = this;
                    _data = o.data.rows;
                    gNotifData = _data;
                    $("#btnApprove, #btnReject").unbind().click(function(){
                        var _index = _$grid.find("input[name='rb']:checked").closest(".zRow").index();
                        if(_index===-1) return;
                        
                        var _btnText = $(this).text().trim();
                        var _statusId = 7;
                        var _requestId = _data[_index].request_id;
                        var _orderPartId = _data[_index].order_part_id;
                        var _changeStatId = _data[_index].change_to_status_id;
                        if(_btnText==="Reject") _statusId = 1;
                        
                        $.post(app.procURL + "request_for_approval_upd @request_id="+ _requestId +",@order_part_id="+ _orderPartId +",@change_to_status_id="+ _changeStatId +",@status_id="+ _statusId, function(d){
                            if(d.isSuccess){
                                zsi.form.showAlert("alert");
                                app.getNotification();
                            }
                        });
                    });
                }
            });
        }); 
        }else{
           _hideBtnNotif()
        }
    };
    _app.showModalOrderList = function(ctr){
        app.getTmplNotification();
        var _o = gNotifData[ctr];
        var _$mdl = $("#modalOrderPartDetails"); 
        _$mdl.find(".modal-header").hide();
        _$mdl.find(".modal-body").css("padding",0);
        _$mdl.modal("show");   
     
        displayAttachment(_o);
        displayComment(_o);
        displayOrderParts(_o);
        displayOrderPartsDetail(_o);
    };
    function displayAttachment(o){
        var _div = $("#divAttachment");
        zsi.getData({
             sqlCode : "O223" //order_attachment_sel
            ,parameters: {order_id: o.order_id} 
            ,onComplete : function(d) {
                var _info = d.rows
                    ,_h = ""
                    ,_tw = new zsi.easyJsTemplateWriter();
                
                $.each(_info, function(i, v){
                    var _fileName = v.filename;
                    var _url = base_url + 'file/downloadFile?root=' + app.profile.image_folder+ "&fileName="  + _fileName;
                    if ( /\.(jpe?g|png|gif|bmp)$/i.test(_fileName) ) {
                        _url =  app.getImageURL(_fileName);
                    }
                    _h += _tw.new().attachment({ 
                                attachmentId: v.attachment_id,
                                fileName: _fileName,
                                url: _url,
                                createdBy: v.createdby,
                                createdDate: v.created_date
                            }).html();
                     
                });
                _div.html(_h);
                
                $(".btnDeleteAttachment").unbind().click(function(){
                    var _$item = $(this).closest(".list-group-item");
                    var _fileName = _$item.find("input[name='file_name']").val();
                    _$item.find("input[name='cb']").prop( "checked", true ); 
                    zsi.form.deleteData({
                         code       : "ref-00044"
                        ,onComplete : function(data){
                            $.get(base_url + "file/deleteFile?filename=" +  _fileName 
                                ,function(data){
                                    displayAttachment(gOrderPartData);
                                }    
                            ); 
                        }
                    }); 
                });
            }
        });
    }
    function displayComment(o){
        var _div = $("#divComment");
        zsi.getData({
             sqlCode : "O205" //order_comment_sel
            ,parameters: {order_id: o.order_id} 
            ,onComplete : function(d) {
                var _info = d.rows
                    ,_h = ""
                    ,_tw = new zsi.easyJsTemplateWriter();
                
                $.each(_info, function(i, v){
                    _h += _tw.new().comment({ 
                        index  : i,
                        comment : v.comment, 
                        createdBy: v.createdby,
                        createdDate: v.created_date
                    }).html();
                });
                _div.html(_h); 
            }
        });
    } 
    function displayOrderParts(o){
        zsi.getData({
             sqlCode : "O174" //orders_parts_sel
            ,parameters: {order_part_id: o.order_part_id } 
            ,onComplete : function(d) {
                var _info = d.rows[0]; 
                if(isUD(_info)) return; 
                var _$panel = $("#panelNotifOrderInfo");
                var _revNo = formatRevNo((_info.rev_no ? _info.rev_no : "0"), 3);
                _$panel.find("#line_no").text(_info.line_no); 
                _$panel.find("#harness_family").text(_info.harness_family); 
                _$panel.find("#oem_part_no").text(_info.oem_part_no); 
                _$panel.find("#customer_part_no").text(_info.customer_part_no); 
                _$panel.find("#plant").text(_info.plant_code); 
                _$panel.find("#warehouse").text(_info.warehouse_name); 
                _$panel.find("#customer_mrd").text(_info.customer_mrd.toShortDate()); 
                _$panel.find("#order_qty").text(_info.order_qty); 
                _$panel.find("#rate_flow").text((_info.rate_flow==="Y" ? "Yes":"No")); 
                _$panel.find("#red_border_no").text(_info.red_border_no);  
                if(_info.red_border_status === "A") _$panel.find("#red_border_status").text("APPROVED");
                else if(_info.red_border_status === "O") _$panel.find("#red_border_status").text("OPEN");
                else if(_info.red_border_status==="R") _$panel.find("#red_border_status").text("REJECTED");
                _$panel.find("#ship_mode").text(_info.ship_mode);
                _$panel.find("#acct_no").text(_info.acct_no);
                _$panel.find("#special_instruction").text(_info.special_instruction); 
                
                
                //this added from orders 
                _$panel.find("#oem_name").text(_info.oem); 
                _$panel.find("#customer").text(_info.customer); 
                _$panel.find("#site_code").text(_info.site_code); 
                _$panel.find("#platform_code").text(_info.platform_code); 
                _$panel.find("#program_code").text(_info.program_code); 
                _$panel.find("#build_phase").text(_info.build_phase_abbrv); 
                _$panel.find("#model_year").text(_info.model_year); 
                _$panel.find("#engr_manager").text(_info.engr_manager); 
                _$panel.find("#program_manager").text(_info.program_managers); 
                _$panel.find("#car_leader").text(_info.car_leaders); 
                _$panel.find("#launch_manager").text(_info.launch_managers); 
                _$panel.find("#warehouse_contact").text(_info.warehouse_contacts); 
                _$panel.find("#po_no").text(_info.po_no); 
                _$panel.find("#shipped_customer_qty").text(_info.shipped_qty); 
                _$panel.find("#po_issue_date").text(_info.po_issue_date.toShortDate()); 
                _$panel.find("#order_type").text(_info.order_type); 
                _$panel.find("#ship_mode").text(_info.ship_mode);
                _$panel.find("#acct_no").text(_info.acct_no); 
                _$panel.find("#rev_no").text(_revNo);
                _$panel.find("#status_desc").text(_info.status_desc); 
                
                 gshipModeId = _info.ship_mode_id;
                //Customer Contact
                var _h1 = _info.contact_name +" "+ " <br>";
                    _h1+= _info.contact_title +" "+ " <br>";
                    _h1+= _info.contact_no  +" "+ " <br>";
                    _h1+= _info.contact_email_add +" ";
                _$panel.find("#customer_contact").html(_h1); 
                //Ship to Address
                var _h2 = _info.street_address +" "+ _info.bldg_no +" <br>";
                    _h2+= _info.city  +" "+ _info.state +" "+ _info.zip_code +" "+ _info.country;
                _$panel.find("#ship_address").html(_h2);
                _$panel.find(".form-row").css({ resize: "both", overflow: "auto" });
                
                var _grid = $("#panelNotifOrderPartDetails");
                _grid.find("h2").append(" | Part Status » ", _info.op_status); 
            }
        });
    }
    function displayOrderPartsDetail(o){
        var _cb = app.bs({name:"cbFilter2",type:"checkbox"})
            ,_ctr = -1;
            
        $("#gridNotifOrderPartsDetail").dataBind({
             sqlCode     : "O172" //order_part_details_sel
            ,parameters : {order_part_id: o.order_part_id } 
            ,blankRowsLimit : 5
            ,dataRows   : [
                {text:_cb        ,width:25                                       ,style : "text-align:center"
                   ,onRender  :  function(d){
                       _ctr++;
                        return app.bs({name:"order_part_dtl_id"                 ,type:"hidden"                  ,value: app.svn(d,"order_part_dtl_id")}) 
                            + app.bs({name:"is_edited"                          ,type:"hidden"}) 
                            + app.bs({name:"order_part_id"                      ,type:"hidden"                  ,value: o.order_part_id})
                            + app.bs({name:"status_id"                          ,type:"hidden"                  ,value: app.svn(d,"opd_status_id")})
                            +(d !==null ? app.bs({name:"cb", type:"checkbox", value: _ctr}) : "");
                    }
                }
                ,{text:"Status"                                                 ,width:200       ,style:"text-align:left" 
                    ,onRender: function(d){ 
                        return app.svn(d,"opd_status_desc");
                    }
                }
                ,{text:"Customer Required Date "                                ,width:85      ,style:"text-align:center" 
                    ,onRender: function(d){ 
                        return app.bs({type:"hidden"                            ,name:"customer_required_date"       ,value: app.svn(d,"customer_required_date").toShortDate()})
                             + app.svn(d,"customer_required_date").toShortDate();
                    }
                } 
                ,{text:"Customer Required Qty"                                  ,width:75     ,style:"text-align:center"
                    ,onRender : function(d){
                        return app.bs({type:"hidden"                            ,name:"required_qty"       ,value: app.svn(d,"required_qty")})
                             + app.bs({type:"hidden"                            ,name:"lear_promise_date"  ,value: app.svn(d,"lear_promise_date").toShortDate()})
                             + app.bs({type:"hidden"                            ,name:"promised_qty"       ,value: app.svn(d,"promised_qty")})
                             + app.svn(d,"required_qty");
                    } 
                } 
                ,{text:"Ship Mode"                                              ,width:150      ,style:"text-align:left"             
                    ,onRender: function(d){ 
                        return app.bs({type:"select" ,name:"ship_mode_id"  ,value: app.svn(d,"ship_mode_id")});
                    }
                }
                ,{text:"Account No"                                             ,width:80     ,style:"text-align:left"     
                   ,onRender: function(d){ 
                        return app.bs({type:"input" ,name:"acct_no"  ,value: app.svn(d,"acct_no")}); 
                    }
                }
                ,{text:"Is Direct to Cust"                                      ,width:60     ,style:"text-align:center"            
                    ,onRender: function(d){ 
                        return app.bs({type:"yesno" ,name:"is_direct_to_cust"  ,value: app.svn(d,"is_direct_to_cust")});
                    }
                }
                ,{text:"Plant Target Ship Date"                                 ,width:85     ,style:"text-align:center"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"         ,name:"mfg_target_ship_date"   ,value: app.svn(d,"mfg_target_ship_date").toShortDate()})
                             + app.bs({type:"hidden"        ,name:"mfg_actual_ship_date"   ,value: app.svn(d,"mfg_actual_ship_date").toShortDate()});
                    }
                }
                ,{text:"Shipment Qty"                                           ,width:75       ,style:"text-align:center"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"         ,name:"shipment_qty"        ,value: app.svn(d,"shipment_qty")})
                             + app.bs({type:"hidden"        ,name:"no_cartons"          ,value: app.svn(d,"no_cartons")})
                             + app.bs({type:"hidden"        ,name:"box_dimension"       ,value: app.svn(d,"box_dimension")})
                             + app.bs({type:"hidden"        ,name:"weight_lb"           ,value: app.svn(d,"weight_lb")})
                             + app.bs({type:"hidden"        ,name:"serial_no"           ,value: app.svn(d,"serial_no")})
                             + app.bs({type:"hidden"        ,name:"tracking_no"         ,value: app.svn(d,"tracking_no")})
                             + app.bs({type:"hidden"        ,name:"shipper_number"      ,value: app.svn(d,"shipper_number")})
                             + app.bs({type:"hidden"        ,name:"shipment_date"       ,value: app.svn(d,"shipment_date").toShortDate()})
                             + app.bs({type:"hidden"        ,name:"special_instruction" ,value: app.svn(d,"special_instruction")});
                    }
                }
            ]
            ,onComplete : function(o){
                var _this = this;
                var _zRow = _this.find(".zRow");
                var _d = o.data.rows;
                gOrderPartDetails = o.data.rows;  
                // if(app.userInfo.role_id == 6){
                //     _zRow.find("[name='tracking_no']").attr("readonly", true);     
                // }
                
                _zRow.find("select[name='ship_mode_id']").dataBind({
                     sqlCode : "S296" //ship_mode_sel
                    ,text    : "ship_mode"
                    ,value   : "ship_mode_id"  
                });
                _zRow.find("select[name='box_dimension']").dataBind({
                     sqlCode    : "B302" //box_dimensions_sel 
                    ,text       : "box_dimension"
                    ,value      : "id"
                });
                _this.find("[name='cbFilter2']").setCheckEvent("#gridNotifOrderPartsDetail input[name='cb']");
                _this.find("input[name$='date']").not("input[name='mfg_target_ship_date']").datepicker({
                      pickTime  : false
                    , autoclose : true
                    , todayHighlight: true 
                });
                _this.find("input[name='mfg_target_ship_date']").datepicker({
                      pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                    , startDate: new Date()
                });
                _this.find("input[name$='qty']").keyup(function(){
                    var _$this = $(this)
                        ,_$zRow = _$this.closest(".zRow")
                        ,_defaultVal = _d[_zRow.index()].promised_qty;
                   
                    if (isOrderQtyLimitExceed(gOrderQty, _$this) ){ 
                        if(_$this[0].name === "shipment_qty") {
                            alert( "Shipment quantity must be equal to "+ gOrderQty + "." );
                            _$this.val(_defaultVal);
                        } else{
                            alert( "Lear promised quantity must be equal to "+ gOrderQty + "." );
                            _$this.val(_defaultVal);
                        }
                    }
                });
                
                _zRow.find("[name='lear_promise_date']").change(function(){
                    var _$this = $(this);
                    var _zRow = _$this.closest(".zRow");
                    var _defaultVal = _d[_zRow.index()].lear_promise_date;
                    var _targetDate = _$this.closest(".zRow").find("[name='mfg_target_ship_date']");
                    if(_$this.val() < _targetDate.val()){
                        alert("Please select date equal or prior to Plant Target Ship Date");
                        _$this.closest(".zRow").find("[name='lear_promise_date']").val(_defaultVal ? _defaultVal : "");
                        return;//_$this.datepicker("setDate",_defaultVal.toShortDate());
                    }
                });
                
                isOrderQtyLimitExceed(gOrderQty, this.find("input[name$='qty']"));
                
                //Role Id 9 = Warehouse Contact
                // if(app.userInfo.role_id == 9){
                //     markMandatoryForWarehouseContact();
                // }
                _zRow.find("[name='required_qty'],[name='promised_qty'],[name='promised_qty'],[name='shipment_qty'],[name='no_cartons'],[name='weight_lb']").addClass("numeric");
                zsi.initInputTypesAndFormats();
            } 
        });
    }
    function formatRevNo(str, max) {
        var _str = str.toString();
        return _str.length < max ? formatRevNo("0" + _str, max) : _str;
    }
    function isOrderQtyLimitExceed(limit,target){
        var _$grid = target.closest(".zGrid");
        var _getSumTotal = function(){
          var _sum = 0;
          var _target = _$grid.find("input[name="+ target.attr("name") +"]");
          _target.each(function(){
            if($.trim(this.value)!==""){
            	_sum += parseFloat(this.value);
            }
          });
        
          return _sum;
        };
        gSumTotal = _getSumTotal(); 
        return _getSumTotal() > limit;
    }
    function displayPSNDetails(data){   
        console.log("data",data)
        var count = 0;
        $("#gridGeneratePSN").dataBind({ 
             rows               : data
            ,width              : $(window).width()  
            ,height             : $(window).height() - 550
            ,blankRowsLimit     : 0
            ,dataRows           : [
                 {text:"Seq. No."            ,width:55      ,style:"text-align:center" 
                    ,onRender: function(d){ 
                        if(app.svn(d,"psn_seq_no") === ""){
                            count++;
                            return app.bs({type:"hidden",   name:"order_part_dtl_id"        ,value: app.svn(d,"order_part_dtl_id")})
                                 + app.bs({type:"hidden",   name:"is_edited"                ,value: app.svn(d,"is_edited")})
                                 + app.bs({type:"hidden",   name:"psn_id"                   ,value: app.svn(d,"psn_id")})
                                 + app.bs({type:"hidden",   name:"is_mfg_to_cust"           ,value: app.svn(d,"is_mfg_to_cust")})
                                 + app.bs({type:"hidden",   name:"psn_seq_no"               ,value: count})
                                 + count;
                        }else{
                            return app.bs({type:"hidden",   name:"order_part_dtl_id"        ,value: app.svn(d,"order_part_dtl_id")})
                                 + app.bs({type:"hidden",   name:"is_edited"                ,value: app.svn(d,"is_edited")})
                                 + app.bs({type:"hidden",   name:"psn_id"                   ,value: app.svn(d,"psn_id")})
                                 + app.bs({type:"hidden",   name:"is_mfg_to_cust"           ,value: app.svn(d,"is_mfg_to_cust")})
                                 + app.bs({type:"input",    name:"psn_seq_no"               ,value: app.svn(d,"psn_seq_no")});
                            
                        }
                    }
                } 
                ,{text:"Part Number"  ,type:"input"   ,name:"oem_part_no"      ,width:130     ,style:"text-align:left" }
                ,{text:"Quantity"                           ,width:120          ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return svn(d,"shipment_qty");
                    }
                }
                ,{text:"P.O Number"                         ,width:130          ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return svn(d,"po_no");
                    }
                }
                ,{text:"No. of Cartons"                     ,width:120          ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"         ,name:"no_cartons"  ,value: svn(d,"no_cartons")});
                    }
                }
                ,{text:"Box Dimension(In)"                  ,width:120          ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"select"         ,name:"box_dimension",value: svn(d,"box_dimension")});
                    }
                }
                ,{text:"Weight (Lb)"                          ,width:120          ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"         ,name:"weight_lb"   ,value: svn(d,"weight_lb")});
                    }
                }  
                ,{text:"Serial Number"                      ,width:130          ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"         ,name:"serial_no"   ,value: svn(d,"serial_no")});
                    }
                }
                
                ,{text:"Ship Mode"                          ,width:160          ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"input"         ,name:"ship_mode_id",value: svn(d,"ship_mode")});
                    }
                }
                ,{text:"Customer MRD"                       ,width:120     ,style:"text-align:left"
                    ,onRender: function(d){ 
                        return app.bs({type:"hidden"        ,name:"shipment_date"})
                            + app.bs({type:"hidden"         ,name:"shipment_by", value: svn(d, "shipment_by") })
                            + app.bs({type:"hidden"         ,name:"psn_id"})
                            + svn(d,"customer_required_date").toShortDate();
                    }
                }
            ]
            ,onComplete: function(){
                console.log("_data[0].box_dimension",data[0].box_dimension);
                var _zRow = this;
                count = 0;
                _zRow.find("select[name='box_dimension']").dataBind({
                     sqlCode    : "B302" //box_dimensions_sel 
                    ,text       : "box_dimension"
                    ,value      : "id"
                    ,selectedValue : data[0].box_dimension
                });
                _zRow.find("input[name$='date']").datepicker({
                      pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                    , startDate: new Date()
                });
                markPSNDetailMandatory();
                _zRow.find("[name='no_cartons']").addClass("numeric");
                /*_zRow.find("[name='weight_lb']").toMoney();*/
                
                zsi.initInputTypesAndFormats();
            }
        }); 
    }
    
    return _app;
})();
                                  