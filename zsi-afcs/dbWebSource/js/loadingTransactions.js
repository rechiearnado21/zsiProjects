var loadingTransactions = (function(){
    var _pub            = {};
    
    zsi.ready = function(){
        $(".page-title").html("Loading Transactions");
        displayLoadingTransactions();
        validation();
    };
    
    function validation(){
        $("#load_date_frm").datepicker({
             autoclose : true
            ,todayHighlight: true 
        }).on("changeDate keyup change",function(e){ 
            $("#load_date_to").val("");
            if($(this).val() ===""){ $("#load_date_to").attr("disabled",true); $("#load_date_to").val(""); }
            else{ $("#load_date_to").removeAttr("disabled"); } 
            gVfrom = $(this).val(); 
            $("#load_date_to").removeAttr("readonly",true); 
            $("#load_date_to").datepicker('setStartDate', e.date).on("change",function(){
               gVtoDate = $(this).val();
            }); 
        }); 
       
    }
    
    function displayLoadingTransactions(loadDateFrm,loadDateTo){
        $("#gridLoadingTransactions").dataBind({
             sqlCode        : "L1237" //loading_transactions_sel
            ,parameters     : {load_date_frm:(loadDateFrm ? loadDateFrm : ""),load_date_to:(loadDateTo ? loadDateTo : "")} 
            ,height         : $(window).height() - 240
            ,dataRows       : [
                {text: "Load Date"                                                                     ,width : 200
                     ,onRender: function(d){
                        return app.bs({name: "load_date"          ,type: "input"     ,value: app.svn(d,"load_date").toShortDates()    ,style : "text-align:center;"});
                    }
                 }
                ,{text: "QR Id"                      ,name:"qr_id"                   ,type:"input"      ,width : 60    ,style : "text-align:center;"}
                ,{text: "Load Amount"                                                                   ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"
                    ,onRender: function(d){
                        return app.bs({name: "load_amount"        ,type: "input"     ,value: app.svn(d,"load_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                    }
                }
                ,{text: "Loaded By"                  ,name:"loaded_by"              ,type:"input"       ,width : 150   ,style : "text-align:center;"}
                //,{text: "Compay Code"                ,name:"company_code"           ,type:"input"       ,width : 100   ,style : "text-align:center;"}
            ]
            ,onComplete: function(){
                var _this = this;
                var _zRow = _this.find(".zRow");
                this.find("input").attr("readonly",true);
                var _$dateFr = _this.find(".zRow:first-child()").find("[name='load_date']").val();
                var _$dateTo = _this.find(".zRow:last-child()").find("[name='load_date']").val();
                var _dateFr = isUD(_$dateFr) ? "" : _$dateFr.toShortDates();
                var _dateTo = isUD(_$dateTo) ? "" : _$dateTo.toShortDates();
                $("#load_date_frm").datepicker({todayHighlight:true}).datepicker("setDate",_dateFr);
                $("#load_date_to").datepicker({todayHighlight:true}).datepicker("setDate",_dateTo);
                
            }
        });
    }
    
    $("#btnFilterVal").click(function(){ 
        var _dateFrm = $.trim($("#load_date_frm").val());  
        var _dateTo = $.trim($("#load_date_to").val());
        displayLoadingTransactions(_dateFrm,_dateTo);
    }); 

    $("#load_date").on("keyup change",function(){
        if($(this).val() === "") {
            displayLoadingTransactions();
        }
    });

    $("#btnResetVal").click(function(){
        displayLoadingTransactions();
    });

    return _pub;
})();                    