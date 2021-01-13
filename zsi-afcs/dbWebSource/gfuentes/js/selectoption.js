(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    
    zsi.ready=function(){
        $(".page-title").html("Select Option");
        displayRecords(); 
        $(".panel").css("height", $(".page-content").height()); 
    };
    
    
    $("#btnSave").click(function () {
        console.log("test");
       $("#grid").jsonSubmit({
                 procedure: "select_options_upd"
                , onComplete: function (data) {
                    $("#grid").clearGrid();
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayRecords();
                }
        });
    });
        
    function displayRecords(){
         var cb = app.bs({name:"cbFilter1",type:"checkbox"});
         $("#grid").dataBind({
    	     url            : app.execURL + "select_options_sel"
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(document).height() - 260
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit:5
            ,isPaging : false
            ,dataRows : [
                     {text  : cb                                                           , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                    		                    return     app.bs({name:"select_id",type:"hidden",value: svn (d,"select_id")})
                                                          +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                }
                }	 
            		,{text  : "Code"                , name  : "code"                    , type  : "input"         , width : 150       , style : "text-align:left;"}
            		,{text  : "Table Name"          , name  : "table_name"              , type  : "input"         , width : 200       , style : "text-align:left;"}
            		,{text  : "Text"                , name  : "text"                    , type  : "input"         , width : 200       , style : "text-align:left;"}
            		,{text  : "Value"               , name  : "value"                   , type  : "input"         , width : 267       , style : "text-align:left;"}
            		,{text  : "Condition"           , name  : "condition_text"          , type  : "input"         , width : 180       , style : "text-align:left;"}
            		,{text  : "Order By"            , name  : "order_by"                , type  : "input"         , width : 200       , style : "text-align:left;"}
    	    ]
        	     ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
            }  
        });    
    }
        
    
    $("#btnDelete").click(function(){
        
        $("#grid").deleteData({
              tableCode:"sys-0008"
            ,onComplete : function(d){
                displayRecords();
            }
        });
            
        /*    
        $("#grid").deleteData({
              sqlCode : "S1408"
             ,parameters:{
                 client_id:1
             }
            ,onComplete : function(d){
                displayRecords();
            }
        });
          */  
            
            
        
    });
})();
    
                                          