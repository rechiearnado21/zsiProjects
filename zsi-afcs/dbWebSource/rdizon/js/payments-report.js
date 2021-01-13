   var payment = (function(){
    var  _pub            = {}
        ,gTotal          = ""
        ,gDate           = ""
        ,gPaymentId      = ""
        ,gPaoId          = null
        ,gDriverId       = null
        ,gRouteId        = null
        ,gVehicleId      = null
        ,gDateType       = ""
        ,gzGrid1         = "#gridTransactions"
        ,gzGrid2         = "#gridPostedTransactions"
        ,gActiveTab      = ""
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Payments Report");
        $(".panel-container").css("min-height", $(window).height() - 190);
        validation();
        displayPostedTransactions();
        gActiveTab = "for-posting";
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        gDate = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
        $('.PAOForRemit').select2({placeholder: "SELECT PAO",allowClear: true});
        $('#vehicleForRemit').select2({placeholder: "SELECT VEHICLE",allowClear: true});
        $('#routeId').select2({placeholder: "SELECT ROUTE",allowClear: true});
        $('#driverId').select2({placeholder: "SELECT DRIVER",allowClear: true});
        $(".paymentTypeId").fillSelect({
            data: [
                 { text: "QR"       , value: "QR"  }
                ,{ text: "CASH"     , value: "CASH"}
                
            ]
            ,onChange : function(){
                gPaymentId = this.val();
                
            }
            ,onComplete     : function(){
                $("option:first-child",this).text("PAYMENT TYPE");
                $("option:first-child",this).val("");
            }
        });
        
        $("#driverId").dataBind({
            sqlCode      : "D1262" 
            ,parameters : {company_id:app.userInfo.company_id}
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info      = d.data[d.index - 1];
                   _driver_id = isUD(_info) ? "" : _info.user_id;
                    gDriverId = _driver_id;
           }
        });
        
        $("#routeId").dataBind({
            sqlCode      : "R1224"
           ,text         : "route_code"
           ,value        : "route_id"
           ,onChange     : function(d){
               var _info     = d.data[d.index - 1]
                   _route_id = isUD(_info) ? "" : _info.route_id;
                    gRouteId = _route_id;
           }
        });
        
        $(".PAOForRemit").dataBind({
            sqlCode      : "D1263" 
            ,parameters : {client_id:app.userInfo.company_id}
           ,text         : "full_name"
           ,value        : "user_id"
           ,onChange     : function(d){
               var _info           = d.data[d.index - 1]
                   _pao_id         = isUD(_info) ? "" : _info.user_id;
                gPaoId = _pao_id;
           }
        });
        
        $("#vehicleForRemit").dataBind({
            sqlCode      : "D1264" 
            ,parameters : {company_id:app.userInfo.company_id}
           ,text         : "vehicle_plate_no"
           ,value        : "vehicle_id"
           ,onChange     : function(d){
               var _info       = d.data[d.index - 1]
                   _vehicle_id = isUD(_info) ? "" : _info.vehicle_id;
                   gVehicleId  = _vehicle_id;
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
                $("#posted_date_from").attr("placeholder",_placeholderFrm);
                $("#posted_date_to").attr("placeholder",_placeholderTo);
                $("#posted_date_from").val("");
                $("#posted_date_to").val("");
                $(".date-range").removeClass("hide");
            }
            
        });
       
    };
    
    function validation(){
        var _dayFrom = $("#posted_date_from");
        var _dayTo   = $("#posted_date_to");
        var _timeFrom = "";
        var _timeTo = "";
        var _error  = $("#ermsgId");
        var _msg = "Value must not be lesser than "
        var _erTypeMsg = "";
        
        $("#posted_date_from,#posted_date_to").on("keyup mouseup",function(){
            var _colName    = $(this)[0].id;
            if(gDateType === "weekly") _erTypeMsg = _msg + "from week value";
            else if(gDateType === "monthly") _erTypeMsg = _msg + "from month value";
            else _erTypeMsg = _msg + "from year value";
            
            _error.text(_erTypeMsg);
            
            if(_colName === "posted_date_from")_timeFrom = _dayFrom.val();
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
    
  
    function displayPostedTransactions(fromDate,toDate,paymentId,routeId,vehicleId,driverId,paoId,dateType){
        zsi.getData({
                 sqlCode    : "P1268" 
                ,parameters : { posted_frm:(fromDate ? fromDate : "")
                                ,posted_to:(toDate ? toDate : "")
                                ,route_id:(routeId ? routeId : "")
                                ,vehicle_id:(vehicleId ? vehicleId : "")
                                ,driver_id:(driverId ? driverId : "")
                                ,date_type:(dateType ? dateType : "")
                                
                    
                            } 
                ,onComplete : function(d) {
                    var _rows= d.rows;
                    var _tot = { reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                    
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=_info.reg_amount; 
                        _tot.stu    +=_info.stu_amount; 
                        _tot.sc     +=_info.sc_amount; 
                        _tot.pwd    +=_info.pwd_amount;
                        _tot.reg_no +=_info.no_reg; 
                        _tot.stu_no +=_info.no_stu; 
                        _tot.sc_no  +=_info.no_sc; 
                        _tot.pwd_no +=_info.no_pwd;
                        _tot.total  +=_info.total_paid_amount;
                    }
                    
                    //create additional row for total
                    var _total = {
                         payment_id         : ""
                        ,payment_date       : ""
                        ,inspector_id       : ""
                        ,route_code         : ""
                        ,from_location      : ""
                        ,to_location        : ""
                        ,no_klm             : "Total Amount"
                        ,no_reg             : _tot.reg_no
                        ,no_stu             : _tot.stu_no
                        ,no_sc              : _tot.sc_no
                        ,no_pwd             : _tot.pwd_no
                        ,reg_amount         : _tot.reg
                        ,stu_amount         : _tot.stu
                        ,sc_amount          : _tot.sc
                        ,pwd_amount         : _tot.pwd
                        ,total_paid_amount  : _tot.total
                        ,post_id            : ""
                        ,qr_id              : ""
                        ,driver             : ""
                        ,pao                : ""
                        ,vehicle_plate_no   : ""
                        ,posted_date        : ""
                        ,company_code       : ""
                        ,created_by         : ""
                    };
                    
                    d.rows.push(_total);
                    $(gzGrid2).dataBind({
                         rows           : _rows
                        ,height         : $(window).height() - 335
                        ,dataRows       : getDataRowsByStatus(2)
                        ,onComplete: function(o){
                            var _this = this;
                            $(".zRow:last-child()").addClass("zTotal");
                            $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");
                            this.find("input").attr("readonly",true);
                            if(o.data.length <= 1)$("#btnExportTransations").attr("disabled",true);
                            else $("#btnExportTransations").removeAttr("disabled");
                            
                            setTimeout(function(){
                                setFooterFreezed(gzGrid2);
                            }, 200)

                    }
                });
            }
        });
    }
    
    function getDataRowsByStatus(statusId){
        //statusId: 1 =  for posting, 2= posted
        var _dataRows =[
             {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
    		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
    		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
    		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
    		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
    		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
    		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
            ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1
                ,onRender: function(d){
                    return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date")    ,style : "text-align:center;"})
                        +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                }
            }
                            
        ];
        
        if(statusId === 2){
            _dataRows.push(                    
                {text: "Posted Date"                                                      ,width : 150          ,groupId : 1
                    ,onRender: function(d){
                        return app.bs({name: "posted_date"          ,type: "input"     ,value: app.svn(d,"posted_date")    ,style : "text-align:center;"});
                    }
                }
            );
        }
        
        _dataRows.push(
             {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "PAO"                       ,name:"pao"                     ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Driver"                    ,name:"driver"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Inspector"                 ,name:"inspector_id"            ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Route"                     ,name:"route_code"              ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "From"                      ,name:"from_location"           ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "To"                        ,name:"to_location"             ,type:"input"       ,width : 200   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Distance"                  ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
            ,{text: "Quantity"                  ,name:"no_reg"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 2}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 2
                ,onRender: function(d){
                    return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount").toMoney()    ,style : "text-align:center;"});
                }
            }
            ,{text: "Quantity"                  ,name:"no_stu"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 3}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 3
                ,onRender: function(d){
                    return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount").toMoney()    ,style : "text-align:center;"    ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 4}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4
                ,onRender: function(d){
                    return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount").toMoney()    ,style : "text-align:center;"      ,width : 60});
                }
            }
            ,{text: "Quantity"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5}
            ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5
                ,onRender: function(d){
                    return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount").toMoney()    ,style : "text-align:center;"  ,width : 60});
                }
            }
            ,{text: "Total Amount"                                                                  ,width : 100   ,style : "text-align:right;padding-right: 0.3rem;"       ,groupId : 6
                ,onRender: function(d){
                    return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount").toMoney()    ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                }
            }
            ,{text: "Payment Type"               ,name:"payment_type"           ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 7}
                        
        );
        
        return _dataRows;
    }
    
    function setFooterFreezed(zGridId){
        var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height() - 40;
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
    
    
    $("#btnExportTransations").click(function () {
      $("#gridPostedTransactions").convertToTable(
        function($table){
            console.log("table",$table);
            $table.find("th").closest("tr").remove();
            $("#ExcelgridPostedTransactions tbody").before('<thead><tr><th colspan="10"></th><th colspan="2">Regular</th><th colspan="2">Student</th><th colspan="2">Senior</th><th colspan="2">PWD</th><th ></th><th></th></tr>'
                        + '<tr><th>Payment Date</th><th>Posted Date</th><th>Vehicle</th><th>PAO</th><th>Driver</th><th>Inspector</th><th>Route</th><th>From</th><th>To</th><th>Distance</th><th>Qty</th><th>Total</th><th>Qty</th>'
                        + '<th>Total</th><th>Qty</th><th>Total</th><th>Qty</th><th>Total</th><th>Total Amount</th><th>Payment Type</th></tr></thead>'
            );
            $table.htmlToExcel({
               fileName: "Payments Report"
           });
        });
    });
    
    
    //posted tab
    $("#btnFilterVal").click(function(){ 
        var _from = $.trim($("#posted_date_from").val()); 
        var _to = $.trim($("#posted_date_to").val()); 
        displayPostedTransactions(_from,_to,gPaymentId,gRouteId,gVehicleId,gDriverId,gPaoId,gDateType);
        setTimeout(function(){
            setFooterFreezed(gzGrid2);
        }, 1000);
    }); 

    $("#btnResetVal").click(function(){
        $("#paymentTypeId2").val("");
        $("#routeId").val(null).trigger('change');
        $("#vehicleForRemit").val(null).trigger('change');
        $("#driverId").val(null).trigger('change');
        $("#PAOForRemitt").val(null).trigger('change');
        $(".date-range").addClass("hide");
        $('[name="filter"]').prop('checked', false);
        displayPostedTransactions();
    });
    
    
    return _pub;
})();                                                                           