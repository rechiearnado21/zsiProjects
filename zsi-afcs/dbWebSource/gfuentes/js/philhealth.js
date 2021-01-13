(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;

    zsi.ready = function(){
         $(".page-title").html("Phil Health");
         displayPhilHealth();
    };
     
     //save
    $("#btnSave").click(function () {
       $("#philHealth").jsonSubmit({
                 procedure: "philhealth_table_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayPhilHealth();
                }
        });
    });
    
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-0001"
            ,onComplete : function(data){
                displayPhilHealth();
            }
        });   
    });  
    
    function displayPhilHealth(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#philHealth").dataBind({
                 url            : app.procURL + "philhealth_table_sel"
        	    ,width          : $(".zContainer").width()
        	    ,height         : $(document).height() - 260
                ,blankRowsLimit : 5
                ,dataRows   : [
                    {text: cb                      ,width:25           ,style:"text-align:center"
                     ,onRender : function(d){
                         return   app.bs({name:"philhealth_id",type:"hidden",value: svn (d,"philhealth_id")}) 
                                + app.bs({name:"is_edited"            ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                + (d !== null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                        }
                    }
                    ,{text:"Salary Range (From)"        ,type:"input"       ,name:"salary_fr"               ,width:150        ,style:"text-align:center"}
                    ,{text:"Salary Range (To)"          ,type:"input"       ,name:"salary_to"               ,width:150        ,style:"text-align:center"}
                    ,{text:"Salary Base"                ,type:"input"       ,name:"salary_base"             ,width:150        ,style:"text-align:center"}
                    ,{text:"Total Monthly Premium"      ,type:"input"       ,name:"total_monthly_premium"   ,width:160        ,style:"text-align:center"}
                    ,{text:"Employee Share"             ,type:"input"       ,name:"ee_share"                ,width:150        ,style:"text-align:center"}
                    ,{text:"Employer Share"             ,type:"input"       ,name:"er_share"                ,width:150        ,style:"text-align:center"}
                    
                ]
                ,onComplete: function(){
                    $("#cbFilter1").setCheckEvent("#philHealth input[name='cb']");
                }  
        });
    
    }   
})();
 
 
 
 
 
 
 
 
 
         