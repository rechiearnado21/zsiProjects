zsi.init({
      baseURL : base_url
     ,errorUpdateURL    :  base_url + "sql/logerror"
     ,sqlConsoleName    :  "runsql"
     ,excludeAjaxWatch  :  ["checkDataExist","searchdata"]
     ,getDataURL        :  base_url + "data/getRecords"
});

var  projectAccess = {}
    ,procURL = base_url + "sql/proc?p=" 
    ,execURL = base_url + "sql/exec?p="
    ,optionsURL  = base_url + "selectoption/code/" 
    ,bs = zsi.bs.ctrl
    ,svn = zsi.setValIfNull
    ,gUser
;



//initialize Settings.
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
 

var isMenuItemsSaved = readCookie("isMenuItemsSaved");


$.ajaxSetup({ cache: false });

if(isMenuItemsSaved ==="N"){
    if(isLocalStorageSupport()) localStorage.clear();
}


if(isLocalStorageSupport()) {
    loadPublicTemplates();
    var menuItems = localStorage.getItem("menuItems");
    if(menuItems)
        displayMenu( JSON.parse(menuItems));
    else
        loadMenu();
}
else 
    loadMenu();


function isLocalStorageSupport(){
    if(typeof(Storage) !== "undefined") return true; else return false;
}

function loadMenu(){
    console.log(readCookie("zsi_login"));
    if (readCookie("zsi_login")!=="Y"){
        $.getJSON(procURL + "user_menus_sel", function(data){
            if(data.rows.length>0) saveLocalStorageAndDisplay(data);
        }); 
    }
    else{
        $.getJSON(base_url + "sql/exec?p=menus_sel", function(data){
             if(data.rows.length>0) saveLocalStorageAndDisplay(data);
             
        });
                    
    }

}

function loadPublicTemplates(){
    if(isLocalStorageSupport()) {
        var _name ="publicTemplates";
        var _tmpls = localStorage.getItem(_name);
        if(_tmpls === null)
            $.get(base_url + "page/tmplPublic", function(html){
                if(html.indexOf("</html>") < 0) localStorage.setItem(_name, html);
            });  
    }
}

function saveLocalStorageAndDisplay(data){
    
    if(isLocalStorageSupport()) { 
        localStorage.setItem("menuItems", JSON.stringify(data));
        if(isMenuItemsSaved ==="N") createCookie("isMenuItemsSaved","Y",10); 
    }
    displayMenu(data);
    
}

function displayMenu(data){
    var h = createMenuItems(data.rows,"");
    $("#menuPanel").html(h);
    //call highlight event;
    setCurrentMenuEvent();
    highlightCurrentMenu();

}

function hasChild(data,menu_id){
    for(var x=0; x<data.length;x++ ){
        if(data[x].pmenu_id===menu_id) return true;
    }
    return false;
}

function loadChild(data,menu_id){
    var h="";
    for(var x=0; x<data.length;x++ ){
        if(data[x].pmenu_id==menu_id) {  
            var hc= hasChild(data, data[x].menu_id);
            var target = (data[x].page_name==="help"?"target=\"_blank\"":"");
            var params  = (typeof data[x].parameters!== ud ? (  data[x].parameters!=="" ?  "?" + data[x].parameters : "") : "" );
            h+= "<li class='dropdown'>"
            + "<a " + target + " href='"+  ( hc===true ? "#" : (data[x].page_name!=="" ? base_url + "page/" + data[x].page_name + params :"#" ) )  + "' class='dropdown-toggle' " + ( hc===true ?"data-toggle='dropdown'":"")  + ">" 
                + data[x].menu_name + ( hc===true ? ' <span class="caret"></span>':'') 
            +  "</a>" 
            + createMenuItems(data,data[x].menu_id) 
            + "</li>";
        }
    }
    return h;
}

function createMenuItems(data, menu_id){
    var html="";
    var cls = (parseInt("0" +menu_id)===0?"nav navbar-nav": "dropdown-menu")
    var hc= hasChild(data,menu_id); 
    if(hc) html +="<ul class='"+ cls + "'>";
        html +=loadChild(data,menu_id);
    if(hc) html +="</ul>";
    return html;
}

function setCurrentMenuEvent(){
    var pClass= "ul.nav > li.dropdown";
    var cClass= "ul.nav > li.dropdown > ul.dropdown-menu > li.dropdown";
    
    $(pClass + " > a").click(function(){
        var pim =$(pClass).index(this.parentNode);
        createCookie("parentIndexMenu",pim,1);
    });
    
    $(cClass + " > a").click(function(){
        var cim =$(cClass).index(this.parentNode);
        createCookie("childIndexMenu",cim,1);
    });

}

function setCurrentMenuEvent(){
    var pClass= "ul.nav > li.dropdown";
    var cClass= "ul.nav > li.dropdown > ul.dropdown-menu > li.dropdown";
    
    $(pClass + " > a").click(function(){
        var pim =$(pClass).index(this.parentNode);
        createCookie("parentIndexMenu",pim,1);
        highlightCurrentMenu();
    });
    
    $(cClass + " > a").click(function(){
        var cim =$(cClass).index(this.parentNode);
        createCookie("childIndexMenu",cim,1);
        highlightCurrentMenu();
    });
}

function highlightCurrentMenu(){
    var pClass= "ul.nav > li.dropdown";
    var cClass= "ul.nav > li.dropdown > ul.dropdown-menu > li.dropdown";
    var pHClass="zParentHighLight";
    var cHClass="zChildHighLight";

    var pim = readCookie("parentIndexMenu");
    var cim = readCookie("childIndexMenu");

    if(pim){
        $(pClass).removeClass(pHClass);
        $($(pClass).get(pim)).addClass(pHClass);
    }
    
    if(cim){
        $(cClass).removeClass(cHClass);
        $($(cClass).get(cim)).addClass(cHClass);    
    }
    
    $("a.navbar-brand").click(function(){
        //remove cookie
          createCookie("parentIndexMenu",-1,0);
          createCookie("childIndexMenu",-1,0);
    });
}


function getPageURL(pageName){
    return base_url + "page/" + pageName;
}

function getImageURL(fileName){
    return base_url + "file/viewImage?fileName="  + fileName; 
}

function getProjectImageURL(id,fileName){
    return base_url + "file/viewImage?fileName=projects/" + id + "/"  + fileName; 
}

function getOptionsURL(code){
    return base_url + "selectoption/code/" + code ;
}


zsi.ready = function(callBack){
   $(document).ready(function(){
        //write extra code here and call the callback function.
    zsi.getData("U82" , function(d) {
        gUser = d.rows[0];
        callBack(d.rows[0]);
    });

   });
};

/*--[cookie]--*/
function createCookie(name,value,days) {
    var expires;
    if (days) {
    	var date = new Date();
    	date.setTime(date.getTime()+(days*24*60*60*1000));
    	expires = "; expires="+date.toGMTString();
    }
    else expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
    	var c = ca[i];
    	while (c.charAt(0)==' ') c = c.substring(1,c.length);
    	if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}    