  
(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Shifts");
        displayShifts(); 
    }; 
    function displayShifts(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "shifts_sel"  
                ,width              : $("#panel-content").width()  
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"shift_id"         ,type:"hidden"      ,value: svn (d,"shift_id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        
                        } 
                        ,{text:"Shift Code"                     ,type:"input"           ,name:"shift_code"                  ,width:100       ,style:"text-align:left"} 
                        ,{text:"Monday"                         ,type:"input"           ,name:"monday"                      ,width:100       ,style:"text-align:left"} 
                        ,{text:"Tuesday"                        ,type:"input"           ,name:"tuesday"                     ,width:100       ,style:"text-align:left"} 
                        ,{text:"Wednesday"                      ,type:"input"           ,name:"wednesday"                   ,width:150       ,style:"text-align:left"}
                        ,{text:"Thursday"                       ,type:"input"           ,name:"thursday"                    ,width:100       ,style:"text-align:left"} 
                        ,{text:"Friday"                         ,type:"input"           ,name:"friday"                      ,width:100       ,style:"text-align:left"}
                        ,{text:"Saturday"                       ,type:"input"           ,name:"saturday"                    ,width:100       ,style:"text-align:left"}
                        ,{text:"Sunday"                         ,type:"input"           ,name:"sunday"                      ,width:100       ,style:"text-align:left"} 
                        ,{text:"No. Hours"                      ,type:"input"           ,name:"no_hours"                    ,width:100       ,style:"text-align:left"} 
                        ,{text:"Next Day Out"                   ,type:"input"           ,name:"next_day_out"                ,width:100       ,style:"text-align:left"} 
                        
                    ] 
                    ,onComplete : function(d){    
                        this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                        
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "shifts_upd"
                //,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00015"
               ,onComplete:function(data){
                    displayShifts();
               }
            });
        });
    
})();

                   