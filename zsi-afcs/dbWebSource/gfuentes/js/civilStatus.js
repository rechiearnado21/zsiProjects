 


(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready=function(){
        $(".page-title").html("Plants");
        displayRecords();
    }; 
    function displayRecords(){ 
         $("#gridStatus").dataBind({
    	     url            : app.execURL + "civil_statuses_sel"
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(document).height() - 260
            ,blankRowsLimit : 5 
            ,dataRows       : [
                                 {text: "Civil Status Code"     ,name:"civil_status_code"    ,type:"input"       ,width : 190   ,style : "text-align:left;"}
                                ,{text: "Civil Status Desc"     ,name:"civil_status_desc"    ,type:"input"       ,width : 190   ,style : "text-align:left;"}
    	                    ]
        	     
        });    
    }
    
    $("#btnSave").click(function () {
       $("#gridStatus").jsonSubmit({
                 procedure  : "civil_statuses_upd" 
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridStatus").trigger("refresh");
                }
        });
    });
     
})();

                        