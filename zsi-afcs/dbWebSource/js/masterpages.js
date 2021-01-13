(function(){
     var bs     = zsi.bs.ctrl
        ,svn    = zsi.setValIfNull
     ;
    
    zsi.ready=function(){
        $(".page-title").html("Master Pages");
        displayRecords();
        $(".panel").css("height", $(".page-content").height()); 
    };
    
     $("#btnSave").click(function () {
        $("#grid").jsonSubmit({
                procedure: "master_pages_upd"
                , onComplete: function (data) {
                    
                    displayRecords();
                }
        });
         
    });
        
     $("#btnDelete").click(function () {
        $("#grid").deleteData({
             code       : "sys-masterpage"
            ,onComplete : function(){
                displayRecords();
            }
        });  
    });
         
    function displayRecords(){   
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#grid").dataBind({
             url   : app.execURL + "master_pages_sel"
            ,width         : $(".zContainer").width()
    	    ,height         : $(document).height() - 250
            ,blankRowsLimit:5
            ,dataRows       :[
        		 { text: cb             , width:25  , style:"text-align:left;"   
        		     ,onRender : function(d){
                    return     app.bs({name:"master_page_id",type:"hidden",value: svn(d,"master_page_id")})
                            + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                }             
        		 }	 
    
        		,{ text:"Master Page Name"     , width:150  , style:"text-align:center;"  
        		    ,onRender : function(d){ return app.bs({name:"master_page_name",value: svn(d,"master_page_name")}); }
        		}	 
            ]
            ,onComplete: function(){
                this.find("#cbFilter").setCheckEvent("#grid input[name='cb']");
    
            }
        });    
    }
    
    
    function displayBlankRows(){       
        var inputCls = "form-control input-sm";
        $("#grid").loadData({
             td_body: [ 
                function(){
                    return     app.bs({name:"master_page_id",type:"hidden"})
                            +  app.bs({name:"cb",type:"checkbox"});
                }            
                ,function(){ return app.bs({name:"master_page_name" }); }
            ]
        });    
        
       
    }
})(); 
                                