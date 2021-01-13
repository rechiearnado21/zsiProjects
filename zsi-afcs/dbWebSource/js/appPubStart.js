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
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
    ;
    
    _app.init   = function(){
        zsi.init({
              baseURL : base_url
             ,errorUpdateURL    :  base_url + "sql/logerror"
             ,sqlConsoleName    :  "runsql"
             ,excludeAjaxWatch  :  ["checkDataExist","searchdata"]
             ,getDataURL        :  base_url + "data/getRecords"
        });

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

        $.ajaxSetup({ cache: false });    
        

        app.loadPublicTemplates(function(){
            app.checkBrowser(function(isIE){
                 if(isIE) return true;
            });
            window.onpopstate = function(event) {
                _initPageLoad();
            }; 
            
            $(document).ready(function(){
                if(zsi.ready) zsi.ready();  
            });
            
            _initPageLoad();
        });
        
        console.log("running ang public app start.");
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
    
    return _app;

})();

app.init();
                           