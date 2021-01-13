 var loadingTransactions = (function(){
    var _pub             = {}
        ,gDateType       = ""
        ,gLoaderId       = null
        ,gzGrid          = "#gridLoadingTransactions";
    
    zsi.ready = function(){
        $(".page-title").html("Load Transactions Report");
        $(".panel-container").css("min-height", $(window).height() - 190);
        displayLoadingTransactions();
        validation();
        $('#loaderId').select2({placeholder: "SELECT LOADER",allowClear: true});
        
        $("#loaderId").dataBind({
            sqlCode      : "D1270" 
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _loader_id         = isUD(_info) ? "" : _info.user_id;
                gLoaderId = _loader_id;
           }
        });
        
        $('[name="filter"]').on('change', function(){
            var _this = $(this);
            var _placeholderFrm = "";
            var _placeholderTo = "";
            if(_this.val() === "weekly"){ gDateType = "weekly";_placeholderFrm="FROM WEEK.....";_placeholderTo="TO WEEK....."}
            else if (_this.val() === "monthly"){ gDateType = "monthly";_placeholderFrm="FROM MONTH.....";_placeholderTo="TO MONTH....."}
            else{ gDateType = "yearly";_placeholderFrm="FROM YEAR.....";_placeholderTo="TO YEAR....."}
            
            if(_this.is(':checked')){
                $("#load_date_frm").attr("placeholder",_placeholderFrm);
                $("#load_date_to").attr("placeholder",_placeholderTo);
                $("#load_date_frm").val("");
                $("#load_date_to").val("");
                $(".date-range").removeClass("hide");
            }
            
        });
    };
    
    
    function validation(){
        var _dayFrom    = $("#load_date_frm");
        var _dayTo      = $("#load_date_to");
        var _timeFrom   = "";
        var _timeTo     = "";
        var _error      = $("#ermsgId");
        var _msg        = "Value must not be lesser than "
        var _erTypeMsg  = "";
        
        $("#load_date_frm,#load_date_to").on("keyup mouseup",function(){
            var _colName    = $(this)[0].id;
            if(gDateType === "weekly") _erTypeMsg = _msg + "from week value";
            else if(gDateType === "monthly") _erTypeMsg = _msg + "from month value";
            else _erTypeMsg = _msg + "from year value";
            
            _error.text(_erTypeMsg);
            
            if(_colName === "load_date_frm")_timeFrom = _dayFrom.val();
            else _timeTo = _dayTo.val();
            if(_timeFrom > _timeTo){
                _error.removeClass("hide");
                _dayTo.css("border-color","red");
                $("#btnFilterVal").attr("disabled",true);
            }else{
                _error.addClass("hide");
                _dayTo.css("border-color","green");
                $("#btnFilterVal").removeAttr("disabled");
            }
        });
        
        
    }
   
    function displayLoadingTransactions(loadDateFrm,loadDateTo,dateType,loaderId){
        zsi.getData({
                 sqlCode    : "L1267" 
                ,parameters     : {load_date_frm:(loadDateFrm ? loadDateFrm : ""),load_date_to:(loadDateTo ? loadDateTo : ""),date_type:(dateType ? dateType : ""),load_by:(loaderId ? loaderId : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _totality = 0.00;
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _totality  +=_info.load_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                         load_date          : ""
                        ,qr_id              : "Total Amount"
                        ,load_amount        : _totality
                        ,loaded_by          : ""
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 270
                        ,dataRows       : getDataRows()
                        ,onComplete: function(o){
                            var _this = this;
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="qr_id"]').css("font-weight","bold");
                            this.find("input").attr("readonly",true);
                            if(o.data.length <= 1)$("#btnExportTransations").attr("disabled",true);
                            else $("#btnExportTransations").removeAttr("disabled");
                            
                            setTimeout(function(){
                                setFooterFreezed(gzGrid);
                            }, 200);

                    }
                });
            }
        });
    }
    
    function getDataRows(){
        var _dataRows =[];
        
        _dataRows.push(
             {text: "Load Date"                                                                     ,width : 200
                     ,onRender: function(d){
                        return app.bs({name: "load_date"          ,type: "input"     ,value: app.svn(d,"load_date").toShortDates()    ,style : "text-align:center;"});
                    }
                 }
                ,{text: "QR Id"                      ,name:"qr_id"                   ,type:"input"      ,width : 100    ,style : "text-align:center;"}
                ,{text: "Load Amount"                                                                   ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"
                    ,onRender: function(d){
                        return app.bs({name: "load_amount"        ,type: "input"     ,value: app.svn(d,"load_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                    }
                }
                ,{text: "Loaded By"                  ,name:"loaded_by"              ,type:"input"       ,width : 150   ,style : "text-align:center;"}
                        
        );
        
        return _dataRows;
    }
    
    function setFooterFreezed(zGridId){
        var _zRows = $(zGridId).find(".zGridPanel .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height() - 20;
        var _zTotal = _tableRight.find(".zTotal");
        _zTotal.css({"top": _zRowsHeight});
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() {
                   _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().top - _zRows.offset().top) });
                   _zTotal.prev().css({"margin-bottom":23 }); 
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
    }
    
    
    $("#btnExportTransations").click(function () {
      $("#gridLoadingTransactions").convertToTable(
        function($table){
            $table.htmlToExcel({
               fileName: "Loads Report"
           });
        });
    });
    
    $("#btnFilterVal").click(function(){ 
        var _dateFrm = $.trim($("#load_date_frm").val());  
        var _dateTo = $.trim($("#load_date_to").val());
        displayLoadingTransactions(_dateFrm,_dateTo,gDateType,gLoaderId);
    }); 

    $("#load_date").on("keyup change",function(){
        if($(this).val() === "") {
            displayLoadingTransactions();
        }
    });

    $("#btnResetVal").click(function(){
        $("#loaderId").val(null).trigger('change');
        $(".date-range").addClass("hide");
        $('[name="filter"]').prop('checked', false);
        displayLoadingTransactions();
    });

    return _pub;
})();                            