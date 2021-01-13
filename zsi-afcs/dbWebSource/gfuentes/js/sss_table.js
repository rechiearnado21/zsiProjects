(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready = function(){
        $(".page-title").html("SSS");
        displaySSS();
    };
    
    //save
    $("#btnSave").click(function () {
    $("#sssGrid").jsonSubmit({
              procedure: "sss_table_upd"
            ,onComplete: function (data) {
               // $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displaySSS();
            }
    });
    });
    //save
    //delete 
    $("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0004"
        ,onComplete : function(data){
                        displaySSS();
                      }
    });    
    });
    
    function displaySSS(){
    var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
    $("#sssGrid").dataBind({
             url            : app.procURL + "sss_table_sel"
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(document).height() - 260
            ,blankRowsLimit : 5
            ,dataRows   : [
                             {text: cb                      ,width:25           ,style:"text-align:center"
                                 ,onRender : function(d){
                                     return   app.bs({name:"id",type:"hidden",value: svn (d,"id")}) 
                                            + app.bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                            + (d !== null ? bs({name:"cb",type:"checkbox"}) : "" );
                                 }
                             }
                            ,{text:"Salary Range (From)"        ,type:"input"       ,name:"salary_fr"               ,width:150        ,style:"text-align:center"}
                            ,{text:"Salary Range (To)"          ,type:"input"       ,name:"salary_to"               ,width:150        ,style:"text-align:center"}
                            ,{text:"MSC         "               ,type:"input"       ,name:"msc"                     ,width:150        ,style:"text-align:center"}
                            ,{text:"SSC_ER"                     ,type:"input"       ,name:"ssc_er"                  ,width:160        ,style:"text-align:center"}
                            ,{text:"SSC_EE"                     ,type:"input"       ,name:"ssc_ee"                  ,width:150        ,style:"text-align:center"}
                            ,{text:"ECC_ER"                     ,type:"input"       ,name:"ecc_er"                  ,width:150        ,style:"text-align:center"}
                            
                          ]
                          ,onComplete: function(){
                            $("#cbFilter1").setCheckEvent("#sssGrid input[name='cb']");
                          }  
    });
    
    }     
})(); 