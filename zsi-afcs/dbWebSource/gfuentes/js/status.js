   var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready = function(){
    $(".page-title").html("Status");
    displayStatus();
}

 
function displayStatus(){
    var cb = app.bs({name:"cbFilter1",type:"checkbox"});
    
    $("#grid").dataBind({
             url        :app.execURL + "asset_statuses_sel"
            ,width      : $(".zContainer").width()
            ,height     : 300
            ,blankRowsLimit : 5
            ,dataRows   : [
                             {text: cb                                  ,width:25                   ,style:"text-align:left"
                                 ,onRender : function(d){
                                     return app.bs({name:"asset_status_id"               ,type:"hidden"              ,value: svn (d,"asset_status_id")})  
                                        + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                                 }
                             }
                            ,{text:"Asset Status Code"        ,type:"input"       ,name:"asset_status_code"              ,width:200          ,style:"text-align:left"}
                            ,{text:"Asset Status"             ,type:"input"       ,name:"asset_status"              ,width:200          ,style:"text-align:left"}
                            
                            
                          ]
                          ,onComplete : function(){
                              $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                          }
    });

}       

$("#btnSave").click(function (){
    $("#grid").jsonSubmit({
        procedure:"asset_statuses_upd"
        ,onComplete:function(data){ 
            if(data.isSuccess===true)zsi.form.showAlert("alert");
            displayStatus();
        }
    });
});

$("#btnDelete").click(function (){
    zsi.form.deleteData({ 
            code:"ref-00012"
           ,onComplete:function(data){
               if(data.isSuccess===true)zsi.form.showAlert("alert");
                 displayStatus();
           }
    });
});         