var signup = (function(){
    var  _public            = {}
        ,bs                 = zsi.bs.ctrl
        ,svn                = zsi.setValIfNull 
    ;
    $(document).ready(function(){
		console.log("asdasdadsada");
        validations();
        selects();
    });
    function selects(){
        $("#company_code").datepicker({
              pickTime  : false
            , autoclose : true
            , todayHighlight: true 
        });
        
        $("#bank_id").dataBind({
            sqlCode      : "B1245" //banks_sel
           ,text         : "bank_name"
           ,value        : "bank_id"
           ,onChange     : function(d){
               //var _info           = d.data[d.index - 1];
               //pms_type_id     = isUD(_info) ? "" : _info.pms_type_id; 
           }
        });
    }
    function validations(){ 
        console.log("asdad")
        var forms = document.getElementsByClassName('needs-validation'); 
    	var validation = Array.prototype.filter.call(forms, function(form) {
    		form.addEventListener('submit', function(event) {
    		    $("form").removeClass('was-validated');
    			if (form.checkValidity() === false) {
    				event.preventDefault();
    				event.stopPropagation();
    			    $("form").addClass('was-validated');
    			}else{ 
        			event.preventDefault();
        			event.stopPropagation();
    			    $('#myModal').modal('show');
    			    $("form").addClass('was-validated');
    			}
    		}, false);
    	});
    	
    }
    
    $("#btnSave").click(function () {
        var _$frm = $("#frmSignUp"); 
            _$frm.jsonSubmit({
             procedure: "vehicle_registrations_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess){
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                   _$frm.find("input").val("");
                   _$frm.find("textarea").val(""); 
                   _$frm.find("select").val(null).trigger('change');
                   $("form").removeClass('was-validated');
                   $("#myModal").find("#msg").text("Data successfully saved.");
                   $("#myModal").find("#msg").css("color","green"); 
                   setTimeout(function(){
                       $("#myModal").modal('toggle');
                   },1000);
                }else{
                   $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                   $("#myModal").find("#msg").css("color","red");
                }
            }
        }); 
    });
      
    return _public;
    
    
    
})();         