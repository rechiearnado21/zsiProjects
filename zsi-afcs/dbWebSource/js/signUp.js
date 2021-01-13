var signup = (function(){
    var  _public            = {}
        ,gCompanyId         = null
    ;
    zsi.ready = function(){
        $(".pageTitle").remove();
        $(":input").inputmask();
        selects();
    };
    
    function selects(){
        //$("#bank_id").select2({placeholder: "",allowClear: true});
        $("#state_id").select2({placeholder: "",allowClear: true});
        $("#city_id").select2({placeholder: "",allowClear: true});
        //$("#name_suffix").select2({placeholder: "NAME SUFFIX ------",allowClear: true});
        $("#company_code").datepicker({
              pickTime  : false
            , autoclose : true
            , todayHighlight: true 
        });
        
        $("#bank_id").dataBind({
            sqlCode      : "B1245" //banks_sel
           ,text         : "bank_name"
           ,value        : "bank_id"
        });
        
        $("#name_suffix").dataBind({
            sqlCode      : "D1302" //dd_name_suffix_sel
           ,text         : "name_suffix"
           ,value        : "name_suffix"
           ,onComplete   : function(){
                $("option:first-child",this).text("NAME SUFFIX");
                $("option:first-child",this).val("");
           }
        });
        
        $("#state_id").dataBind({
            sqlCode : "D1275" //dd_states_sel
            ,text : "state_name"
            ,value : "state_id"
            ,onChange : function(d){
                var _info = d.data[d.index - 1]
                    ,state_id = isUD(_info) ? "" : _info.state_id;
                   
                $("#city_id").dataBind({
                    sqlCode      : "D1273" //dd_cities_sel
                    ,parameters   : {state_id:state_id}
                    ,text         : "city_name"
                    ,value        : "city_id"
                    ,onChange     : function(d){
                        var _info = d.data[d.index - 1]
                            ,city_id = isUD(_info) ? "" : _info.city_id;
                    }
                });
            }
        });
    }
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
   $(".toggle-password").on('click', function() {
        var input = $("#password");
        if(input.attr('type') === 'password'){ 
            input.attr('type','text');
            $(this).addClass("fa-eye-slash");
            $(this).removeClass("fa-eye");
        }else{
            input.attr('type','password');
            $(this).addClass("fa-eye");
            $(this).removeClass("fa-eye-slash");
        }
    });
    
    $(".toggle-dummy-password").on('click', function() {
        var input = $("#dummyPassword");
        if(input.attr('type') === 'password'){ 
            input.attr('type','text');
            $(this).addClass("fa-eye-slash");
            $(this).removeClass("fa-eye");
        }else{
            input.attr('type','password');
            $(this).addClass("fa-eye");
            $(this).removeClass("fa-eye-slash");
        }
    });
    
    $("#password").on("keyup change", function(){
        var _password = $("#dummyPassword");
        var _confirmPass = $(this);
        
        if(_password.val() !== _confirmPass.val()){
            $("#error").removeClass("hide");
        }else{
            $("#error").addClass("hide");
        }
    });
    
   $("#btnSubmit").click(function(){ 
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
    	
    });
    
    $("#btnSave").click(function () {
        var _$div1 = $("#companySaveDiv");
        var _$div2 = $("#usersSaveDiv");
        _$div1.find("#file").attr("disabled", true);
        _$div2.find("input,select").attr("disabled", true);
        var _$frm = $("#frmSignUp"); 
        _$frm.jsonSubmit({
             procedure: "company_info_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) {
                gCompanyId = data.returnValue;
                if(data.isSuccess){
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#btnSubmit").removeAttr("disabled");
                    _$div1.find("input,select").attr("disabled", true);
                    _$div2.find("input,select").removeAttr("disabled");
                    _$frm.find("#companyId").val(gCompanyId);
			        setTimeout(function(){
    			        _$frm.jsonSubmit({
                             procedure: "admin_user_upd" 
                            ,isSingleEntry: true
                            ,onComplete: function (data) {
                                if(data.isSuccess){
                                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                                   $("form").removeClass('was-validated');
                                   $("#myModal").find("#msg").text("Data successfully saved.");
                                   $("#myModal").find("#msg").css("color","green"); 
                                   modalTxt();
                                   setTimeout(function(){
                                       $("#myModal").modal('toggle');
                                       location.href = "";
                                   },1000);
                                }else{
                                   $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                                   $("#myModal").find("#msg").css("color","red");
                                   modalTxt();
                                }
                            }
                        }); 
                        
                        setTimeout(function(){
                            _$div1.find("#file").removeAttr("disabled");
                            _$div2.find("input,select").attr("disabled", true);
                            var fileOrg=_$frm.find("#file").get(0);
                            if( fileOrg.files.length<1 ) { 
                                 alert("Please select image.");
                                return;
                            }
                            var formData = new FormData( _$frm.get(0));
                            $.ajax({
                                url: base_url + 'file/UploadImage',  //server script to process data
                                type: 'POST',
                        
                                //Ajax events
                                success: completeHandler = function(data) {
                                    if(data.isSuccess){
                                        //submit filename to server
                                        $.get(base_url  + "sql/exec?p=dbo.image_file_upd @company_id=" + gCompanyId
                                                        + ",@company_logo='user." +  fileOrg.files[0].name + "'"
                                        ,function(data){
                                            zsi.form.showAlert("alert"); 
                                        });   
                                    }else
                                        alert(data.errMsg);
                                },
                                error: errorHandler = function() {
                                    console.log("error");
                                },
                                // Form data
                                data: formData,
                                //Options to tell JQuery not to process data or worry about content-type
                                cache: false,
                                contentType: false,
                                processData: false
                            }, 'json');
                        },500);
                        
			        },1000);
			       
                }
            }
        });
    });
      
    return _public;
    
    
    
})();                       