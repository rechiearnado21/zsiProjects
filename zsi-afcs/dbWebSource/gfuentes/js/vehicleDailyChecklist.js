(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready = function(){
        $(".page-title").html("Vehicle Daily Checklist");
         displayRecords();
    }
    
     
    function displayRecords(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        
        $("#grid").dataBind({
                 sqlCode    : "V177" //vehicle_daily_checklist_sel
                ,height     : $(window).height() - 230
                ,blankRowsLimit : 5
                ,dataRows   : [
                                 {text: cb                                  ,width:25                   ,style:"text-align:left"
                                     ,onRender : function(d){
                                         return app.bs({name:"id"               ,type:"hidden"              ,value: svn (d,"id")}) 
                               //             +   bs({name:"is_edited"        ,type:"hidden"              ,value: svn (d,"is_edited")})
                                            + (d !== null ? app.bs({name:"cb"   ,type:"checkbox"}) : "" );
                                     }
                                 }
                                ,{text:"Code"                   ,type:"input"       ,name:"code"            ,width:100          ,style:"text-align:left"}
                                ,{text:"Work Description"       ,type:"input"       ,name:"work_desc"       ,width:400          ,style:"text-align:left"}
                              ]
                              ,onComplete : function(){
                                  this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
                              }
        });
    
    }       
    
    $("#btnSave").click(function (){
        $("#grid").jsonSubmit({
            procedure:"vehicle_daily_checklist_upd"
            ,onComplete:function(data){
                
                if(data.isSuccess===true)zsi.form.showAlert("alert");
                displayRecords();
            }
        });
    });
    
    $("#btnDelete").click(function (){
        zsi.form.deleteData({ 
                code:"ref-0002"
               ,onComplete:function(data){
                     displayRecords();
               }
        });
    });      
})(); 