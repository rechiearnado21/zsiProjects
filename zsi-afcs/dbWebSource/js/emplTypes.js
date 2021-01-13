  
(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Employee Types");
        displayEmployeeTypes(); 
    }; 
    function displayEmployeeTypes(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 url                : app.procURL + "empl_types_sel"  
                ,width              : $("#panel-content").width() + 200 
                ,blankRowsLimit     : 5
                ,dataRows           : [
                         {text:"Empl Type Code"                   ,type:"input"           ,name:"empl_type_code"      ,width:200       ,style:"text-align:left"} 
                        ,{text:"Empl Type Desc"                   ,type:"input"           ,name:"empl_type_desc"      ,width:200       ,style:"text-align:left"} 
    
                    ]  
                });
            }   
    
    
        $("#btnSaveEmployee").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "empl_types_upd" 
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

                  