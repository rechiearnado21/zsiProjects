 var fc = (function(){
    var  _pub                   = {} 
        ,gSubTabName            = ""
        ,gTabName               = ""  
    ;
    
    zsi.ready = function(){ 
        $(".page-title").html("Load Transactions");
        $(".panel-container").css("min-height", $(window).height() - 200);
        dateValidation();
        getFilters();
        displayLoadingTransaction(); 
    }; 
    
    gTabName = $.trim($(".main-nav-tabs").find(".nav-link.active").text()); 
    $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gTabName = $.trim($(e.target).text()); 
        dateValidation(); 
        displayLoadingTransaction(); 
    });
    
    function getFilters(){
        var  start_date = $("#startTransactionDate").val()
            ,end_date   = $("#endTransactionDate").val(); 
        return{
            start_date  : start_date
            ,end_date   : end_date   
        };
    }
    function dateValidation(){
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var _date1 = (d.getMonth() + 1) + "/01/" +    d.getFullYear();
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear(); 
        $("#startTransactionDate").datepicker({
             autoclose : true 
            ,endDate: d
            ,todayHighlight: false 
        }).datepicker("setDate", _date1).on("changeDate",function(e){
            $("#endTransactionDate").datepicker({endDate: yesterday,autoclose: true}).datepicker("setStartDate",e.date);
            $("#endTransactionDate").datepicker().datepicker("setDate",yesterday);
        }); 
         $("#endTransactionDate").datepicker({
             autoclose : true 
            ,endDate: yesterday
            ,todayHighlight: false 
        }).datepicker("setDate", yesterday);
 
    } 
    function displayLoadingTransaction(){  
        var _o = getFilters();
        var _sqlCode  = "R1458"  
            ,_params = {
                  client_id   : app.userInfo.company_id
                 ,pdate_from  : _o.start_date
                 ,pdate_to    : _o.end_date
            }; 
            switch(gTabName){  
                case "Recent Transaction":   
                    $("#dateDiv").hide();
                    _sqlCode = "R1458";
                    delete _params.pdate_from;
                    delete _params.pdate_to;
                break;
                case "History Transaction":  
                    $("#dateDiv").show();   
                    _sqlCode = "L1461";      
                break;
            }  
            var _getDataRows = function(){  
                var _dataRows =[];   
                    _dataRows.push(
                         {text: "Load Date"                ,width : 120                    ,style : "text-align:center;"   
                            ,onRender : function(d){
                                return app.bs({name: "loading_date"        ,type: "input"     ,value: app.svn(d,"loading_date").toShortDate()});
                            }
                        }
                        ,{text: "Load Personnel"                   ,name:"load_by"                ,type:"input"       ,width : 150     ,style : "text-align:center;" }   
                        ,{text: "Amount"                ,width : 120       ,style : "text-align:right;"  
                            ,onRender: function(d){
                                    return app.bs({name: "load_amount"      ,type: "input"          ,value: app.svn(d,"load_amount") ? app.svn(d,"load_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                } 
                        } 
                    );  
                 return _dataRows; 
            }; 
            $("#gridRecentLoadingTransaction").dataBind({
                 sqlCode        : _sqlCode
                ,parameters     :  _params
                ,height         : $(window).height() - 400 
                ,dataRows       : _getDataRows()   
                ,onComplete: function(o){
                    this.find("[name='load_amount']").maskMoney();
                    this.find("input").attr("disabled",true); 
                }
            }); 
        } 
        
    $("#btnFilterTransaction").click(function(){
        displayLoadingTransaction();
    });
    
    return _pub; 
})();     


                                                                                                                