(function(){
    var bs = zsi.bs.ctrl;
    var svn =  zsi.setValIfNull;
    
    zsi.ready=function(){
        $(".page-title").html("Inactive Type");
        displayRecords();
    }; 
    function displayRecords(){ 
         $("#grid").dataBind({
    	     url            : app.execURL + "inactive_types_sel"
    	    ,width          : $(".zContainer").width()
    	    ,height         : $(document).height() - 260
            ,blankRowsLimit : 5 
            ,dataRows       : [
                                 {text: "Inactive Type Code"     ,name:"inactive_type_code"    ,type:"input"       ,width : 190   ,style : "text-align:left;"}
                                ,{text: "Inactive Type Desc"     ,name:"inactive_type_desc"    ,type:"input"       ,width : 190   ,style : "text-align:left;"}
    	                    ]
        	     
        });    
    }
    
    $("#btnSave").click(function () {
       $("#grid").jsonSubmit({
                 procedure  : "inactive_types_upd" 
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#grid").trigger("refresh");
                }
        });
    });
     
})();

                         