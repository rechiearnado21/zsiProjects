  var client = (function(){
    var _pub         = {}  
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Client Loads"); 
        displayClientLoads();  
    };
    
    function displayClientLoads(){
        $("#gridClientLoads").dataBind({
             sqlCode     : "C1324" //client_loads_sel
            ,height      : $(window).height() - 248
            ,dataRows    : [
                {text: "Client", width: 130, style: "text-align:center"
                    ,onRender : function(d){  
                        return app.bs({type:"select" ,name:"client_id"  ,value: app.svn(d,"client_id")});
                    }
                }
                ,{text: "Load Date", width : 120, style: "text-align:left"
                    ,onRender : function(d){ 
                        return app.svn (d,"load_date").toShortDate();
                    }
                }
                ,{text: "Load Amount", width: 120, style: "text-align:center"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"load_amount");
                    }
                }
                ,{text: "Ref No.", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"ref_no");
                    }
                } 
                ,{text: "Transfer Type", width:120 , style: "text-align:left"
                    ,onRender  :  function(d){  
                        return app.bs({type:"select" ,name:"transfer_type_id"  ,value: app.svn(d,"transfer_type_id")});
                    }
                }
                ,{text: "Transfer Ref No", width: 120, style: "text-align:left"
                    ,onRender  :  function(d){ 
                        return app.svn (d,"transfer_ref_no");
                    }
                } 
            ]
            ,onComplete  : function(o){ 
                this.find('[name="client_id"]').dataBind({
                    sqlCode : "D1326" //dd_clients_sel
                    ,text   : "client_name"
                    ,value  : "client_id" 
                }).attr("disabled",true); 
                this.find('[name="transfer_type_id"]').dataBind({
                    sqlCode : "D1284" //dd_transfer_type_sel
                    ,text   : "transfer_type"
                    ,value  : "transfer_type_id"
                }).attr("disabled",true);
            }
        });
    }
    function modalTxt(){
        setTimeout(function(){
           $("#myModal").find("#msg").text("Are you sure you want to save this data?");
           $("#myModal").find("#msg").css("color","#000");
        },1000);
    }
    
    $("#btnNew").click(function() {
        var _$mdl = $('#newClientModal');  
        var _$frm = _$mdl.find("form");
        var  _$client = _$frm.find('#client_id')
            ,_$loadedBy = _$frm.find('#loaded_by')
            ,_$transfer = _$frm.find('#transfer_type_id');  
            _$frm.find("[name='load_amount']").keydown(function(event) { 
                if ( event.keyCode == 46 || event.keyCode == 8 ) { 
                }
                else { 
                    if (event.keyCode < 48 || event.keyCode > 57 ) {
                        event.preventDefault(); 
                    }   
                }
            });
            _$frm.find("#transfer_ref_no").attr("readonly",true);
            _$client.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
            _$loadedBy.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl});
            _$transfer.select2({placeholder: "",allowClear: true, dropdownParent: _$mdl}); 
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
            _$mdl.find(".modal-footer").addClass("justify-content-start");
            _$mdl.modal('show'); 
            _$client.dataBind({
                sqlCode : "D1326" //dd_clients_sel
                ,text   : "client_name"
                ,value  : "client_id" 
            }); 
            _$transfer.dataBind({
                sqlCode : "D1284" //dd_transfer_type_sel
                ,text   : "transfer_type"
                ,value  : "transfer_type_id"
                ,onChange : function(d){
                    if($(this).val() === "") _$frm.find("#transfer_ref_no").attr("readonly",true);
                    else _$frm.find("#transfer_ref_no").removeAttr("readonly");
                }
            });
            
            $("#load_date").datepicker({ 
                  pickTime  : false
                , autoclose : true
                , todayHighlight: true 
            }).datepicker("setDate","0"); 
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
    $("#btnConfirm").click(function(){
        $("#myModal").modal('toggle');
        modalTxt();
        $(".yesno").removeClass("hide");
        $(this).addClass("hide");
    });
    
    $("#btnSave").click(function () { 
        var _$frm = $("#formClients"); 
        _$frm.jsonSubmit({
             procedure: "client_loads_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) { 
                if(data.isSuccess){
                    if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    $("#newClientModal").modal('toggle');
                    displayClientLoads();
			        setTimeout(function(){ 
                           _$frm.removeClass('was-validated');
                           $(".yesno").addClass("hide");
                           $("#myModal").find("#msg").text("Data successfully saved");
                           $("#myModal").find("#msg").css("color","green");
                           $("#btnConfirm").removeClass("hide"); 
                    });
                }
                else{
                   $("#myModal").find("#msg").text("Something went wrong when saving the data.");
                   $("#myModal").find("#msg").css("color","red");
                   modalTxt();
                }
            }
        });
    });
    
    return _pub;
})();            