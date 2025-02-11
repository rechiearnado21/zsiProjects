 var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;



zsi.ready(function(){
    displayRecords();
});


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "item_types_upd"
            , optionalItems: ["is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "item_types_sel"
	    ,width          : $(document).width() - 35
	    ,height         : $(document).height() - 250
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        ,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"item_type_id",type:"hidden",value: svn (d,"item_type_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Category"            , name  : "item_cat_id"             , type  : "select"          , width : 150       , style : "text-align:left;"}
        		,{text  : "Monitoring Type"     , name  : "monitoring_type_id"      , type  : "select"          , width : 200       , style : "text-align:left;"}
        		,{text  : "Code"                , name  : "item_type_code"          , type  : "input"           , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "item_type_name"          , type  : "input"           , width : 200       , style : "text-align:left;"}
        		,{text  : "Active?"             , name  : "is_active"               , type  : "yesno"           , width:55          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                $("select[name='item_cat_id']").dataBind( "item_category");
                $("select[name='monitoring_type_id']").dataBind( "monitoring_type");
        }  
    });    
}
    

$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0004"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
    
                                          