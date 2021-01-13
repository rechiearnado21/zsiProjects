 
(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("DTR");
        displayDTR(); 
    }; 
    function displayDTR(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "dtr_sel"  
                ,width              : $("#panel-content").width()  
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"id"         ,type:"hidden"      ,value: svn (d,"id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        
                        } 
                        ,{text:"Employee"                       ,type:"select"          ,name:"employee_id"                     ,width:200       ,style:"text-align:left"} 
                        ,{text:"DT In"                          ,width:100              ,style:"text-align:left"
                                ,onRender: function(d){ return app.bs({type:"input"    ,name:"dt_in"    ,value: svn(d,"dt_in").toShortDate()});
                            }
                        } 
                        ,{text:"DT Out"                         ,width:100              ,style:"text-align:left"
                                ,onRender: function(d){ return app.bs({type:"input"    ,name:"dt_out"    ,value: svn(d,"dt_out").toShortDate()});
                            }
                        } 
                        ,{text:"Shifts"                         ,type:"select"          ,name:"shift_id"                        ,width:150       ,style:"text-align:left"}
                        ,{text:"Reg Hours"                      ,type:"input"           ,name:"reg_hours"                        ,width:100       ,style:"text-align:left"} 
                        ,{text:"ND Hours"                       ,type:"input"           ,name:"nd_hours"                        ,width:100       ,style:"text-align:left"} 
                        ,{text:"Total Hours"                    ,type:"input"           ,name:"total_hours"                     ,width:100       ,style:"text-align:left"} 
                        
                    ] 
                    ,onComplete : function(d){    
                        this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                        this.find("[name='employee_id']").dataBind("employees");
                        this.find("[name='dt_in']").datepicker().attr("readonly",true); 
                        this.find("[name='dt_out']").datepicker().attr("readonly",true); 
                        this.find("[name='shift_id']").dataBind("shifts");
                    } 
                });
            }   
    
    
        $("#btnSave").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "dtr_upd"
                ,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh");
                } 
            }); 
        });
        
        $("#btnDelete").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00016"
               ,onComplete:function(data){
                    displayDTR();
               }
            });
        });
    
})();

                      