var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready = function(){
     displayHMDF();
}

 
function displayHMDF(){
    var cb = bs({name:"cbFilter1",type:"checkbox"});
    
    $("#grid").dataBind({
             url        :execURL + "hmdf_table_sel"
            ,width      : 1100
            ,height     : 300
            ,blankRowsLimit : 5
            ,dataRows   : [
                             {text: cb                                  ,width:25                   ,style:"text-align:left"
                                 ,onRender : function(d){
                                     return bs({name:"id"               ,type:"hidden"              ,value: svn (d,"id")}) 
                                        +   bs({name:"is_edited"        ,type:"hidden"              ,value: svn (d,"is_edited")})
                                        + (d !== null ? bs({name:"cb"   ,type:"checkbox"}) : "" );
                                 }
                             }
                            ,{text:"Salary Range (From)"    ,type:"input"       ,name:"salary_fr"       ,width:300        ,style:"text-align:left"}
                            ,{text:"Salary Range (To)"      ,type:"input"       ,name:"salary_to"       ,width:300         ,style:"text-align:left"}
                            ,{text:"Employee Share"         ,type:"input"       ,name:"ee_pct_share"    ,width:300         ,style:"text-align:left"}
                            ,{text:"Employer Share"         ,type:"input"       ,name:"er_pct_share"    ,width:300         ,style:"text-align:left"}
                            
                          ]
                          ,onComplete : function(){
                              $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                          }
    });

}       

$("#btnSave").click(function (){
    $("#grid").jsonSubmit({
        procedure:"hmdf_table_upd"
        ,onComplete:function(data){
            
            if(data.isSuccess===true)zsi.form.showAlert("alert");
            displayHMDF();
        }
    });
});

$("#btnDelete").click(function (){
    zsi.form.deleteData({ 
            code:"ref-0007"
           ,onComplete:function(data){
               console.log("sr")
                 displayHMDF();
           }
    });
});  