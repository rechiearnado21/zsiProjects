(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Other Income");
        displayOtherIncome(); 
    }; 
    function displayOtherIncome(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "other_income_sel"  
                ,width              : $("#panel-content").width()  
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"other_income_id"   ,type:"hidden"      ,value: svn (d,"other_income_id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        
                        } 
                        ,{text:"Other Income Code"                   ,type:"input"          ,name:"other_income_code"                  ,width:150       ,style:"text-align:left"} 
                        ,{text:"Other Income Desc"                   ,type:"input"           ,name:"other_income_desc"                 ,width:400       ,style:"text-align:left"} 
                        
                        
                    
                    ] 
                    ,onComplete : function(d){    
                        this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                        
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "other_income_upd"
                //,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:""
               ,onComplete:function(data){
                    displayOtherIncome();
               }
            });
        });
    
})();

                  