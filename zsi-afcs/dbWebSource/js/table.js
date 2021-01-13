(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready=function(){
        $(".page-title").html("Table Reference");
        displayRecords();
        $(".panel").css("height", $(".page-content").height()); 
    };
    
    
     $("#btnSave").click(function () {
             $("#frm").jsonSubmit({
                  procedure: "tables_upd"
                   ,optionalItems: ["table_name","table_key_name"]
                , onComplete: function (data) {
                    displayRecords();
                }
            });
            
          
    });
    
    
    function displayRecords(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
              $("#grid").dataBind({
    	     url            : app.execURL + "tables_sel"
    	    ,width          : $(".zContainer").width() 
    	    ,height         : $(window).height() - 200
    	    ,selectorType   : "checkbox"
            ,blankRowsLimit:5
            ,isPaging : false
            ,dataRows : [
                     {text  : " "                                                         , type  : "hidden"            , width    : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                    		                   return      app.bs({name:"table_id",type:"hidden",value: svn (d,"table_id")})
                                                        +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "");
                                }
                }	 
            		,{text  : "Code"                    , name  : "table_code"            , type  : "input"             , width : 200       , style : "text-align:left;"}
            		,{text  : "Table Name"              , name  : "table_name"            , type  : "select"            , width : 300       , style : "text-align:left;"}
            		,{text  : "Primary Key"             , name  : "table_key_name"        , type  : "select"            , width : 300       , style : "text-align:left;"}
            	
    	    ]
    	     ,onComplete: function(){
                 var objTable =$("select[name='table_name']");
               objTable.change(function(){
                   
                    var tr= this.parentNode.parentNode ;
                        if(this.value!=="")
                            $(tr).find("[name='table_key_name']").dataBind({ url :app.execURL + "table_column_options_sel '" + this.value + "'"});  
                   
               });
               
                 objTable.dataBind({ 
                     url : app.execURL + "table_options_sel"
                     ,onComplete : function(){
                        $ddl = $("select[name='table_name']");
                        $.each($ddl,function(){
                            var tr= this.parentNode.parentNode ;
                            if(this.value!=="")
                            $(tr).find("[name='table_key_name']").dataBind({ url : app.execURL + "table_column_options_sel '" + this.value + "'"});
                        });
                           
                            
                     }
                 });
    
           }
        });    
        
       
    }
       
      
    $("#btnDelete").click(function(){
        $("#grid").deleteData({
            tableCode: "sys-0011"
            ,onComplete : function(d){
                displayRecords();
            }
         }); 
        
    });    
    
})();                                 