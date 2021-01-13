(function(){
    var msg = "";
    zsi.ready = function(){
        $(".pageTitle").remove();
    };
    
    $(document).ready(function(){
        msg = zsi.getUrlParamValue("msg");
    	if(msg=="invalid") {
    	    if(msg){
    	        $("#myModal").find("#msg").text("Invalid old password.  Please try again.");
                $("#myModal").find("#msg").css("color","red");
                $('#myModal').modal('show');
    	    }
        }else{
            $("#myModal").find("#msg").text("Password successfully updated.");
            $("#myModal").find("#msg").css("color","green");
            modalTxt();
        }
        
    });
    
    $("#btnSave").click(function(){
        var _$frm = $("#frm");
        var _frm= _$frm[0];
        var oldPassword = $.trim($("#old_password").val());
        var newpassword = $.trim($("#new_password").val());
        var retypePassword = $.trim($("#retype_password").val());
        
        modalTxt();    
        if( ! _frm.checkValidity()){
            _$frm.addClass('was-validated');
            
        }else if((oldPassword &&  newpassword) || (newpassword &&  retypePassword)){
            if(oldPassword === newpassword) {
                $('#pop1').attr("data-content", "Password is the same with old password.");
                $('#pop1').popover("show", 400);
            }else{
                $('#pop1').popover("hide", 400);
                
                if(!/[A-Z]/ || !/[a-z]/ || !/[0-9]/.test(newpassword)){
                    $('#pop1').attr("data-content", "Your password must contain at least one upper and lower case letter and numerals.");
                    $('#pop1').popover("show", 400);
                }else if(newpassword.length < 8){
                    $('#pop1').attr("data-content", "Password is too short.");
                    $('#pop1').popover("show", 400);
                }else if(newpassword != retypePassword) $('#pop2').popover("show", 400);
                else{
                    $('#pop2').popover("hide", 400);
                    $('#myModal').modal('show');
                    
                }
            }
        }
    });
    
    $("#btnSavePassword").click(function(){
        var oldPassword = $.trim($("#old_password").val());
        if(oldPassword) $("#frm").submit();
    });
    
    $("#newPassBtn,#reTypePassBtn,#oldPassBtn").click(function(){
       var _colName    = $(this)[0].id;
       
       if($("#"+ _colName).closest(".row").find("input").attr("type") === "password"){
           $("#"+_colName).closest(".row").find("input").attr("type","text");
           $("#"+_colName).find("i").removeClass("fa-eye");
           $("#"+_colName).find("i").addClass("fa-eye-slash");
       }else{
           $("#"+_colName).closest(".row").find("input").attr("type","password");
           $("#"+_colName).find("i").addClass("fa-eye");
           $("#"+_colName).find("i").removeClass("fa-eye-slash");
       }
       
    });
    
    function encryptedPassword(password){
        var url = base_url + "account/getnewpassword?pwd=" + password;
        
        $.get(url,function(data){
           $("#password").val(data);
        });
    }
    
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to update your password?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
})();
 
    
    