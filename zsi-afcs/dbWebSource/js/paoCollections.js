   var collections = (function(){
    var  _pub            = {}
        ,gTotal          = ""
        ,gDate           = ""
        ,gPaoId1         = null
        ,gPaoId2         = null
        ,gPaymentId      = ""
        ,gzGrid1         = "#gridCollectionsForRemit"
        ,gzGrid2         = "#gridPostedTransactions"
        
    ;
    
    zsi.ready = function(){
        $(".page-title").html("PAO Collections");
        $(".panel-container").css("min-height", $(window).height() - 190);
        displayCollectionsForRemit();
        displayRemittedCollections();
        validation();
        $('.PAOForRemitted').select2({placeholder: "SELECT PAO",allowClear: true});
        $('.PAOForRemit').select2({placeholder: "SELECT PAO",allowClear: true});
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        gDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
        $(".PAOForRemit").dataBind({
            sqlCode      : "D1263" //dd_pao_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _pao_id         = isUD(_info) ? "" : _info.user_id;
                gPaoId1 = _pao_id;
           }
        });
        $(".PAOForRemitted").dataBind({
            sqlCode      : "D1263" //dd_pao_sel
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _pao_id         = isUD(_info) ? "" : _info.user_id;
                gPaoId2 = _pao_id;
           }
        });
        
        $(".paymentTypeId").fillSelect({
            data: [
                 { text: "FARE"     ,value: "FARE"}
                ,{ text: "LOAD"     ,value: "LOAD"}
                
            ]
            ,onChange : function(){
                gPaymentId = this.val();
                
            }
            ,onComplete     : function(){
                $("option:first-child",this).text("COLLECTION TYPE");
                $("option:first-child",this).val("");
            }
        });
        
        
    };
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
        switch(target){
            case "#nav-posted":
                setFooterFreezed(gzGrid2);
                break;
            case "#nav-forPosting":
                setFooterFreezed(gzGrid1);
                break;
          default:break;
      }
    });
    
    function validation(){
        var _$navTab = $("#nav-tabContent");
        var _dayFrom = _$navTab.find("#remitted_from_date_id");
        var _dayTo   = _$navTab.find("#remitted_to_date_id");
        var _dateFrm = _$navTab.find("#date_frm");
        var _dateTo  = _$navTab.find("#date_to");
        var _timeFrom1 = "";
        var _timeTo1 = "";
        var _timeFrom2 = "";
        var _timeTo2 = "";
        var _error1  = _$navTab.find("#ermsgId1");
        var _error2  = _$navTab.find("#ermsgId2");
        
        _$navTab.find("#remitted_from_date_id,#remitted_to_date_id,#date_frm,#date_to").on("keyup change",function(){
            var _colName    = $(this)[0].id;
            if(_colName === "remitted_from_date_id")_timeFrom2 = new Date(_dayFrom.val()).getTime();
            else if(_colName === "remitted_to_date_id")_timeTo2 = new Date(_dayTo.val()).getTime();
            else if(_colName === "date_frm")_timeFrom1 = new Date(_dateFrm.val()).getTime();
            else _timeTo1 = new Date(_dateTo.val()).getTime();
            
            if(_timeFrom2 > _timeTo2){
                _error2.removeClass("hide");
                _dayTo.css("border-color","red");
                $("#btnFilterVal2").attr("disabled",true);
            }else{
                _error2.addClass("hide");
                _dayTo.css("border-color","green");
                $("#btnFilterVal2").removeAttr("disabled");
            }
            
            if(_timeFrom1 > _timeTo1){
                _error1.removeClass("hide");
                _dateTo.css("border-color","red");
                $("#btnFilterVal1").attr("disabled",true);
            }else{
                _error1.addClass("hide");
                _dateTo.css("border-color","green");
                $("#btnFilterVal1").removeAttr("disabled");
            }
        });
        
    }
    
    function displayCollectionsForRemit(pao,dateFrm,dateTo,paymentId){
        zsi.getData({
                 sqlCode    : "P1240" //pao_collections_for_remit
                ,parameters : {pao_id:(pao ? pao : ""),fdate:(dateFrm ? dateFrm : ""),tdate:(dateTo ? dateTo : ""),collection_type:(paymentId ? paymentId : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = {total:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.total  +=_info.amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             pao             : "Total Amount"
                            ,amount          : _tot.total
                           
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid1).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 335
                        ,dataRows       : getDataRowsByStatus(1)
                        ,onComplete: function(o){
                            var _this = this;
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").find('[name="pao"]').css("text-align","right");
                            if(o.data.length <= 1)$("#btnSaveCollections").attr("disabled",true);
                            else $("#btnSaveCollections").removeAttr("disabled");
                            var _$dateFr = _this.find(".zRow:first-child()").find("[name='tdate']").val();
                            var _$dateTo = _this.find(".zRow:nth-last-child(2)").find("[name='tdate']").val();
                            var _dateFr = isUD(_$dateFr) ? "" : _$dateFr.toShortDates();
                            var _dateTo = isUD(_$dateTo) ? "" : _$dateTo.toShortDates();
                            $("#nav-tabContent").find("#date_frm").datepicker("setDate",_dateFr);
                            $("#nav-tabContent").find("#date_to").datepicker("setDate",_dateTo);
                    }
                });
            }
        });
    }
    
    function displayRemittedCollections(pao,remitFrom,remitTo,paymentId){
        zsi.getData({
                 sqlCode    : "P1244" //pao_collections_remitted
                ,parameters : {pao_id:(pao ? pao : ""),tdate:(remitFrom ? remitFrom : ""),remit_date:(remitTo ? remitTo : ""),collection_type:(paymentId ? paymentId : "")}
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = { reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.total  +=_info.amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                             pao             : "Total Amount"
                            ,amount          : _tot.total
                           
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid2).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 335
                        ,dataRows       : getDataRowsByStatus(2)
                        ,onComplete: function(o){
                            var _this = this;
                            this.find("input").attr("readonly",true);
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            $(".zRow:last-child()").find('[name="pao"]').css("text-align","right");
                            if(o.data.length <= 1)$("#btnExcelCollections").attr("disabled",true);
                            else $("#btnExcelCollections").removeAttr("disabled");
                            var _$dateFr = _this.find(".zRow:first-child()").find("[name='remit_date']").val();
                            var _$dateTo = _this.find(".zRow:nth-last-child(2)").find("[name='remit_date']").val();
                            var _dateFr = isUD(_$dateFr) ? "" : _$dateFr.toShortDates();
                            var _dateTo = isUD(_$dateTo) ? "" : _$dateTo.toShortDates();
                            $("#nav-tabContent").find("#remitted_from_date_id").datepicker("setDate",_dateFr);
                            $("#nav-tabContent").find("#remitted_to_date_id").datepicker("setDate",_dateTo);
                            setFooterFreezed(gzGrid1);
                    }
                });
            }
        });
    }
    
    function getDataRowsByStatus(id){
        //statusId: 1 =  for posting, 2= posted
        var _dataRows =[
            {text: "Date"                                                                           ,width : 180     ,style : "text-align:center;"
                 ,onRender: function(d){
                        return app.bs({name: "tdate"          ,type: "input"     ,value: app.svn(d,"tdate")         ,style : "text-align:center;"})
                            +  app.bs({name: "id"             ,type: "hidden"    ,value: app.svn(d,"id")});
                    }
             }];
        if(id == 2){
            _dataRows.push(
                 {text: "Remitted Date"         ,name: "remit_date"             ,type: "input"      ,width : 180   ,style : "text-align:center;"}         
            )}
        
        _dataRows.push(
             {text: "PAO"                       ,name:"pao"                     ,type:"input"       ,width : 200   ,style : "text-align:left;padding-right: 0.3rem;"}
            ,{text: "Amount"                                                                        ,width : 130   ,style : "text-align:right;padding-right: 0.3rem;"
                ,onRender: function(d){
                    return app.bs({name: "amount"          ,type: "input"     ,value: app.svn(d,"amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;"});
                }
            }
            ,{text: "Collection Type"           ,name:"collection_type"         ,type:"input"       ,width : 130   ,style : "text-align:center;"}
                        
        );
        
        return _dataRows;
    }
    
    function setFooterFreezed(zGridId){
        var _zRows = $(zGridId).find(".zGridPanel .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height() - 20;
        var _zTotal = _tableRight.find(".zTotal");
        _zTotal.css({"top": _zRowsHeight}); 
        _zTotal.prev().css({"margin-bottom":23 });
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() {
                   _zTotal.css({"top":_zRowsHeight - ( _tableRight.offset().top - _zRows.offset().top) });
                });
            }else{
                _zTotal.css({"position":"unset"});
                _zTotal.prev().css({"margin-bottom":0 });
            }
        }
    }
    
    $("#btnSaveCollections").click(function () {
      $("#gridCollectionsForRemit").jsonSubmit({
           procedure: "pao_collection_posting_upd"
          ,notIncludes : ["tdate","pao","amount"]
          ,onComplete: function (data) {
              displayCollectionsForRemit();
              displayRemittedCollections();
              if(data.isSuccess===true) zsi.form.showAlert("alert");
              $("#gridCollectionsForRemit").convertToTable(
                function($table){
                    $("#ExcelgridCollectionsForRemit").find("th").remove();
                    setTimeout(function(){
                        var _confirmation = confirm("Do you want to print this data?");
                        if (_confirmation === true) {
                            var mywindow = window.open("");
                            mywindow.document.write('<html><head><style>table,th,td{border: 1px solid black;text-align:center;</style></head><body>');
                            mywindow.document.write('<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>');
                            mywindow.document.write('<div style="text-align:center;"><h4>'+gDate+'</h4></div>');
                            mywindow.document.write('<div style="align-items:center;display: flex;justify-content: center;"><table style="border-collapse: collapse;">');
                            mywindow.document.write('<thead><tr><td>Date</td><td>PAO</td><td>Amount</td><td>Collection Type</td></thead>');
                            mywindow.document.write(document.getElementById("ExcelgridCollectionsForRemit").innerHTML);
                            mywindow.document.write('</table></div></body></html>');
                            mywindow.document.close();
                            mywindow.focus();
                            mywindow.print();
                            mywindow.close();
                        }
                        return true;
                    }, 1000);
                });
            }
        });
    });
    
    $("#btnExcelCollections").click(function () {
      $("#gridPostedTransactions").convertToTable(
        function($table){
            $table.htmlToExcel({
               fileName: "PAO Collections"
           });
        });
    });
    
    /*$("#btnSaveCollections").click(function () {
        console.log("asdasd")
          $("#gridCollectionsForRemit").convertToTable(
            function($table){
                console.log("$table",$table);
                $("#ExcelgridCollectionsForRemit").find("th").remove();
                
                    var w = window.open();
                    var html = ('<html><head><style>table,th,td{border: 1px solid black;text-align:center;</style></head><body>'
                             +  '<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>'
                             +  '<div style="text-align:center;"><h4>'+gDate+'</h4></div>'
                             +  '<div style="align-items:center;display: flex;justify-content: center;"><table style="border-collapse: collapse;">'
                             +  $("#ExcelgridCollectionsForRemit").html()
                             +  '</table></div></body></html>').html();
                
                    $(w.document.body).html(html);
                
                
                
                var mywindow = window.open('', 'PRINT');
                mywindow.document.write('<html><head><style>table,th,td{border: 1px solid black;text-align:center;</style></head><body>');
                mywindow.document.write('<div style="text-align:center;"><h1>LAMADO TRANSPORATION</h4></div>');
                mywindow.document.write('<div style="text-align:center;"><h4>'+gDate+'</h4></div>');
                mywindow.document.write('<div style="align-items:center;display: flex;justify-content: center;"><table style="border-collapse: collapse;">');
                mywindow.document.write('<thead><tr><td>Date</td><td>PAO</td><td>Company Code</td><td>Collection Type</td><td>Amount</td></thead>');
                mywindow.document.write(document.getElementById("ExcelgridCollectionsForRemit").innerHTML);
                mywindow.document.write('</table></div></body></html>');
                mywindow.document.close();
                mywindow.focus();
                mywindow.print();
                mywindow.close();
                return true;
            });
    });*/
    
    //for remit tab
    $("#btnFilterVal1").click(function(){
        var _dateFrm = $.trim($("#date_frm").val()); 
        var _dateTo = $.trim($("#date_to").val());
        displayCollectionsForRemit(gPaoId1,_dateFrm,_dateTo,gPaymentId);
        setTimeout(function(){
            setFooterFreezed(gzGrid1);
        }, 1000);
    }); 

    $("#btnResetVal1").click(function(){
        $(".paymentTypeId").val("");
        $(".PAOForRemit").val(null).trigger('change');
        $("#nav-tabContent").find("#date_id").datepicker({todayHighlight:true}).datepicker("setDate","0");
        displayCollectionsForRemit();
    });
    
    //remitted tab
    $("#btnFilterVal2").click(function(){
        var _from = $.trim($("#remitted_from_date_id").val()); 
        var _to = $.trim($("#remitted_to_date_id").val()); 
        displayRemittedCollections(gPaoId2,_from,_to,gPaymentId);
        setTimeout(function(){
            setFooterFreezed(gzGrid2);
        }, 1000);
    }); 

    $("#btnResetVal2").click(function(){
        $(".paymentTypeId").val("");
        $(".PAOForRemit").val(null).trigger('change');
        displayRemittedCollections();
    });
    
    
    return _pub;
})();                                                               