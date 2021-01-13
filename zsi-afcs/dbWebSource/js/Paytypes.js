  
(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
      /*  , $j   = jQuery.noConflict()*/
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Pay Types");
        displayPayTypes(); 
    }; 
      
     function displayPayTypes(){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#grid").dataBind({
                 sqlCode            : "P171"  //pay types sel
                ,width              : $("#panel-content").width() + 200 
                ,blankRowsLimit     : 5
                ,dataRows           : [
                         {text:"Pay Type Code"                   ,type:"input"           ,name:"pay_type_code"      ,width:200       ,style:"text-align:left"} 
                        ,{text:"Pay Type Desc"                   ,type:"input"           ,name:"pay_type_desc"      ,width:200       ,style:"text-align:left"} 
    
                    ]  
                });
            }   
      
        $("#btnSavePayTypes").click(function () { 
            $("#grid").jsonSubmit({
                 procedure: "pay_types_upd" 
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#grid").trigger("refresh")
                } 
            }); 
        }); 
})();

                  