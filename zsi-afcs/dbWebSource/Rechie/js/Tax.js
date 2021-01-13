var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;
zsi.ready = function(){
 displayTax();
}
 
 function displayTax(){
     var cb = bs({name:"cb1",type:"checkbox"});
    
    $("#tax").dataBind({
            width      : 550
            ,height     : 300
            ,blankRowsLimit : 5
            ,dataRows   : [
                             {text: cb              ,width:25       ,style:"text-align:center;"
                                ,onRender  :  function(d){ 
                                     return bs({name:"id",type:"hidden",value: svn (d,"id")}) + (d !==null ? bs({name:"cbTax",type:"checkbox"}) : "" ); 
                                    
                                }
                             }	 
                            ,{text:"Pay Type Code"          ,type:"input"       ,name:"pay_type_code"       ,width:100          ,style:"text-align:center"}
                            ,{text:"CL From"                ,type:"input"       ,name:"cl_fr"               ,width:100          ,style:"text-align:center"}
                            ,{text:"CL To"                  ,type:"input"       ,name:"cl_to"               ,width:100          ,style:"text-align:center"}
                            ,{text:"CL"                     ,type:"input"       ,name:"cl"                  ,width:100          ,style:"text-align:center"}
                            ,{text:"Add CL %"               ,type:"input"       ,name:"add_pct_cl"          ,width:100          ,style:"text-align:center"}
                            
                          ]
                          ,onComplete : function(){
                              $("#cbFilter1").setCheckEvent("#tax input[name='cbTax']");
                          }
    });
    
 }  