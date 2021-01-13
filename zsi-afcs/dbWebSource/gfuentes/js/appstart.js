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
        zsi.isMobileDevice =  (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
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
            if(app.userInfo.has_img === 'Y') $(".profile-image").attr({src: base_url + "dbimagebyclient/E1411/" + app.userInfo.company_id + "/" + userId }); 
            else $(".image-alt").text(app.userInfo.first_name.substring(0,1)).css("z-index", 3).show();
            if(app.userInfo.role_id == 5) $(".zsi-page-logo").attr({src: base_url + "dbimage/ref-00018/bank_id/"+ app.userInfo.bank_id + "/bank_logo"}); 
            else {
                if(app.userInfo.company_id === 0) $(".zsi-page-logo").attr({src: base_url + 'img/logo.png'});
                else $(".zsi-page-logo").attr({src: base_url + 'dbimage/ref-0001/client_id/' + app.userInfo.company_id + "/company_logo" }); 
            }
            
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
        _app.addManageMenu();
        $(myapp_config.navHooks).navigationDestroy(); 
        initApp.buildNavigation(myapp_config.navHooks);
        if(app.userInfo.is_developer === "Y") _app.addSystemMenu();
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
    return _app;
})();
                                            