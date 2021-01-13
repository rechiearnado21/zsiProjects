var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
 });

      
function displayRecords(){   
    var cb = bs({name:"cbFilter1",type:"checkbox"});
         $("#grid").dataBind({
	     url            : execURL + "menus_sel"
	    ,width          : 1243
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                        , type  : "hidden"        , width    : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                   return     bs({name:"menu_id",type:"hidden",value: svn (d,"menu_id")})
                                                       +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Menu Name"   , name  : "pmenu_id"    , type : "select"  , width : 180   , style : "text-align:left;" }
        		,{text  : "Parent Menu" , name  : "menu_name"   , type : "input"   , width : 180   , style : "text-align:left;" }
        		,{text  : "Page Name"   , name  : "page_id"     , type : "ddl"     , width : 180   , style : "text-align:left;"  ,displayText:"page_name" }

	    ]
	     ,onComplete: function(){
	         $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
             $("select[name='pmenu_id']").dataBind("menus");
             $("[name='page_id']").dataBind2( "pages");
            
        }  
    });    
}
 




 
      