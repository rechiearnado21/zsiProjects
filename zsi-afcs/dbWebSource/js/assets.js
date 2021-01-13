 
(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Assets");
        displayAssets(); 
    }; 
    function displayAssets(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "assets_sel"  
                ,width              : $("#panel-content").width()  
                ,blankRowsLimit     : 5
                ,dataRows           : [
                        {text:cb        ,width:25              ,style : "text-align:left"
                            ,onRender  :  function(d){ return app.bs({name:"asset_id"   ,type:"hidden"      ,value: svn (d,"asset_id")}) 
                                            + app.bs({name:"is_edited"                  ,type:"hidden"      ,value: svn(d,"is_edited")}) 
                                            +  (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                            
                            }
                        
                        } 
                        ,{text:"Asset Type"                   ,type:"select"          ,name:"asset_type_id"                  ,width:200       ,style:"text-align:left"} 
                        ,{text:"Asset No"                     ,type:"input"           ,name:"asset_no"                       ,width:100       ,style:"text-align:left"} 
                        ,{text:"Date Acquired"                ,width:200       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"    ,name:"date_acquired"    ,value: svn(d,"date_acquired").toShortDate()});
                    
                            }
                        }  
                        ,{text:"Exp Registration Date"        ,width:200       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"    ,name:"exp_registration_date"    ,value: svn(d,"exp_registration_date").toShortDate()});
                    
                            }
                        }
                        ,{text:"Exp Insurance Date"           ,width:200       ,style:"text-align:left"
                            ,onRender: function(d){ return app.bs({type:"input"    ,name:"exp_insurance_date"    ,value: svn(d,"exp_insurance_date").toShortDate()});
                    
                            }
                        }
                        ,{text:"Status"                       ,type:"select"          ,name:"status_id"                ,width:150       ,style:"text-align:left"}
                        ,{text:"Is Active"                    ,type:"yesno"           ,name:"is_active"                ,width:80        ,style:"text-align:left"     ,defaultValue:"Y"} 
                    ] 
                    ,onComplete : function(d){    
                        this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");  
                 
                        this.find("#asset_type_id").attr("selectedvalue",d.asset_type_id);
                        this.find("[name='date_acquired']").datepicker().attr("readonly",true); 
                        this.find("[name='exp_registration_date']").datepicker().attr("readonly",true); 
                        this.find("[name='exp_insurance_date']").datepicker().attr("readonly",true); 
                        this.find("select[name='status_id']").dataBind({
                             sqlCode    : "A181" 
                            ,text       : "asset_status"
                            ,value      : "asset_status_id" 
                        }); 
                        this.find("select[name='asset_type_id']").dataBind({
                             sqlCode    : "A163" 
                            ,text       : "asset_type"
                            ,value      : "id" 
                        }); 
                        
                    } 
                });
            }   
    
    
        $("#btnSaveAssets").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "assets_upd"
                ,optionalItems: ["is_active"] 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh")
                } 
            }); 
        });
        
        $("#btnDeleteAssets").click(function (){ 
            zsi.form.deleteData({ 
                code:"ref-00011"
               ,onComplete:function(data){
                    displayAssets();
               }
            });
        });
    
})();

                 