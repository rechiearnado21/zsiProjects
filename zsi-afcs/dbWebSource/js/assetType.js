  var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready = function(){
    $(".page-title").html("Asset Type");
    displayRecords();
}

 
function displayRecords(){
    var cb = app.bs({name:"cbFilter1",type:"checkbox"});
    
    $("#grid").dataBind({
             url        :app.execURL + "asset_type_sel"
            ,width      : $(".zContainer").width()
            ,height     : 300
            ,blankRowsLimit : 5
            ,dataRows   : [
                             {text: cb                                  ,width:25                   ,style:"text-align:left"
                                 ,onRender : function(d){
                                     return app.bs({name:"id"               ,type:"hidden"              ,value: svn (d,"id")}) 
                           //             +   bs({name:"is_edited"        ,type:"hidden"              ,value: svn (d,"is_edited")})
                                        + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                                 }
                             }
                            ,{text:"Asset Code"             ,type:"input"       ,name:"asset_code"              ,width:100          ,style:"text-align:left"}
                            ,{text:"Asset Type"             ,type:"input"       ,name:"asset_type"              ,width:400          ,style:"text-align:left"}
                            
                            
                          ]
                          ,onComplete : function(){
                              $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                          }
    });

}       

$("#btnSave").click(function (){
    $("#grid").jsonSubmit({
        procedure:"asset_type_upd"
        ,onComplete:function(data){
            
            if(data.isSuccess===true)zsi.form.showAlert("alert");
            displayRecords();
        }
    });
});

$("#btnDelete").click(function (){
    zsi.form.deleteData({ 
            code:"ref-00010"
           ,onComplete:function(data){
                 displayRecords();
           }
    });
});      