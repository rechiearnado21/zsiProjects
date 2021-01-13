var fc = (function(){
    var  _pub                   = {}
        ,gTotal                 = ""  
        ,gzGrid1                = "#gridTransactions"
        ,gzGrid2                = "#gridPostedTransactions"  
        ,gzGridForPostDtl       = "#gridForPostingSummary"
        ,gzGridPostDtl          = "#gridPostingSummary"
        ,gSubTabName            = ""
        ,gTabName               = "" 
        ,gUser                  =  app.userInfo
        ,gSqlCode               = "" 
        ,gRecentSumm            = 0
        ,gHistorySumm           = 0
        ,gVhId                  = null
        ,gDriver                = null
        ,gPao                   = null 
        ,gClickedRecTab         = false
        ,gClickedHisTab         = false
        ,gData                  = ""
        ,gSDate                 = ""
        ,gEDate                 = ""
        ,gCSDate                 = ""
        ,gCEDate                 = ""
    ;
    
    zsi.ready = function(){ 
        $(".page-title").html("Fare Collections");
        $(".panel-container").css("min-height", $(window).height() - 200); 
        //$("select").select2({placeholder: "",allowClear: true});
        dateValidation();
        displayForPosting();
        displayPostedTransactions(); 
        displayDailyFareCollection();
        getFilters();
        fillDropdowns();
        
    }; 
    
    gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text());  
    gTabName = $.trim($(".main-nav-tabs").find(".nav-link.active").text()); 
    $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gTabName = $.trim($(e.target).text()); 
        $(".sub-nav-tabs").find(".nav-link").removeClass("active");
        $(".sub-nav-tabs").find(".nav-item:first-child()").find(".nav-link").addClass("active");  
        if(gTabName === "Recent Collection"){ 
            gVhId   = null;
            gDriver = null;
            gPao    = null;
            gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text()); 
            $("#nav-recentCollection").find("select,input").val("");  
             dateValidation();
            displayDailyFareCollection(); 
        } 
        if(gTabName === "History Collection"){
            gVhId   = null;
            gDriver = null;
            gPao    = null;
            gSubTabName = $.trim($(".sub-nav-tabs").find(".nav-link.active").text()); 
            $("#nav-recentCollection").find("select,input").val("");  
             dateValidation();
            displayDailyFareCollection();   
        }    
    }); 
    $(".sub-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());   
        $("#nav-recentCollection").find("select,input").val("");  
        dateValidation();
        fillDropdowns(gData);
        displayDailyFareCollection(); 
        
    }); 
    
    _pub.viewDetails                =  function(){ 
        var g$mdl = $("#modalDetails");
        g$mdl.find(".modal-title").text("Details") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
    };
    _pub.showModalForPostingSummary =  function(vehicle_id, payment_date, vehicle_plate_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalForPostingSummary');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Vehicle Plate No.:" + vehicle_plate_no);
        //_$mdl.find(".modal-content").height(_tabH-5);
    
    	$("#nav-forPosting").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-forPosting');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open");
   	 	$('body').css("padding-right","");     
         
        displayForPostingSummary(vehicle_id,payment_date);
    };
    _pub.showModalPostedSummary     =  function(post_id, post_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalPostedSummary');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Post Id :" + post_no);
        _$mdl.find(".modal-content").height(_tabH-5);
   
    	$("#nav-posted").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-posted');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open");
   	 	$('body').css("padding-right","");     
         
        displayPostedSummary(post_id);
    };
    _pub.showModalPostedSummaryDtl  =  function(post_id, vehicle_id, vehicle_plate_no){
        var _tabH = $("#nav-tabContent").height();
        var _$mdl = $('#modalPostedSummaryDtl');
        _$mdl.modal('show');
        _$mdl.find("#modalTitle").text("Post Id :" + post_id + "- Vehicle Plate No. :" + vehicle_plate_no);
        _$mdl.find(".modal-content").height(_tabH-5);
        _$mdl.css("padding-right", 0);
        
    	$("#nav-posted").addClass("after_modal_appended");
    
    	//appending modal background inside the blue div
    	$('.modal-backdrop').appendTo('#nav-posted');   
    
    	//remove the padding right and modal-open class from the body tag which bootstrap adds when a modal is shown
    
    	$('body').removeClass("modal-open");
   	 	$('body').css("padding-right","");     
         
        displayPostedSummaryDtl(post_id, vehicle_id);
    }; 
    _pub.displayColDtls             =  function(vehicle_id,driver_id,paoId){
        if(gTabName === "Recent Collection") gClickedRecTab = true;
        if(gTabName === "History Collection") gClickedHisTab = true;
        gVhId   = vehicle_id;
        gDriver = driver_id;
        gPao    = paoId;
        $("#colDtlsTab").click();  
    };
    
    function getFilters(){ 
        var  _$filter           = $("#nav-recentCollection")
            ,_clientId          = app.userInfo.company_id 
            ,_vehicleId         = _$filter.find('#dailyFare_vehicle').val() 
            ,_driverId          = _$filter.find('#dailyFare_driver').val()
            ,_paoId             = _$filter.find('#dailyFare_pao').val()
            ,_paorcnt           = _$filter.find('[name="dailyFare_pao"]').val()
            ,_startDate         = _$filter.find('#trip_startDate').val()
            ,_endDate           = _$filter.find("#trip_endDate").val()  
            ,_vehicleRecent     = _$filter.find("#vehicleRecent").val()
            ,_vehicleHistory    = _$filter.find("#vhistorySumm").val()
            ,_driverHistory     = _$filter.find("#driverHistorySumm").val()
            ,_historyStart      = _$filter.find("#historyStart").val()
            ,_historyEnd        = _$filter.find("#historyEnd").val() 
        ; 
        return {
             client_id      : _clientId 
            ,vehicle_id     : _vehicleId   
            ,driver_id      : _driverId
            ,driver_idSumm  : _driverHistory
            ,pao_id         : _paoId
            ,paoRecent      : _paorcnt
            ,start_date     : _startDate 
            ,end_date       : _endDate
            ,vehicle_recent : _vehicleRecent
            ,vehicle_history: _vehicleHistory
            ,history_start  : _historyStart
            ,history_end    : _historyEnd
        };
    }   
    
    function fillDropdowns(data){  
        if(data){ 
            var _o = getFilters()
                ,_ddDriver = []
                ,_ddPAO    = [];
                
            for(var i=0;i<data.length;i++){
                _ddDriver.push({driver_name:data[i].driver_name,driver_id:data[i].driver_id});
                _ddPAO.push({pao_name:data[i].pao_name,pao_id:data[i].pao_id});
            }    
            _ddDriver.sort((a, b) => (a.driver_name > b.driver_name) ? 1 : -1);
            _ddPAO.sort((a, b) => (a.pao_name > b.pao_name) ? 1 : -1);
            
            $("select[id='dailyFare_vehicle']").fillSelect({	                
                 data   : data.getUniqueRows(["vehicle_id"])	                   
                ,text   : "vehicle_plate_no"
                ,value  : "vehicle_id"
                ,selectedValue : gVhId
                ,onChange : function(){
                    gVhId = $(this).val();
                    if(gTabName === "Recent Collection") gClickedRecTab = true;
                    if(gTabName === "History Collection") gClickedHisTab = true;
                }
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            });
            $("select[id='vehicleRecent']").fillSelect({	                
                 data   : data.getUniqueRows(["vehicle_id"])	                   
                ,text   : "vehicle_plate_no"
                ,value  : "vehicle_id"
                ,selectedValue: _o.vehicle_recent
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            });  
            $("select[id='vhistorySumm']").fillSelect({	                
                 data   : data.getUniqueRows(["vehicle_id"])	                   
                ,text   : "vehicle_plate_no"
                ,value  : "vehicle_id" 
                ,selectedValue: _o.vehicle_history
               ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }  
            }); 
             $("select[id='driverHistorySumm']").fillSelect({	                
                 data   : _ddDriver.getUniqueRows(["driver_id"])	                   
                ,text   : "driver_name"
                ,value  : "driver_id"
                ,selectedValue: _o._driverHistory
               ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }  
            });  
            
            $("select[id='dailyFare_driver']").fillSelect({
                 data   : _ddDriver.getUniqueRows(["driver_id"])
                ,text   : "driver_name"
                ,value  : "driver_id"
                ,selectedValue : gDriver 
                ,onChange : function(){
                   gDriver = $(this).val();
                    if(gTabName === "Recent Collection") gClickedRecTab = true;
                    if(gTabName === "History Collection") gClickedHisTab = true;
                }
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            }); 
            $("select[id='dailyFare_pao']").fillSelect({	                
                 data   : _ddPAO.getUniqueRows(["pao_id"])	                   
                ,text   : "pao_name"	                    
                ,value  : "pao_id"	                    
                ,selectedValue : gPao 
                ,onChange : function(){
                   gPao = $(this).val();
                    if(gTabName === "Recent Collection") gClickedRecTab = true;
                    if(gTabName === "History Collection") gClickedHisTab = true;
                }
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            });
            $("[name='dailyFare_pao']").fillSelect({	                
                 data   : _ddPAO.getUniqueRows(["pao_id"])	                   
                ,text   : "pao_name"	                    
                ,value  : "pao_id"	                    
                ,selectedValue : gPao 
                ,onChange : function(){
                   gPao = $(this).val();
                }
                ,onComplete : function(d){  
                    if($(this).find("option:last-child()").val()==="undefined")$(this).find("option:last-child()").remove() ;
                }
            });
        }
           
    }  
    function dateValidation(){
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var _date1 = (d.getMonth() + 1) + "/01/" +    d.getFullYear();
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear(); 
        $("#trip_startDate,#historyStart").datepicker({
             autoclose : true 
            ,endDate: yesterday
            ,todayHighlight: false 
        }).datepicker("setDate", _date1).on("changeDate",function(e){
            $("#trip_endDate,#historyEnd").datepicker({endDate: yesterday,autoclose: true}).datepicker("setStartDate",e.date);
            $("#trip_endDate,#historyEnd").datepicker().datepicker("setDate",yesterday);
        }); 
         $("#trip_endDate,#historyEnd").datepicker({
             autoclose : true 
            ,endDate: yesterday
            ,todayHighlight: false 
        }).datepicker("setDate", yesterday);
 
    } 
    function displayDailyFareCollection(){ 
         var _ctr = 1; 
        var _sqlCode  = "V1349" 
            ,_o        = getFilters()
            ,_params = {
                 client_id   : _o.client_id 
                ,vehicle_id  : gVhId?gVhId:  _o.vehicle_id
                ,driver_id   : gDriver?gDriver:  _o.driver_id 
                ,pao_id      : gPao?gPao:  _o.pao_id 
                ,pdate_from  : null 
                ,pdate_to    : null
            }
            ,_paramSumm = {
                 vehicle_id  : _o.vehicle_recent
                ,client_id   : _o.client_id
                ,driver_id   : _o.driver_idSumm
                ,pdate_from  : gSDate?gSDate:"" 
                ,pdate_to    : gEDate?gEDate  :""
            };
            switch(gTabName){  
                case "Recent Collection":  
                    $("#hideBTN").show();
                    $("#paoDiv").hide(); 
                    switch (gSubTabName) { 
                        case "Collection Summary":   
                            _sqlCode = "P1443";  
                            _params = _paramSumm; 
                            delete _paramSumm.pdate_from;
                            delete _paramSumm.pdate_to;   
                            delete _paramSumm.driver_id; 
                            $("#dd_Div,#dateDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide(); 
                            $("#vehicleRecentSummDiv,#gridDailyFareCollections").show();  
                            break;
                        case "Collection by Trip":   
                            _sqlCode = "V1349";  
                            $("#hideFromDate,#hideToDate,#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide();  
                            $("#dd_Div,#gridDailyFareCollections").show(); 
                            break;
                        case "Collection Details":
                            if(gClickedRecTab === false){
                                $("#dd_Div").show();
                                $("#hideFromDate,#hideToDate,#vehicleRecentSummDiv,#vehicleHistorySummDiv,#gridDailyFareCollections,.btnSaveSumm").hide();
                                 return ;
                            } else{
                                 _sqlCode = "P1338";   
                                _params.pao_id =_o.paoRecent; 
                                delete _params.pdate_from;
                                delete _params.pdate_to;   
                                $("#dd_Div,#gridDailyFareCollections").show(); 
                                $("#hideFromDate,#hideToDate,#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide();
                            } 
                        break; 
                    }
                break;
                case "History Collection":  
                    $("#hideBTN").hide(); 
                    $("#paoDiv").show(); 
                    switch (gSubTabName) {  
                        case "Collection Summary":   
                            _sqlCode = "P1442";    
                            _params = _paramSumm;
                            _paramSumm.vehicle_id = _o.vehicle_history;
                            $("#dd_Div,#dateDiv,#vehicleRecentSummDiv").hide(); 
                            $("#vehicleHistorySummDiv,#gridDailyFareCollections,.btnSaveSumm").show();  
                            
                            break;
                        case "Collection by Trip": 
                            _sqlCode = "V1349"; 
                            _params.pdate_from = _o.start_date; 
                            _params.pdate_to =_o.end_date; 
                            $("#dd_Div,#dateDiv,#hideFromDate,#hideToDate,#divGridFareCol,#gridDailyFareCollections").show();
                            $("#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide(); 
                            break;
                        case "Collection Details":
                            if(gClickedHisTab === false){
                                $("#dd_Div,#dateDiv,#hideFromDate,#hideToDate").show();
                                $("#vehicleRecentSummDiv,#vehicleHistorySummDiv,#gridDailyFareCollections,.btnSaveSumm").hide(); 
                                return ;
                            }else{ 
                                _sqlCode = "P1337";
                                _params.pdate_from =_o.start_date; 
                                _params.pdate_to =_o.end_date;  
                                $("#dd_Div,#dateDiv,#hideFromDate,#hideToDate,#gridDailyFareCollections").show();
                                $("#vehicleRecentSummDiv,#vehicleHistorySummDiv,.btnSaveSumm").hide(); 
                            }
                        break; 
                    }
                break;
            }  
             
            var _getDataRows = function(){  
                var _dataRows =[];  
                var _todate = new Date().toLocaleString().replace(",","").replace(/:.. /," ");  
                if(gSubTabName === "Collection Summary" && _sqlCode === "P1443"){ 
                        _dataRows.push(
                           {text:"No."                                       ,width:60         ,style:"text-align:center"
                                ,onRender : function(d){ 
                                        return  _ctr++
                                               + app.bs({name:"payment_summ_id"                 ,type:"hidden"      ,value: app.svn(d,"payment_summ_id")})
                                               + app.bs({name:"payment_date"                    ,type:"hidden"      ,value: _todate.toShortDate()})
                                               + app.bs({name:"is_edited"                       ,type:"hidden"      ,value: app.svn(d,"is_edited")});
                                        
                                }
                            }
                            ,{text: "Vehicle"                    ,width : 100    ,style : "text-align:center;"  ,sortColNo: 7 
                                , onRender      : function(d) {  
                                              return   "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='fc.displayColDtls(\""+ app.svn (d,"vehicle_id") +"\",\""+ app.svn (d,"driver_id") +"\",\""+ app.svn (d,"pao_id") +"\");'>" + app.svn (d,"vehicle_plate_no") + "</a>"
                                                + app.bs({name:"vehicle_plate_no"              ,value: app.svn(d,"vehicle_plate_no")})
                                                + app.bs({name:"vehicle_id"                    ,type:"hidden"       ,value: app.svn(d,"vehicle_id")});
                                }
                            }
                            ,{text: "Driver"                                    ,width : 180            ,style : "text-align:left;"  ,sortColNo: 9
                                ,onRender: function(d){
                                    return app.bs({name:"driver_name"           ,value: app.svn(d,"driver_name")})
                                         + app.bs({name:"driver_id"             ,type:"hidden"          ,value: app.svn(d,"driver_id")});
                                } 
                            } 
                            ,{text: "PAO"                                       ,width : 180            ,style : "text-align:left;" ,sortColNo: 11 
                                 ,onRender: function(d){
                                    return  app.bs({name:"pao_name"             ,value: app.svn(d,"pao_name")})
                                         + app.bs({name:"pao_id"                ,type:"hidden"          ,value: app.svn(d,"pao_id")})
                                    ;
                                } 
                            }
                            ,{text: "QR Amount"                                 ,width : 100        ,style : "text-align:right;"     ,sortColNo: 2 
                                ,onRender: function(d){
                                    return app.svn(d,"qr_sales") ? app.svn(d,"qr_sales").toMoney() : 0.00 
                                       +   app.bs({name: "qr_amt"               ,type: "hidden"          ,value: app.svn(d,"qr_sales") ? app.svn(d,"qr_sales").toMoney() : 0.00 });
                                    
                                } 
                            }
                            ,{text: "POS Amount"                                ,width : 100      ,style : "text-align:right;"       ,sortColNo: 1 
                                ,onRender: function(d){ 
                                    return app.bs({name: "pos_cash_amt"         ,type: "input"          ,value: app.svn(d,"cash_sales") ? app.svn(d,"cash_sales").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"});
                                } 
                            }
                            ,{text: "Shortage"                                 ,width : 100   ,style : "text-align:right;"   ,sortColNo: 4 
                                ,onRender: function(d){
                                    return app.bs({name: "shortage_amt"         ,type: "input"          ,value: app.svn(d,"shortage_amt") ? app.svn(d,"shortage_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                } 
                            } 
                            ,{text: "Excess"                                    ,width : 100     ,style : "text-align:right;"  ,sortColNo: 3 
                                ,onRender: function(d){
                                    return app.bs({name: "excess_amt"           ,type: "input"          ,value: app.svn(d,"excess_amt") ? app.svn(d,"excess_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" })
                                        +  app.bs({name: "dummy"                ,type: "hidden"         ,value: app.svn(d,"total_sales") ? app.svn(d,"total_sales").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                } 
                            }                             
                             
                            ,{text: "Total Collections"                ,width : 120    ,style : "text-align:right;"  ,sortColNo: 6
                                ,onRender: function(d){
                                    return  app.bs({name: "total_collection_amt"          ,value: app.svn(d,"total_sales").toCommaSeparatedDecimal()         ,style : "text-align:right;padding-right: 0.3rem;"});
                                    
                                } 
                            } 
                            
                        );  
                }
                if(gSubTabName === "Collection Summary" && _sqlCode === "P1442"){  
                        _dataRows.push(
                             {text:"No."                                       ,width:60         ,style:"text-align:center"
                                ,onRender : function(d){
                                        return  _ctr++
                                               + app.bs({name:"payment_summ_id"                 ,type:"hidden"      ,value: app.svn(d,"payment_summ_id")})
                                               + app.bs({name:"payment_date"                    ,type:"hidden"      ,value: app.svn(d,"payment_date").toShortDate()})
                                               + app.bs({name:"is_edited"                       ,type:"hidden"      ,value: app.svn(d,"is_edited")});
                                        
                                }
                             }
                            ,{text: "Payment Date"              ,width : 100       ,sortColNo: 1 
                                ,onRender: function(d){
                                    return  app.svn(d,"payment_date").toShortDate();
                                }
                            }
                            ,{text: "Vehicle"                    ,width : 100    ,style : "text-align:center;"  ,sortColNo: 2
                                , onRender      : function(d) {  
                                              return   "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='fc.displayColDtls(\""+ app.svn (d,"vehicle_id") +"\",\""+ app.svn (d,"driver_id") +"\",\""+ app.svn (d,"pao_id") +"\");'>" + app.svn (d,"vehicle_plate_no") + "</a>"
                                                + app.bs({name:"vehicle_plate_no"              ,type:"input"       ,value: app.svn(d,"vehicle_plate_no")})
                                                + app.bs({name:"vehicle_id"                    ,type:"hidden"       ,value: app.svn(d,"vehicle_id")});
                                }
                            }
                            ,{text: "Driver"                                    ,width : 180            ,style : "text-align:left;"  ,sortColNo: 4
                                ,onRender: function(d){
                                    return app.bs({name:"driver_name"                        ,value: app.svn(d,"driver_name")})
                                            
                                         + app.bs({name:"driver_id"             ,type:"hidden"          ,value: app.svn(d,"driver_id")});
                                } 
                            } 
                            ,{text: "PAO"                                       ,width : 180            ,style : "text-align:left;" ,sortColNo: 5 
                                 ,onRender: function(d){
                                    return   app.bs({name:"pao_name"                         ,value: app.svn(d,"pao_name")})
                                         + app.bs({name:"pao_id"                ,type:"hidden"          ,value: app.svn(d,"pao_id")})
                                    ;
                                } 
                            }
                            ,{text: "QR Amount"                                 ,width : 100        ,style : "text-align:right;"     ,sortColNo: 9 
                                ,onRender: function(d){
                                    return app.svn(d,"qr_amt") ? app.svn(d,"qr_amt").toMoney() : 0.00  
                                    +     app.bs({name: "qr_amt"               ,type: "hidden"          ,value: app.svn(d,"qr_amt") ? app.svn(d,"qr_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                } 
                            }
                            ,{text: "POS Amount"                                ,width : 100      ,style : "text-align:right;"       ,sortColNo: 1 
                                ,onRender: function(d){ 
                                    return app.bs({name: "pos_cash_amt"         ,value: app.svn(d,"pos_cash_amt") ? app.svn(d,"pos_cash_amt").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"});
                                } 
                            } 
                             ,{text: "Shortage"                          ,type:"input"           ,width : 100   ,style : "text-align:right;"   ,sortColNo: 11 
                                ,onRender: function(d){
                                    return app.bs({name: "shortage_amt"         ,type: "input"          ,value: app.svn(d,"shortage_amt") ? app.svn(d,"shortage_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                } 
                            }                            
                            ,{text: "Excess"                             ,type:"input"           ,width : 100     ,style : "text-align:right;"  ,sortColNo: 12
                                ,onRender: function(d){
                                    return app.bs({name: "excess_amt"           ,type: "input"          ,value: app.svn(d,"excess_amt") ? app.svn(d,"excess_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" })
                                        +  app.bs({name: "dummy"                ,type: "hidden"         ,value: app.svn(d,"total_collection_amt") ? app.svn(d,"total_collection_amt").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                                } 
                            }  
                            ,{text: "Total Collections"                ,width : 120    ,style : "text-align:right;"  ,sortColNo: 13
                                ,onRender: function(d){
                                    return  app.bs({name: "total_collection_amt"          ,value: app.svn(d,"total_collection_amt").toCommaSeparatedDecimal()         ,style : "text-align:right;padding-right: 0.3rem;"});
                                } 
                            }  
                        );  
                }
                if(gSubTabName === "Collection by Trip"){ 
                    _dataRows.push(
                         {text: "Trip No"                   ,name:"trip_no"                 ,type:"input"       ,width : 80     ,style : "text-align:center;"  ,sortColNo: 5} 
                        ,{text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100    ,style : "text-align:center;"   ,sortColNo: 1}  
                        ,{text: "Driver"                    ,name:"driver_name"             ,type:"input"       ,width : 180    ,style : "text-align:left;"  ,sortColNo: 2} 
                        ,{text: "PAO"                       ,name:"pao_name"                ,type:"input"       ,width : 180    ,style : "text-align:left;"  ,sortColNo: 3}
                        ,{text: "Start Date"                ,width : 120                    ,style : "text-align:left;"  ,sortColNo: 11
                            ,onRender : function(d){
                                return app.bs({name: "start_date"        ,type: "input"     ,value: app.svn(d,"start_date").toShortDate()});
                            }
                        }
                        ,{text: "End Date"                   ,width : 120                   ,style : "text-align:left;" ,sortColNo: 12 
                            ,onRender : function(d){
                                return app.bs({name: "end_date"          ,type: "input"     ,value: app.svn(d,"end_date").toShortDate()});
                            }
                        }
                        ,{text: "Start Odo Reading"         ,name:"start_odo"               ,type:"input"       ,width : 150    ,style : "text-align:center;"  ,sortColNo: 13}
                        ,{text: "End Odo Reading"           ,name:"end_odo"                 ,type:"input"       ,width : 150    ,style : "text-align:center;"  ,sortColNo: 14}
                        ,{text: "Distance(Km)"              ,name:"no_kms"                  ,type:"input"       ,width : 100    ,style : "text-align:center;"  ,sortColNo: 17} 
                        ,{text: "Collection Amount"          ,width : 150    ,style : "text-align:right;padding-right: 0.3rem;" ,sortColNo: 18 
                            ,onRender: function(d){
                                return app.bs({name: "total_collection_amt"          ,type: "input"  ,value: app.svn(d,"total_collection_amt") ? app.svn(d,"total_collection_amt").toMoney() : 0.00     ,style : "text-align:right;padding-right: 0.3rem;" });
                            }}
                        
                    ); 
                }
                if(gSubTabName === "Collection Details"){  
                    _dataRows.push(
                         {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                        ,{id: 2  ,groupId: 0                ,text: "Location"               ,style: "text-align:center;"}
                		,{id: 3  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
                		,{id: 4  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
                		,{id: 5  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
                		,{id: 6  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
                		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                		,{id: 8  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                        ,{text: "Trip No"                   ,name:"trip_no"                 ,type:"input"       ,width : 80     ,style : "text-align:center;"       ,groupId : 1  ,sortColNo: 1} 
                        ,{text: "Payment Date"                                                      ,width : 150          ,groupId : 1  ,sortColNo: 4
                            ,onRender: function(d){
                                return app.bs({name: "payment_date"         ,type: "input"     ,value: app.svn(d,"payment_date").toShortDateTime()    ,style : "text-align:center;"})
                                    +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                            }
                        }
                                        
                    );  
                    _dataRows.push(
                         {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"     ,groupId : 1  ,sortColNo: 2}  
                        ,{text: "Driver"                    ,name:"driver_name"             ,type:"input"       ,width : 180   ,style : "text-align:left;"       ,groupId : 1  ,sortColNo: 3} 
                        ,{text: "PAO"                       ,name:"pao_name"                ,type:"input"       ,width : 180   ,style : "text-align:left;"       ,groupId : 1  ,sortColNo: 4} 
                        ,{text: "Distance(Km)"              ,width : 100   ,style : "text-align:center;"       ,groupId : 1
                            ,onRender: function(d){
                                return app.bs({name: "no_klm"          ,type: "input"   ,value: app.svn(d,"no_klm")    ,style : "text-align:center;"});
                            }
                        }
                        ,{text: "Base Fare"                 ,name:"base_fare"               ,type:"input"       ,width : 60    ,style : "text-align:center;"     ,groupId : 1   ,sortColNo: 6}
                        ,{text: "From"                      ,name:"from_location"           ,type:"input"       ,width : 150   ,style : "text-align:left;"       ,groupId : 2   ,sortColNo: 7}
                        ,{text: "To"                        ,name:"to_location"             ,type:"input"       ,width : 150   ,style : "text-align:left;"       ,groupId : 2   ,sortColNo: 8}
                        ,{text: "Passenger"                  ,name:"no_reg"                 ,type:"input"       ,width : 60    ,style : "text-align:center;"     ,groupId : 3   ,sortColNo: 10}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"     ,groupId : 3
                            ,onRender: function(d){
                                return app.bs({name: "reg_amount"          ,type: "input"   ,value: app.svn(d,"reg_amount") ? app.svn(d,"reg_amount").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" ,sortColNo: 14});
                            }
                        }
                        ,{text: "Passenger"                  ,name:"no_stu"                  ,type:"input"      ,width : 60    ,style : "text-align:center;"       ,groupId : 4     ,sortColNo: 11}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 4     ,sortColNo: 15
                            ,onRender: function(d){
                                return app.bs({name: "stu_amount"          ,type: "input"     ,value: app.svn(d,"stu_amount") ? app.svn(d,"stu_amount").toMoney() : 0.00   ,style : "text-align:right;padding-right: 0.3rem;"    ,width : 60});
                            }
                        }
                        ,{text: "Passenger"                  ,name:"no_sc"                   ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 5    ,sortColNo: 12}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 5     ,sortColNo: 16
                            ,onRender: function(d){
                                return app.bs({name: "sc_amount"          ,type: "input"     ,value: app.svn(d,"sc_amount") ? app.svn(d,"sc_amount").toMoney() : 0.00     ,style : "text-align:right;padding-right: 0.3rem;"      ,width : 60});
                            }
                        }
                        ,{text: "Passenger"                  ,name:"no_pwd"                  ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 6    ,sortColNo: 13}
                        ,{text: "Total"                                                                         ,width : 60    ,style : "text-align:center;"       ,groupId : 6     ,sortColNo: 17
                            ,onRender: function(d){
                                return app.bs({name: "pwd_amount"          ,type: "input"   ,value: app.svn(d,"pwd_amount") ? app.svn(d,"pwd_amount").toMoney() : 0.00  ,style : "text-align:right;padding-right: 0.3rem;"   ,width : 60});
                            }
                        }
                        ,{text: "Total Amount"                                                                  ,width : 100          ,groupId : 7      ,sortColNo: 18
                            ,onRender: function(d){
                                return app.bs({name: "total_paid_amount"   ,type: "input"   ,value: app.svn(d,"total_paid_amount") ? app.svn(d,"total_paid_amount").toMoney() : 0.00   ,style : "text-align:right;padding-right: 0.3rem;" ,width : 60});
                            }
                        } 
                    );  
                } 
                 return _dataRows;  
            }; 
            $("#gridDailyFareCollections").dataBind({
                 sqlCode        : _sqlCode
                ,parameters     :  _params
                ,height         : $(window).height() - 400 
                ,dataRows       : _getDataRows()   
                ,onComplete: function(o){
                     _ctr = 1;
                    var _data       = o.data.rows; 
                    var _zRow       = this.find(".zRow");
                    var _this       = this;
                    var _rows;
                    var _counter    = 1;
                    var _tot        = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0,stod:0,edo:0,kms:0,tca:0,sales:0,pos:0}; 
                    var _total      = {}; 
                    var _h          = "";
                    var _dataRecentDD;
                    var _dataHistoryDD;
                    this.find("#colTrip").remove(); 
                    if(_sqlCode==="V1349"){   
                        _rows    = _data;//.getUniqueRows(["trip_no"]);    
                    }  
                    if(_sqlCode==="P1337" || _sqlCode==="P1338" || _sqlCode==="P1443" || _sqlCode==="P1442"){ 
                        _rows = _data;   
                    }  
                    //Computing data from tot
                    for(var i=0; i < _rows.length;i++ ){
                        var _info = _rows[i];
                        _tot.reg    +=Number(_info.reg_amount)|| 0; 
                        _tot.stu    +=Number(_info.stu_amount)|| 0; 
                        _tot.sc     +=Number(_info.sc_amount) || 0; 
                        _tot.pwd    +=Number(_info.pwd_amount)|| 0;
                        _tot.reg_no +=Number(_info.no_reg)|| 0; 
                        _tot.stu_no +=Number(_info.no_stu)|| 0; 
                        _tot.sc_no  +=Number(_info.no_sc) || 0; 
                        _tot.pwd_no +=Number(_info.no_pwd) || 0;
                        _tot.total  +=Number(_info.total_paid_amount)|| 0;
                        _tot.stod   +=Number(_info.start_odo)|| 0;
                        _tot.edo    +=Number(_info.end_odo) || 0;
                        _tot.kms    +=Number(_info.no_kms) || 0;
                        _tot.tca    +=Number(_info.total_collection_amt)|| 0;
                        _tot.sales  +=Number(_info.total_sales)|| 0;
                        _tot.pos    +=Number(_info.cash_sales)|| 0; 
                    }  
                    
                    if( _sqlCode==="P1443"){
                        _h  +=  '<div class="zRow even" id="colTrip">' 
                            +' <div class="zCell" style="width:60px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:right;">Total&raquo;</div>'
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:right;"></div>'
                            +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;"><b>&#8369; '+_tot.sales.toMoney()+'</b></div>'
                        +'</div>'; 
                    }
                    if(_sqlCode==="P1442"){
                        _h  +=  '<div class="zRow even" id="colTrip">' 
                            +' <div class="zCell" style="width:60px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:180px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:180px;text-align:right;">Total&raquo;</div>' 
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>' 
                            +' <div class="zCell" style="width:100px;text-align:right;"></div>'
                            +' <div class="zCell" style="width:120px;text-align:right;padding-right: 0.3rem;">'+_tot.tca.toMoney()+'</div>'
                        +'</div>'; 
                    }
                    if(_sqlCode ==="V1349"){
                        _h  +=  '<div class="zRow even" id="colTrip">' 
                            +' <div class="zCell" style="width:80px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +' <div class="zCell" style="width:180px;text-align:left;"></div>'
                            +' <div class="zCell" style="width:120px;text-align:left;"></div>'
                            +' <div class="zCell" style="width:120px;text-align:left;"></div>' 
                            +' <div class="zCell" style="width:150px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:150px;text-align:center;"></div>'
                            +' <div class="zCell" style="width:100px;text-align:right;">Total Amount</div>'
                            +' <div class="zCell" style="width:150px;text-align:right;padding-right: 0.3rem;">'+_tot.tca.toMoney()+'</div>'
                        +'</div>';
                     }
                    if(_sqlCode ==="P1338" || _sqlCode ==="P1337"){
                      _h  +=  '<div class="zRow even">'
                        +'    <div class="zCell" style="width:80px;text-align:center;"></div>'
                        +'    <div class="zCell" style="width:150px;undefined"></div>'
                        +'    <div class="zCell" style="width:100px;text-align:center;"></div>'
                        +'    <div class="zCell" style="width:180px;text-align:left;"></div>'
                        +'    <div class="zCell" style="width:180px;text-align:left;"></div>'
                        +'    <div class="zCell" style="width:100px;text-align:center;"></div>'
                        +'    <div class="zCell" style="width:60px;text-align:center;"></div>'
                        +'    <div class="zCell" style="width:150px;text-align:left;"></div>'
                        +'    <div class="zCell" style="width:150px;text-align:right;">Total Amount</div>'
                        +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.reg_no+'</div>'
                        +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.reg.toMoney()+'</div>'
                        +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.stu_no  +'</div>'
                        +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.stu.toMoney() +'</div>'
                        +'    <div class="zCell" style="width:60px;text-align:center;">'+_tot.sc_no +'</div>'
                        +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.sc.toMoney()  +'</div>'
                        +'    <div class="zCell" style="width:60px;text-align:center;">'+ _tot.pwd_no +'</div>'
                        +'    <div class="zCell" style="width:60px;text-align:right;">'+_tot.pwd.toMoney() +'</div>'
                        +'    <div class="zCell" style="width:100px;text-align:right;">'+ _tot.total.toMoney()+'</div>'
                        +' </div> ';
                        
                    }  
                    
                    this.find("#table").append(_h);
                    
                    if(_sqlCode==="P1443"){ 
                        if(_data.length){  
                            gRecentSumm = (gRecentSumm.length) ? gRecentSumm : _data;    
                            _dataRecentDD = gRecentSumm;   
                        }else{
                            gRecentSumm ;
                            gHistorySumm;
                        } 
                        gData = _dataRecentDD?_dataRecentDD:gRecentSumm;
                        fillDropdowns(gData);  
                     }
                    else if( _sqlCode==="P1442"){ 
                            if(_data.length){  
                                gHistorySumm = (gHistorySumm.length) ? gHistorySumm : _data;    
                                _dataHistoryDD = gHistorySumm;   
                            }else{
                                gHistorySumm ;
                                gRecentSumm;
                            } 
                        gData = _dataHistoryDD?_dataHistoryDD:gHistorySumm;
                        fillDropdowns(gData);  
                     } 
                    if(_sqlCode==="P1443" || _sqlCode==="P1442")  {  
                        var _tca = _this.find(".zRow").find("[name='total_collection_amt']").val();
                        
                        var total = function(){
                            var _$lastRow = _this.find(".zRow").find("b");
                            var _totalCost = _this.find(".zRow").find("[name='total_collection_amt']");
                            var _data = [];
                            var _totality = 0.00;
                            
                            _totalCost.each(function(){
                                if(this.value) _data.push(this.value.replace(/,/g, ""));
                            });
                            
                            for (var i = 0; i < _data.length; i++){
                               _totality += parseFloat(_data[i]);
                            }
                            
                           _$lastRow.text(_totality.toCommaSeparatedDecimal());
                        }
                        
                        _this.find("[name='excess_amt']").on("keyup change",function(){
                            var _$row = $(this).closest(".zRow"); 
                            
                            var _$exsAmt = _$row.find("[name='excess_amt']")
                                ,_dummyAmt = _$row.find("[name='dummy']").val().replace(/,/g, "")
                                ,_$totCollectionAmt = _$row.find("[name='total_collection_amt']")
                                ,_exsAmt = _$exsAmt.val().replace(/,/g, "")
                                ,_amount = "";
                                
                                if(_exsAmt !=="" && _dummyAmt !==""){
                                    _amount = parseFloat(_exsAmt) + parseFloat(_dummyAmt);
                                    _$totCollectionAmt.val(_amount.toCommaSeparatedDecimal());
                                    total();
                                }else _$totCollectionAmt.val(_tca)
                        });
                        
                        this.find("[name='pos_cash_amt'],[name='total_collection_amt']").attr("readonly",true)
                    }else this.find("input").attr("readonly",true);
                    $(".zRow:last-child()").addClass("zTotal"); 
                    this.find("[name='excess_amt'],[name='shortage_amt']").maskMoney();
                    $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold");      
                    setFooterFreezed("#gridDailyFareCollections");  
                    
                }
            }); 
        }
    function displayForPosting(){ 
        zsi.getData({
             sqlCode    : "P1339" //payment_for_posting_sum_sel
            ,parameters: { client_id: gUser.company_id}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _totality = 0.00;
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _totality  +=_info.total_fare;
                }
                
                //create additional row for total
                var _total = {
                     payment_date      : ""
                    ,vehicle_plate_no  : "Total Amount"
                    ,total_fare        : _totality
                };
                
                d.rows.push(_total);
                
                $("#gridTransactions").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 305
                    ,blankRowsLimit : 0
                    ,dataRows       : [
                        {text: "Payment Date"           ,name:"payment_date"            ,type:"input"       ,width : 150   ,style : "text-align:left;padding-left:2px;"
                            , onRender      : function(d) { 
                                return app.svn(d, "payment_date").toShortDateTime();
                            }
                        }
                        ,{text: "Vehicle Plate No."           ,width : 150   ,style : "text-align:left;padding-left:2px;" 
                            , onRender      : function(d) { 
                                var _vpn = app.svn (d,"vehicle_plate_no");
                                if(_vpn=="Total Amount")
                                    return _vpn;
                                else
                                    return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='fc.showModalForPostingSummary(\""+ app.svn (d,"vehicle_id") +"\",\""+ app.svn (d,"payment_date") +"\",\""+ _vpn +"\");'>" + _vpn + "</a>";
                            }
                        }
                        ,{text: "Total Fare"        ,name:"total_fare"              ,type:"input"       ,width : 150   ,style : "text-align:right;padding-right:4px;"
                            , onRender      : function(d) { 
                                return app.svn(d, "total_fare").toMoney();
                            }
                        }
                    ]
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css({"font-weight":"bold","text-align":"right"}); 
                        setFooterFreezed(gzGrid1); 
                    }
                });
            }
        });
    }
    function displayPostedTransactions(fromDate,toDate,paymentId,routeId,vehicleId,driverId,paoId){ 
        zsi.getData({
             sqlCode    : "P1341"  
            ,onComplete : function(d) {
                var _rows = d.rows;
                var _totality = 0.00;
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _totality  +=_info.posted_amount;
                }
                
                //create additional row for total
                var _total = {
                     post_no      : ""
                    ,posted_date  : "Total Amount"
                    ,posted_amount        : _totality
                    ,bank_transfer_no: ""
                };
                
                d.rows.push(_total);
                
                $(gzGrid2).dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 305
                    ,dataRows       : [
                         {text: "Post Id"               ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                var _postNo = app.svn (d,"post_no");
                                if(_postNo=="Total Amount")
                                    return _postNo;
                                else
                                    return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='fc.showModalPostedSummary(\""+ app.svn (d,"id") +"\",\""+ _postNo +"\");'>" + _postNo + "</a>";
                            }
                         }
                        ,{text: "Posted Date"           ,width : 150   ,style : "text-align:left;padding-left:2px;"
                            , onRender      : function(d) { 
                                var _postDate = app.svn (d,"posted_date");
                                if(_postDate=="Total Amount")
                                    return _postDate;
                                else
                                    return _postDate.toShortDate();
                            }
                        }
                        ,{text: "Amount"                ,width : 150   ,style : "text-align:right;padding-right:4px;"
                            , onRender      : function(d) { 
                                return app.svn(d, "posted_amount").toMoney();
                            }
                        }
                        ,{text: "Bank Transfer No."     ,width : 150   ,style : "text-align:right;padding-right:4px;"
                            , onRender      : function(d) { 
                                return app.svn(d, "bank_transfer_no");
                            }
                        }
                    ]
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed(gzGrid1); 
                    }
                });
            }
        });
    }  
    function displayForPostingSummary(vehicle_id,payment_date){
        var _getDataRows = function(){ 
            var _dataRows =[
                 {id: 1  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}	 
        		,{id: 2  ,groupId: 0                ,text: "Regular"                ,style: "text-align:center;"}
        		,{id: 3  ,groupId: 0                ,text: "Student"                ,style: "text-align:center;"}
        		,{id: 4  ,groupId: 0                ,text: "Senior"                 ,style: "text-align:center;"}
        		,{id: 5  ,groupId: 0                ,text: "PWD"                    ,style: "text-align:center;"}
        		,{id: 6  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
        		,{id: 7  ,groupId: 0                ,text: ""                       ,style: "text-align:center;"}
                ,{text: "Payment Date"                                                      ,width : 165          ,groupId : 1
                    ,onRender: function(d){
                        return app.bs({name: "payment_date"         ,type: "input"     ,value: payment_date.toShortDateTime()  ,style : "text-align:center;"})
                            +  app.bs({name: "payment_id"           ,type: "hidden"    ,value: app.svn(d,"payment_id")});
                    }
                }            
            ]; 
            
            _dataRows.push( 
                 {text: "Vehicle Type"              ,name:"vehicle_type"            ,type:"input"       ,width : 150   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Driver"                    ,name:"driver_name"             ,type:"input"       ,width : 180   ,style : "text-align:center;"       ,groupId : 1 } 
                ,{text: "Distance(Km)"              ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Base Fare"                 ,name:"base_fare"               ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 1}
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
            );
            
            return _dataRows;  
        };  
            
        zsi.getData({
             sqlCode        : "P1231" //payment_for_posting_sel
            ,parameters     : {vehicle_id: vehicle_id, client_id : gUser.company_id,payment_date:payment_date}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _tot = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                
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
                         payment_date       : ""  
                        ,from_location      : ""
                        ,to_location        : ""
                        ,no_klm             : "Total Amount"
                        ,no_reg             : _tot.reg_no.toMoney()
                        ,no_stu             : _tot.stu_no.toMoney()
                        ,no_sc              : _tot.sc_no.toMoney()
                        ,no_pwd             : _tot.pwd_no.toMoney()
                        ,reg_amount         : _tot.reg.toMoney()
                        ,stu_amount         : _tot.stu.toMoney()
                        ,sc_amount          : _tot.sc.toMoney()
                        ,pwd_amount         : _tot.pwd.toMoney()
                        ,total_paid_amount  : _tot.total.toMoney()
                        ,post_id            : ""
                        ,qr_id              : ""
                        ,driver             : ""
                        ,pao                : ""
                        ,vehicle_plate_no   : ""
                };
                
                d.rows.push(_total);
                $(gzGridForPostDtl).dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 400
                    ,blankRowsLimit : 0
                    ,dataRows       : _getDataRows()
                    ,onComplete: function(o){
                        //var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").find("[name='payment_date']").val("");
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed(gzGridForPostDtl); 
                    }
                });
            }
        });
    }
    function displayPostedSummary(post_id){
        zsi.getData({
             sqlCode    : "P1340"  
            ,parameters : {post_id: post_id,client_id: gUser.company_id}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _totality = 0.00;
                for(var i=0; i < _rows.length;i++ ){
                    var _info = _rows[i];
                    _totality  +=_info.total_amount;
                }
                
                //create additional row for total
                var _total = {
                     payment_date      : ""
                    ,vehicle_plate_no  : "Total Amount"
                    ,total_amount        : _totality
                };
                
                d.rows.push(_total);
                
                $("#gridPostedSummary").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 300
                    ,blankRowsLimit : 0
                    ,dataRows       : [
                        {text: "Payment Date"           ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                return app.svn(d, "payment_date").toShortDate();
                            }
                        }
                        ,{text: "Vehicle Plate No."     ,width : 150   ,style : "text-align:left;"
                            , onRender      : function(d) { 
                                var _vpn = app.svn (d,"vehicle_plate_no");
                                if(_vpn=="Total Amount")
                                    return _vpn;
                                else
                                    return "<a style='text-decoration:underline !important;' href='javascript:void(0)'  onclick='fc.showModalPostedSummaryDtl(\""+ app.svn (d,"post_id") +"\",\""+ app.svn (d,"vehicle_id") +"\",\""+ _vpn +"\");'>" + _vpn + "</a>";
                            }
                        }
                        ,{text: "Total"            ,width : 150   ,style : "text-align:right;"
                            , onRender      : function(d) { 
                                return app.svn(d, "total_amount").toMoney();
                            }
                        }
                    ]
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed(gzGrid1); 
                    }
                });
            }
        }); 
            
    }
    function displayPostedSummaryDtl(post_id, vehicle_id){
        var _getDataRows = function(){ 
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
            
            _dataRows.push(
                 {text: "Vehicle"                   ,name:"vehicle_plate_no"        ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1} 
                ,{text: "Vehicle Type"              ,name:"vehicle_type"            ,type:"input"       ,width : 150   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Driver"                    ,name:"full_name"               ,type:"input"       ,width : 180   ,style : "text-align:center;"       ,groupId : 1} 
                ,{text: "Distance(Km)"              ,name:"no_klm"                  ,type:"input"       ,width : 100   ,style : "text-align:center;"       ,groupId : 1}
                ,{text: "Base Fare"                 ,name:"base_fare"               ,type:"input"       ,width : 60    ,style : "text-align:center;"       ,groupId : 1}
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
            );
            
            return _dataRows;  
        };  
            
        zsi.getData({
             sqlCode        : "P1235" //payment_posted_sel
            ,parameters     : {post_id: post_id, vehicle_id: vehicle_id}
            ,onComplete : function(d) {
                var _rows= d.rows;
                var _tot = {reg:0,stu:0,sc:0,pwd:0,total:0,reg_no:0,stu_no:0,sc_no:0,pwd_no:0};
                
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
                         payment_date       : ""
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
                };
                
                d.rows.push(_total);
                $("#gridPostedSummaryDtl").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 320
                    ,blankRowsLimit : 0
                    ,dataRows       : _getDataRows()
                    ,onComplete: function(o){
                        var _this   = this; 
                        this.find("input").attr("readonly",true);
                        $(".zRow:last-child()").addClass("zTotal");
                        $(".zRow:last-child()").find('[name="no_klm"]').css("font-weight","bold"); 
                        setFooterFreezed("#gridPostedSummaryDtl"); 
                    }
                });
            }
        });
    }   
    function toExcelFormat(html){
        return "<html><head><meta charset='utf-8' /><style> table, td {border:thin solid black}table {border-collapse:collapse;font-family:Tahoma;font-size:10pt;}</style></head><body>"
             + html + "</body></html>";
    } 
    function setFooterFreezed(zGridId){ 
        var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
        var _tableRight   = _zRows.find("#table");
        var _zRowsHeight =   _zRows.height();
        var _everyZrowsHeight = "";
        var _zTotala = _tableRight.find(".zTotal");
        var _arr = [];
        var _height = 0;
        var _zTotal = "";
        if(gSubTabName!=="Collection Summary"){
            _everyZrowsHeight = $(".zRow:not(:contains('Total Amount'))")
            _zTotal = _tableRight.find(".zRow:contains('Total Amount')")
        }else{
            _everyZrowsHeight = $(".zRow:not(:contains('Total»'))")
            _zTotal = _tableRight.find(".zRow:contains('Total»')")
            
        }
        _everyZrowsHeight.each(function(){
            if(this.clientHeight) _arr.push(this.clientHeight);
        });
        
        for (var i = 0; i < _arr.length; i++){
           _height += _arr[i];
        }
        
        _zTotal.css({"top": _zRowsHeight}); 
        if(_zRows.find(".zRow").length == 1){
            _zTotal.addClass("hide");
        }else{
            if(_tableRight.height() > _zRowsHeight){
                _tableRight.parent().scroll(function() { 
                    if(gSubTabName==="Collection Details"){
                         _zTotal.css({"top":_zRowsHeight - 40 -( _tableRight.offset().top - _zRows.offset().top) });
                        _zTotala.prev().css({"margin-bottom":40 });
                    }
                    else if(gTabName==="Recent Collection" && gSubTabName==="Collection Summary"){
                         _zTotal.css({"top":_zRowsHeight - 20 -( _tableRight.offset().top - _zRows.offset().top) });
                        _zTotala.prev().css({"margin-bottom":40 });
                    }
                    else if(gTabName==="History Collection" && gSubTabName==="Collection Summary"){
                        if($(window).width()<1912){
                            _zTotal.css({"top":_zRowsHeight - 40 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":20 });
                        }else{
                            _zTotal.css({"top":_zRowsHeight - 20 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":40 });
                        }
                       
                    }
                    else{
                        if($(window).width() < 1536){
                            _zTotal.css({"top":_zRowsHeight - 38 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":40 });
                        } 
                        if($(window).width() > 1536){
                           _zTotal.css({"top":_zRowsHeight - 30 - ( _tableRight.offset().top - _zRows.offset().top) });
                           _zTotala.prev().css({"margin-bottom":20 });
                        }
                    }
                   
                });
            }else{
                _zTotal.css({"top": _height});
                
            }
        }
    } 
     
    
    $("#btnFilterRecent").click(function(){ 
        var  _$filter = $("#nav-recentCollection"); 
        _$filter.find('#trip_no, #dailyFare_vehicle, #dailyFare_driver,[name="dailyFare_pao"]').val()  
        displayDailyFareCollection();  
    }); 
    $("#historyBtn").find("#btnFilterCollection").click(function(){
        var  _$filter = $("#nav-recentCollection"); 
             _$filter.find('#trip_no, #dailyFare_vehicle, #dailyFare_driver,#dailyFare_pao').val() 
        $("#divGridFareCol").show(); 
         displayDailyFareCollection(gVhId?gVhId:'');   
    });
    $("#btnFilterRecentSumm").click(function(){ 
        var  _$filter = $("#nav-recentCollection"); 
        $("#divGridFareCol").show(); 
        _$filter.find('#vehicleRecent').val()
         displayDailyFareCollection(gVhId?gVhId:'');   
    });
    $("#btnFilterHistorySumm").click(function(){
        $("#divGridFareCol").show(); 
        gSDate = $("#historyStart").val();
        gEDate = $("#historyEnd").val();
        var  _$filter = $("#nav-recentCollection"); 
             _$filter.find('#vhistorySumm').val() 
         displayDailyFareCollection(gVhId?gVhId:'');   
         $("#divGridFareCol").show(500);
    }); 
    $("#btnResetDailyFare").click(function(){   
        if(gSubTabName === "Collection by Trip"){ 
            $('#dailyFare_vehicle').val("");
            $('#dailyFare_driver').val("");
            $('#dailyFare_pao').val("");  
        }
        else if(gSubTabName === "Collection Details"){ 
            $('#dailyFare_vehicle').val("");
            $('#dailyFare_driver').val("");
            $('#dailyFare_pao').val("");  
        } 
    }); 
    $("#btnResetRecent").click(function(){    
        if(gSubTabName === "Collection by Trip"){ 
            $('#dailyFare_vehicle').val("");
            $('#dailyFare_driver').val("");
            $('select[name="dailyFare_pao"]').val("");  
        }
        else if(gSubTabName === "Collection Details"){ 
            $('#dailyFare_vehicle').val("");
            $('#dailyFare_driver').val("");
            $('select[name="dailyFare_pao"]').val("");   
        } 
    }); 
    $("#btnResetHistorySumm").click(function(){   
        $('#vhistorySumm').val("") 
        gVhId    = null 
        displayDailyFareCollection();
    }); 
    $("#btnResetRecentSumm").click(function(){   
        $('#vehicleRecent').val("")
        gVhId    = null 
        displayDailyFareCollection();
    }); 
    $(".btnExport").click(function () {
        var _grid = "#gridDailyFareCollections";
            if(gTabName === "Recent Collection") {
                if(gSubTabName === "Collection Summary") _fileName = "Recent Collection Summary"
                else if(gSubTabName === "Collection by Trip") _fileName = "Recent Collection by Trip"
                else _fileName = "Recent Collection Details"
            }
            else if(gTabName === "History Collection"){
                _navId = "#nav-recentCollection"
                if(gSubTabName === "Collection Summary") _fileName = "History Collection Summary"
                else if(gSubTabName === "Collection by Trip") {
                    _fileName = "History Collection by Trip"
                }
                else _fileName = "History Collection Details"
            }
            else if(gTabName === "For Posting"){
                _grid  = "#gridTransactions"
                _fileName = "For Posting"
                
            }else {
                _grid  = "#gridPostedTransactions"
                _fileName = "Posted"
                
            }
        if(gSubTabName !== "Collection Details"){
               $(_grid).convertToTable(function(table){
                var _html = table.get(0).outerHTML; 
                zsi.htmlToExcel({
                    fileName: _fileName
                    ,html : _html
                });
            }); 
            
            return
        }
          
        $("#gridDailyFareCollections").convertToTable(  
            function($table){ 
                $table.find("th").closest("tr").remove();
                $("#ExcelgridDailyFareCollections tbody").before('<thead><tr><th colspan="7"></th><th colspan="2">Location</th></th><th colspan="2">Regular</th><th colspan="2">Student</th><th colspan="2">Senior</th><th colspan="2">PWD</th><th ></tr>'
                            + '<tr><th>Trip No</th><th>Payment Date</th><th>Vehicle</th><th>Driver</th><th>PAO</th><th>Distance(km)</th><th>Base Fare</th><th>From</th><th>To</th><th>Passenger</th><th>Total</th><th>Passenger</th><th>Total</th><th>Passenger</th><th>Total</th><th>Passenger</th><th>Total</th><th>Total Amount</th>'
                            + '</tr></thead>'
                );
                $table.htmlToExcel({
                   fileName: _fileName
               });
        });
    });
    $(".btnSaveSumm").click(function(){   
        if(gSubTabName){ 
            $("#gridDailyFareCollections").find("[name='pos_cash_amt'],[name='qr_amt'],[name='shortage_amt'],[name='excess_amt'],[name='total_collection_amt']").each(function(){
                this.value = this.value.replace(/,/g, "");
            });
            $("#gridDailyFareCollections").jsonSubmit({
                 procedure: "actual_payments_upd" 
                ,notIncludes : ["dummy"]
                ,onComplete: function (data) { 
                   if(data.isSuccess===true) zsi.form.showAlert("alert"); 
                    displayDailyFareCollection()   
                } 
            }); 
        };
    });
    
    return _pub;
})();     

                    