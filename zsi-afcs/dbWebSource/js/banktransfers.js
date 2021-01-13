   var payment = (function(){
        var  _pub            = {} 
            ,gDate           = ""
            ,gPaymentId      = "";
    
    zsi.ready = function(){
        $(".page-title").html("Bank Transfer");  
        zsiReadyEvents();
        displayTransfered(); 
        displayForTransfer(); 
    };
    
    function zsiReadyEvents(){
        var _$frm =  $("#frm_post"); 
        $("#bank_id").dataBind({
            sqlCode        : "B1245" //banks_sel
            ,parameters : {is_active : "Y"}
            ,text       :   "bank_code"
            ,value      : "bank_id"
        });  
        _$frm.find("#company_code").val(app.userInfo.company_code); 
        $('#bank_id').select2({placeholder: "Select Bank",allowClear: true});
        $("#bank_transfer_date").datepicker({pickTime  : false , autoclose : true , todayHighlight: true}).datepicker("setDate","0");
        $("#posted_date").datepicker({pickTime  : false , autoclose : true , todayHighlight: true }).datepicker("setDate","0");
    }
    function displayForTransfer(postedDate){ 
        $("#gridBankForTransfer").dataBind({
             sqlCode        : "F1246" //for_bank_transfer_sel
            ,parameters     : {posted_date:(postedDate ? postedDate:"")}
            ,height         : $(window).height() - 335 
            ,dataRows       : [
                {text: "Posted Date"             ,width : 130 
                    ,onRender: function(d){
                        return app.bs({type: "input"        ,name: "posted_date"           ,value: app.svn(d,"posted_date").toShortDate()    ,style : "text-align:center"});
                    }
                } 
                ,{text: "Posted Amount"                     ,width : 130   ,style : "text-align:right;padding-right: 0.3rem;"
                    ,onRender: function(d){
                        return app.bs({type: "input"        ,name: "posted_amount"          ,value: app.svn(d,"posted_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                    }
                }
                ,{text: "Bank Transfer"                     ,name:"bank_transfer_id"                    ,type:"select"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Company Code"                      ,name:"company_code"                        ,type:"input"       ,width : 100   ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
               this.find(".zRow").find("input").attr("readonly",true); 
               var _totalAmt = this.find("[name='posted_amount']").map( function() { return parseFloat($(this).val().replace(/,/g, "")); } ).get(); 
              /* var val = this.value.replace(/,/g, "");
                if (isNaN(val)) {
                    alert("Please only enter valid values.");
                } else {
                    parseFloat(val)
                }*/
               computeTotalAmt(_totalAmt)
            }
        });
    }
    function computeTotalAmt(amt){  
        var _total = 0;
        for (var i = 0; i < amt.length; i++) {
            _total += amt[i];
            if(_total !=="" ? _total : 0.00);
        }   
        $("#frm_post").find("#transferred_amount").val(_total);  
    } 
    function displayTransfered(){
        $("#gridBankTransfered").dataBind({
             sqlCode        : "P1247" //posted_banktransfers_sel 
            ,height         : $(window).height() - 245 
            ,dataRows       : [
                
                 {text: "Bank Transfer Date"              ,width : 120   ,style : "text-align:left;"
                     ,onRender : function(d){
                         return app.bs({type:"input"    ,value:app.svn(d,"bank_transfer_date").toShortDate()});
                     }
                 }
                ,{text: "Bank"                              ,name:"bank_code"                       ,type:"input"       ,width : 100   ,style : "text-align:left;"} 
                ,{text: "Reference No"                      ,name:"bank_ref_no"                     ,type:"input"       ,width : 100   ,style : "text-align:left;"}
                ,{text: "Company Code"                      ,name:"company_code"                    ,type:"input"       ,width : 100   ,style : "text-align:left;"}
                ,{text: "Amount"                                                                                        ,width : 130   ,style : "text-align:right;padding-right: 0.3rem;"
                    ,onRender: function(d){
                        return app.bs({name: "transferred_amount"          ,type: "input"     ,value: app.svn(d,"transferred_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                    }
                }
                ,{text: "Posted Date"                                                                                   ,width : 100   ,style : "text-align:left;"
                    ,onRender : function(d){
                         return app.bs({type:"input"        ,value:app.svn(d,"posted_date").toShortDate()});
                     }
                } 
            ]
            ,onComplete: function(){
                this.find(".zRow").find("input").attr("readonly",true); 
            }
        });
    }   
    $("#btnFilter").click(function(){
        var _$frm = $("#frm_post")
            ,_$bank = _$frm.find("#bank_id").val()
            ,_$refNo = _$frm.find("#bank_ref_no").val()
            ,_$date = $.trim(_$frm.find("#bank_transfer_date").val()) 
            ,_$postedDate = _$frm.find("#posted_date").val(); 
            displayForTransfer(_$postedDate);
    }); 
    $("#btnSaveTransations").click(function(){
        var _$frm =  $("#frm_post"); 
        _$frm.jsonSubmit({
             procedure: "bank_transfers_upd" 
            ,isSingleEntry: true
            ,onComplete: function (data) { 
                if(data.isSuccess){ 
                    zsi.form.showAlert("alert");
                    $("#gridBankForTransfer").trigger("refresh");
                    $("#gridBankTransfered").trigger("refresh");
                }
            }
        });

    });

    return _pub;
})();                                            