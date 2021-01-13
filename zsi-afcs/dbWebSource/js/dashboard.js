        
var db=(function(){ 
        var   bs                    = zsi.bs.ctrl 
            ,_public                = {} 
            ,gClientId              = ""
            ,gData                  = ""
            ,gMonth                 = ""
            ,gYear                  = ""
            ,gMonthName             = ""
            ,gDDChange              = false  
            ,gMonthlyClicked        = false
             ;
            
        
        zsi.ready = function(){   
            $(".page-title").html("Dashboard");
             var _roleId     = app.userInfo.role_id;   
            if(_roleId === 5) {  
                $("#nonBankPersonnel").hide();
                displayBankPersonnelRecords();
            }else{
                $("#nonBankPersonnel").show();
                getYearlyData();   
            }   
            
            document.addEventListener('keydown', (event) => {
              if (event.key === 'Escape') {
                $('#modalDailyRecords').find(".close").click();
              }
            });  
        };
        
        _public.showModalDailyRecords = function(clientId,year,month,clientName){ 
            gClientId       = clientId;
            gYear           = year;
            gClientName     = clientName; 
            var _monthParam = month 
                ,_data      = []  
                ,_$mdl      = $('#modalDailyRecords')    
                ,_month     = [];
                
                _month[1]   = "January";
                _month[2]   = "February";
                _month[3]   = "March";
                _month[4]   = "April";
                _month[5]   = "May";
                _month[6]   = "Jun";
                _month[7]   = "July";
                _month[8]   = "August";
                _month[9]   = "September";
                _month[10]  = "October";
                _month[11]  = "November";
                _month[12]  = "December"; 
                for (var i = 0; i < gData.length; i++) { 
                    for(var n=1;n<=_month.length-1; n++){ 
                        if(gData[i].pay_month === n){  
                            gMonthName  = _month[_monthParam];
                            _data.push(
                                {month:_month[n],no:n}    
                            ); 
                        } 
                    }   
                }
            var monthName = function(param){
                var _month     = [] 
                _month[1]   = "January";
                _month[2]   = "February";
                _month[3]   = "March";
                _month[4]   = "April";
                _month[5]   = "May";
                _month[6]   = "Jun";
                _month[7]   = "July";
                _month[8]   = "August";
                _month[9]   = "September";
                _month[10]  = "October";
                _month[11]  = "November";
                _month[12]  = "December"; 
                 
                for(var n=1;n<=param.length; n++){   
                     gMonthName  = _month[param];  
                }   
                
            };
            $("#companyLogo").attr({src: base_url + 'dbimage/ref-0001/client_id/' + clientId + "/company_logo" }); 
            _$mdl.find(".modal-title").text(clientName);
            _$mdl.find("#modalDates").html(year);
            _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
            _$mdl.find("#month_of").fillSelect({	
                 data       : _data
                ,text       : "month"
                ,value      : "no" 
                ,onChange   : function(){
                    _monthParam = $(this).val(); 
                    gMonth      = $(this).val(); 
                    monthName(gMonth);
                    gDDChange   = true;
                }
                ,onComplete : function(){
                   $(this).val(_monthParam); 
                }
            }); 
             $('body').css("overflow", "scroll");
            if($(window).width() <= 575){
                $("#titleLabel").removeClass("mt-6");
            }
            displayDailyRecords(clientId,year,month,clientName);
        };
        
        function getYearlyData(){
            
            zsi.getData({
                 sqlCode : "P1389" 
                ,parameters : {client_id:app.userInfo.company_id}
                ,onComplete : function(d) {
                    var _rows = d.rows;  
                    var _getColor = function(cb){ 
                        var _colorSet = new am4core.ColorSet();
                        _colors = _colorSet;   
                        cb(_colors);
                    }; 
                    var _displayYearGraph = function(o){   
                        var _data = [];
                        var _colorSet = new am4core.ColorSet(); 
                        var _getCategoryColor = function(category, index){
                            var _color = $.grep(_colorRows, function(z) {
                                return z.field_name.toUpperCase() == category.toUpperCase();
                            });
                            return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                        };
                        var _setData = function(){  
                            $.each(o.data, function(i,v){  
                                var _json = {};  
                                    _json.category = v.pay_year;
                                    _json.value = v.total_fare;
                                    _json.color = _colorSet.next();  
                                _data.push(_json);
                                
                            });
                        
                        };
                        _setData();  
                        am4core.ready(function() { 
                             var chart = am4core.create(o.container, am4charts.XYChart3D); 
                            chart.numberFormatter.numberFormat = '###';
                            // Set data  
                            var generateChartData = function() { 
                                var chartData       = [] 
                                    ,_dataLength    = _data.length;
                                    
                                for (var i = 0; i < _dataLength; i++) {  
                                    chartData.push({
                                        category: _data[i].category,
                                        value: _data[i].value,
                                        color: _data[i].color,
                                        id: i
                                      }); 
                                    } 
                                    
                                return chartData; 
                            }; 
                            // Add data
                            chart.data = generateChartData();  
                           // Add and configure Series    
                            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                                categoryAxis.dataFields.category = "category";
                                categoryAxis.renderer.minGridDistance = 20;    
                                categoryAxis.renderer.labels.template.horizontalCenter = "right";
                                categoryAxis.renderer.labels.template.verticalCenter = "middle";
                                categoryAxis.renderer.labels.template.rotation = 300;  
                           
                            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); 
                            
                            var series = chart.series.push(new am4charts.ColumnSeries3D());  
                                series.dataFields.categoryX = "category"; 
                                series.dataFields.valueY = "value";    
                                series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";  
                                if(o.category==="pay_month") series.columns.template.tooltipText = "Month of "+"{categoryX}: [bold]{valueY}[/]";  
                                
                            var series2 = chart.series.push(new am4charts.LineSeries());
                                series2.name = "category";
                                series2.stroke = am4core.color("#CDA2AB");
                                series2.strokeWidth = 3;
                                series2.dataFields.valueY = "value";
                                series2.dataFields.categoryX = "category";      
                                chart.cursor = new am4charts.XYCursor();   
                                // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                                series.columns.template.adapter.add("fill", function (fill, target) { 
                                	return chart.colors.getIndex(target.dataItem.index);
                                });
                                
                            var title = chart.titles.create();
                                title.text = "Yearly Collection";   
                        });
                        displayMonthlyCharts(_rows);
                    }; 
                    var _container = "graph1"
                        ,_value = "total_fare"
                        ,_category = "pay_year"
                        ,_isColorSet = false
                        ,_json = {};
                        _json.title = "Collection";
                        _json.container = _container;
                        _json.value = _value;
                        _json.category = _category;
                        _json.isColorSet = _isColorSet;  
                        _getColor(function(colorSet){ 
                            _json.colorSet = colorSet;
                            _json.data = _rows;
                            _json.category; 
                            _json.title = "Collection";  
                            _displayYearGraph(_json); 
                             
                        });  
                
                    }
                });
           } 
        function displayMonthlyCharts(data){    
             am4core.useTheme(am4themes_animated);
            // Enable queuing 
            am4core.options.queue = true;
            am4core.options.onlyShowOnViewport = true;     
            var _colors = [];
            var _colorRows = [];
            
            var _getData = function(sqlCode,params,cb){   
                zsi.getData({
                     sqlCode : sqlCode 
                    ,parameters : params
                    ,onComplete : function(d) {
                        var _rows = d.rows;  
                        cb(_rows);  
                    }
                });
            };
           
            var _getColor = function(cb){ 
                var _colorSet = new am4core.ColorSet();
                    _colors = _colorSet;  
                    cb(_colors);
            }; 
            var _displayBarGraph = function(o){ 
                var _dataLength = o.data.length;
                var _data = [];
                var _colorSet = new am4core.ColorSet(); 
                var _getCategoryColor = function(category, index){
                    var _color = $.grep(_colorRows, function(z) {
                        return z.field_name.toUpperCase() == category.toUpperCase();
                    });
                    return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                };
                var _setData = function(){ 
                    $.each(o.data, function(i,v){  
                        var _json = {};  
                        _json.category = v.pay_month;
                        _json.value = v.total_fare;
                        _json.color = _colorSet.next();   
                        _data.push(_json); 
                    });
                
                };
                _setData();  
                am4core.ready(function() { 
                    var chart = am4core.create(o.container, am4charts.XYChart3D); 
                    chart.numberFormatter.numberFormat = '###';
                    // Set data 
                    var _platform = ""; 
                    var selected;
                    var generateChartData = function() { 
                        var chartData = []; 
                        var _monthlyCtgry = ""; 
                        var _month = []; 
                            _month[1]   = "Jan";
                            _month[2]   = "Feb";
                            _month[3]   = "Mar";
                            _month[4]   = "Apr";
                            _month[5]   = "May";
                            _month[6]   = "Jun";
                            _month[7]   = "Jul";
                            _month[8]   = "Aug";
                            _month[9]   = "Sep";
                            _month[10]  = "Oct";
                            _month[11]  = "Nov";
                            _month[12]  = "Dec"; 
                        for (var i = 0; i < _data.length; i++) {      
                            for(var n=1;n<=_month.length-1; n++){  
                                if(_data[i].category === n){ 
                                  _monthlyCtgry = _month[n]; 
                                } 
                            }  
                            chartData.push({
                                title       : o.title,
                                year        : o.year,
                                code        : o.sqlCode,
                                category    : _monthlyCtgry,
                                categorySub : _data[i].category,
                                container   : o.container, 
                                value       : _data[i].value,
                                color       : _data[i].color,
                                id: i
                            });  
                        }  
                        return chartData; 
                    }; 
                    // Add data
                    chart.data = generateChartData();
                    chart.scrollbarX = new am4core.Scrollbar(); 
                    chart.scrollbarY = new am4core.Scrollbar(); 
                    // Add and configure Series     
                    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                        categoryAxis.dataFields.category = "category"; 
                        categoryAxis.renderer.minGridDistance = 20; 
                        categoryAxis.renderer.labels.template.horizontalCenter = "right";
                        categoryAxis.renderer.labels.template.verticalCenter = "middle";
                        categoryAxis.renderer.labels.template.rotation = 300;
                       
                        
                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                    
                    var series = chart.series.push(new am4charts.ColumnSeries3D());  
                        series.dataFields.categoryX = "category"; 
                        series.dataFields.valueY = "value";    
                        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";  
                        series.columns.template.tooltipText = "Month of "+"{categoryX}: [bold]{valueY}[/]";    
                        chart.cursor = new am4charts.XYCursor();   
                        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                    var series2 = chart.series.push(new am4charts.LineSeries());
                        series2.name = "category";
                        series2.stroke = am4core.color("#CDA2AB");
                        series2.strokeWidth = 3;
                        series2.dataFields.valueY = "value";
                        series2.dataFields.categoryX = "category";
                        series.columns.template.adapter.add("fill", function (fill, target) { 
                        	return chart.colors.getIndex(target.dataItem.index);
                        });
                
                    var title = chart.titles.create();    
                        if(o.data.length===0)title.text = 'No Monthly Data ';
                        else title.text = 'Monthly Data ';
                        series.columns.template.events.on("hit", function(ev) {
                            if (typeof ev.target.dataItem.dataContext.category) { 
                            var _catgry     = ev.target.dataItem.dataContext.category;
                            var _month      = ev.target.dataItem.dataContext.categorySub;
                            var _yearly     = ev.target.dataItem.dataContext.year;
                            var _container  = ev.target.dataItem.dataContext.container;
                            var _code       = ev.target.dataItem.dataContext.code; 
                            var _title      = ev.target.dataItem.dataContext.title;  
                            
                            var _dailyData = function(sqlCode,params, cb){  
                                var _params = {
                                   client_id:params.client_id
                                   ,month:params.month 
                                   ,year:params.year
                                };
                                zsi.getData({
                                         sqlCode    : "P1387"
                                        ,parameters : _params
                                        ,onComplete : function(d) { 
                                          cb(d.rows);   
                                    }
                                });
                            };  
                            
                            var _getDynamicColor = function(cb){ 
                                var _colorSet = new am4core.ColorSet();
                                    _colors = _colorSet;  
                                    cb(_colors);
                            }; 
                             
                            var _sqlCode = "P1387"   
                                ,_value = "total_fare"
                                ,_category = "pay_day"
                                ,_isColorSet = false
                                ,_json = {};
                                _params = {
                                    client_id   :app.userInfo.company_id 
                                   ,month       :_month
                                   ,year        :_yearly
                                }; 
                                
                            _getDynamicColor(function(colorSet){
                                _dailyData(_sqlCode,_params, function(data){
                                    _json.colorSet  = colorSet;
                                    _json.data      = data;
                                    _json.category  = _category; 
                                    _json.subCtgry  = _month; 
                                    _json.container = _container;
                                    _json.sqlCode   = _code; 
                                    _json.title     = _title;
                                    _displayNewGraph(_json); 
                                });
                            }); 
                            
                            var _displayNewGraph = function(o){ 
                                o.data.sort((a, b) => (a.pay_day > b.pay_day) ? 1 : -1);
                                var _dataLength = o.data.length;
                                var _data = [];
                                var _colorSet = new am4core.ColorSet(); 
                                var _getCategoryColor = function(category, index){
                                    var _color = $.grep(_colorRows, function(z) {
                                        return z.field_name.toUpperCase() == category.toUpperCase();
                                    });
                                    return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                                };
                                var _setDailyData = function(){  
                                    $.each(o.data, function(i,v){  
                                        var _json       = {};     
                                        _json.category  = v.pay_day; 
                                        _json.container = o.container;
                                        _json.value     = v.total_fare;
                                        _json.sqlCode   = o.sqlCode;
                                        _json.title     = o.title;
                                        _json.color     = _colorSet.next();  
                                        _data.push(_json); 
                                    });
                                    
                                };
                                    _setDailyData();
                                am4core.ready(function() { 
                                    var chart = am4core.create(o.container, am4charts.XYChart3D); 
                                    chart.numberFormatter.numberFormat = '###';
                                    // Set data  
                                    var generateDailyChartData = function() {
                                        var _chartData = [];    
                                        for (var i = 0; i < _data.length; i++) {  
                                            _chartData.push({
                                                container   : _data[i].container,
                                                category    : "Day "+_data[i].category,   
                                                value       : _data[i].value,
                                                color       : _data[i].color,
                                                id: i
                                            }); 
                                            
                                        } 
                                        return _chartData;
                                    }; 
                                    // Add Pay day data
                                    chart.data = generateDailyChartData();
                                    chart.exporting.menu = new am4core.ExportMenu();
                                    chart.scrollbarX = new am4core.Scrollbar(); 
                                    chart.scrollbarY = new am4core.Scrollbar(); 
                                   // Add and configure Series    
                                    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                                        categoryAxis.dataFields.category = "category";
                                        categoryAxis.renderer.minGridDistance = 20;  
                                        categoryAxis.renderer.labels.template.horizontalCenter = "right";
                                        categoryAxis.renderer.labels.template.verticalCenter = "middle";
                                        categoryAxis.renderer.labels.template.rotation = 300;
                                        
                                    
                                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                                    var series = chart.series.push(new am4charts.ColumnSeries3D());  
                                        series.dataFields.categoryX = "category";  
                                        series.dataFields.valueY = "value";    
                                        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";   
                                        chart.cursor = new am4charts.XYCursor();   
                                        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                                        series.columns.template.adapter.add("fill", function (fill, target) { 
                                        	return chart.colors.getIndex(target.dataItem.index);
                                        }); 
                                    var series2 = chart.series.push(new am4charts.LineSeries());
                                        series2.name = "category";
                                        series2.stroke = am4core.color("#CDA2AB");
                                        series2.strokeWidth = 3;
                                        series2.dataFields.valueY = "value";
                                        series2.dataFields.categoryX = "category";  
                                        
                                    //Add title 
                                    var title = chart.titles.create();
                                        title.text = 'Month of ' + _catgry; 
                                    var resetLabel = chart.plotContainer.createChild(am4core.Label);
                                        resetLabel.text = "[bold]<< Back to monthly data";
                                        resetLabel.valign = "top";
                                        resetLabel.x = 20;
                                        resetLabel.y = 200;
                                        resetLabel.cursorOverStyle = am4core.MouseCursorStyle.pointer; 
                                        resetLabel.events.on('hit', function(ev) {
                                            resetLabel.hide();
                                            title.text = "Monthly Data";  
                                            var _initCol = function(name){ 
                                                var _sqlCode = _code
                                                    ,_params = {
                                                        client_id:app.userInfo.company_id
                                                        ,year : _yearly 
                                                    }
                                                    ,_isColorSet = false
                                                    ,_json = {};
                                                    
                                                switch (name) { 
                                                    case name:  
                                                        _category   = "pay_month";
                                                        _container  = _container;
                                                        _value      = "total_fare"; 
                                                    break; 
                                                     
                                                }  
                                                _json.title         = _title;
                                                _json.container     = _container;
                                                _json.value         = "total_fare";
                                                _json.category      = "pay_month";
                                                _json.isColorSet    = _isColorSet;  
                                                _getColor(function(colorSet){
                                                    _getData(_sqlCode,_params, function(data){
                                                        _json.colorSet = colorSet;
                                                        _json.data = data;
                                                        _json.category; 
                                                        _json.title = _title; 
                                                        _json.year =_yearly; 
                                                         _json.sqlCode = _code; 
                                                        _displayBarGraph(_json); 
                                                    });
                                                }); 
                                        }; 
                                        _initCol(o.title);   
                                        resetLabel.hide(); 
                                    }); 
                                    resetLabel.show(); 
                                }); 
                            }; 
                        }
                      }, this); 
                });
            };   
            data.reverse().forEach(function(o,i) {  
                var _container = "graph_"+i; 
                var templateString = ' <div class="col-md-6 col-sm-6 col-12 graphs mt-3 ">'
                 +'     <div class="panel mb-0">'
                 +'         <div class="panel-hdr text-primary">'
                 +'             <h2>'
                 +'                 <span class="mr-2"><i class="far fa-chart-pie"></i></span>'+ o.pay_year+" Monthly Collection"+''
                 +'             </h2>'
                 +'             <div class="panel-toolbar"> '
                 +'                 <button class="btn btn-panel waves-effect waves-themed far fa-window-minimize" data-action="panel-collapse"  data-offset="0,10" data-original-title="Collapse" data-toggle="tooltip" title="Collapse"></button>'
                 +'                 <button class="btn btn-panel waves-effect waves-themed fas fa-expand" data-action="panel-fullscreen"  data-offset="0,10" data-original-title="Fullscreen" data-toggle="tooltip" title="Expand"></button> '
                 +'             </div>'
                 +'         </div>'
                 +'         <div class="panel-container show">'
                 +'             <div class="panel-content"> ' 
                 +'                 <div class="panel-container collapse show">'
                 +'                     <div class="panel-content">'
                 +'                         <div class="zGraph" id="'+ _container +'"></div>'
                 +'                     </div>'
                 +'                 </div> '
                 +'             </div>'
                 +'         </div>'
                 +'     </div>'
                 +'</div>';
            	$('#newDiv').append(templateString);   
            
                var _params = {
                        client_id:app.userInfo.company_id 
                        ,year   : data[i].pay_year
                    }
                    ,_sqlCode = "P1388" 
                    ,_value = "total_fare"
                    ,_category = "pay_month"
                    ,_isColorSet = false
                    ,_name = data[i].pay_year
                    ,_json = {};  
                   
                    _json.title =  data[i].pay_year+" Monthly Collection";
                    _json.container = _container;
                    _json.yearParams = data[i].pay_year;
                    _json.value = _value;
                    _json.category = _category;
                    _json.isColorSet = _isColorSet;  
                    _getColor(function(colorSet){
                        _getData(_sqlCode,_params, function(data){ 
                            _json.colorSet = colorSet;
                            _json.data = data;  
                            _json.sqlCode = _sqlCode;  
                            _json.year = _params.year;  
                            _displayBarGraph(_json); 
                        });
                    });  
            	 	 
            });   
        }  
        //BANK PERSONNEL
        function displayBankPersonnelRecords(){   
                zsi.getData({
                     sqlCode    : "B1448"   
                    ,onComplete : function(d) {
                        var _rows = d.rows;   
                        var _getColor = function(cb){ 
                            var _colorSet = new am4core.ColorSet();
                            _colors = _colorSet;   
                            cb(_colors);
                        }; 
                        
                        var _getYearlyData = function(sqlCode,params,cb){   
                            zsi.getData({
                                 sqlCode : sqlCode 
                                ,parameters : params
                                ,onComplete : function(d) {
                                    var _rows = d.rows;  
                                    cb(_rows);  
                                }
                            });
                        };
                        var _displayBarGraph = function(o){ 
                            o.data.sort((a, b) => (a.pay_year > b.pay_year) ? 1 : -1);
                             gridData(o);
                            var _data = [];
                            var _colorSet = new am4core.ColorSet(); 
                            var _getCategoryColor = function(category, index){
                                var _color = $.grep(_colorRows, function(z) {
                                    return z.field_name.toUpperCase() == category.toUpperCase();
                                });
                                return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                            };
                            var _setData = function(){  
                                $.each(o.data, function(i,v){  
                                    var _json = {};  
                                        _json.category = v.pay_year;
                                        _json.value = v.total_fare; 
                                        _json.color = _colorSet.next();  
                                    _data.push(_json); 
                                });
                            
                            };
                            _setData();  
                            am4core.ready(function() { 
                                 var chart = am4core.create(o.container, am4charts.XYChart3D); 
                                chart.numberFormatter.numberFormat = '###';
                                // Set data  
                                var generateChartData = function() { 
                                    var chartData = [];  
                                    for (var i = 0; i < _data.length; i++) {  
                                        chartData.push({
                                            category    : _data[i].category,
                                            value       : _data[i].value,
                                            color       : _data[i].color,
                                            client_id   : o.client_id,
                                            client_name : o.client_name,
                                            container   : o.container, 
                                            code        : o.sqlCode,
                                            id          : i,
                                            subContainer: o.subContainer,
                                            dataRows    : o
                                          }); 
                                        } 
                                    return chartData; 
                                }; 
                                // Add data
                                chart.data = generateChartData();  
                               // Add and configure Series    
                                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                                    categoryAxis.dataFields.category = "category";
                                    categoryAxis.renderer.minGridDistance = 20;    
                                    categoryAxis.renderer.labels.template.horizontalCenter = "right";
                                    categoryAxis.renderer.labels.template.verticalCenter = "middle";
                                    categoryAxis.renderer.labels.template.rotation = 300;  
                               
                                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); 
                                
                                var series = chart.series.push(new am4charts.ColumnSeries3D());  
                                    series.dataFields.categoryX = "category"; 
                                    series.dataFields.valueY = "value";    
                                    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";  
                                    
                                    
                                var series2 = chart.series.push(new am4charts.LineSeries());
                                    series2.name = "category";
                                    series2.stroke = am4core.color("#CDA2AB");
                                    series2.strokeWidth = 3;
                                    series2.dataFields.valueY = "value";
                                    series2.dataFields.categoryX = "category";      
                                    chart.cursor = new am4charts.XYCursor();   
                                    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                                    series.columns.template.adapter.add("fill", function (fill, target) { 
                                    	return chart.colors.getIndex(target.dataItem.index);
                                    });   
                                var title = chart.titles.create();
                                    title.text = "Yearly Collection"; 
                                    series.columns.template.events.on("hit", function(ev) {
                                        if (typeof ev.target.dataItem.dataContext.category) { 
                                        gMonthlyClicked=true;
                                        var _subContainer   = ev.target.dataItem.dataContext.subContainer;
                                        var _clientId       = ev.target.dataItem.dataContext.client_id;
                                        var _year           = ev.target.dataItem.dataContext.category;
                                        var _container      = ev.target.dataItem.dataContext.container;
                                        var _code           = ev.target.dataItem.dataContext.code;
                                        var _clientName     = ev.target.dataItem.dataContext.client_name;
                                        var _dataRows     = ev.target.dataItem.dataContext.dataRows;
                                        
                                         
                                        var _setMonthlyData = function(sqlCode,params, cb){ 
                                            var _params = {
                                               client_id:params.client_id
                                               ,month:params.month 
                                               ,year:params.year
                                            };
                                            zsi.getData({
                                                     sqlCode    : sqlCode
                                                    ,parameters : _params
                                                    ,onComplete : function(d) { 
                                                      cb(d.rows);   
                                                }
                                            });
                                        };   
                                        var _getDynamicColor = function(cb){ 
                                            var _colorSet = new am4core.ColorSet();
                                                _colors = _colorSet;  
                                                cb(_colors);
                                        };  
                                        var _sqlCode = "P1388"   
                                            ,_value = "total_fare"
                                            ,_category = "pay_month"
                                            ,_isColorSet = false 
                                            ,_json = {};
                                            _params = {
                                                client_id   :_clientId 
                                               ,year        :_year
                                            }; 
                                        
                                        _getDynamicColor(function(colorSet){
                                            _setMonthlyData(_sqlCode,_params, function(data){
                                                _json.colorSet  = colorSet;
                                                _json.data      = data; 
                                                _json.container = _container;
                                                _json.sqlCode   = _sqlCode;
                                                _json.subContainer = _subContainer
                                                _displayMonhtlyGraph(_json); 
                                            });
                                        }); 
                                        
                                        var _displayMonhtlyGraph = function(o){ 
                                            var _monthlyData = o.data; 
                                            o.data.sort((a, b) => (a.pay_month > b.pay_month) ? 1 : -1);
                                            gridData(o);
                                            var _dataLength = o.data.length;
                                            var _data = [];
                                            var _colorSet = new am4core.ColorSet();  
                                            var _setMonthlyData = function(){  
                                                $.each(o.data, function(i,v){  
                                                    var _json       = {};     
                                                    _json.category  = v.pay_month; 
                                                    _json.container = o.container;
                                                    _json.value     = v.total_fare; 
                                                    _json.color     = _colorSet.next();  
                                                    _data.push(_json); 
                                                });
                                                
                                            };
                                            _setMonthlyData();
                                            am4core.ready(function() { 
                                                var chart = am4core.create(o.container, am4charts.XYChart3D); 
                                                chart.numberFormatter.numberFormat = '###';
                                                // Set data  
                                                var generateDailyChartData = function() {
                                                    var chartData = []; 
                                                    var _monthlyCtgry = ""; 
                                                    var _month = []; 
                                                        _month[1]   = "Jan";
                                                        _month[2]   = "Feb";
                                                        _month[3]   = "Mar";
                                                        _month[4]   = "Apr";
                                                        _month[5]   = "May";
                                                        _month[6]   = "Jun";
                                                        _month[7]   = "Jul";
                                                        _month[8]   = "Aug";
                                                        _month[9]   = "Sep";
                                                        _month[10]  = "Oct";
                                                        _month[11]  = "Nov";
                                                        _month[12]  = "Dec"; 
                                                    for (var i = 0; i < _data.length; i++) {      
                                                        for(var n=1;n<=_month.length-1; n++){  
                                                            if(_data[i].category === n){ 
                                                              _monthlyCtgry = _month[n]; 
                                                            } 
                                                        }  
                                                        chartData.push({
                                                            title       : o.title,
                                                            year        : o.year,
                                                            code        : o.sqlCode,
                                                            category    : _monthlyCtgry,
                                                            categorySub : _data[i].category,
                                                            container   : o.container, 
                                                            value       : _data[i].value,
                                                            color       : _data[i].color,
                                                            rows        : _monthlyData,
                                                            id: i
                                                        });  
                                                    }  
                                                    return chartData; 
                                                }; 
                                                
                                                // Add Pay day data
                                                chart.data = generateDailyChartData();
                                                chart.exporting.menu = new am4core.ExportMenu();
                                                chart.scrollbarX = new am4core.Scrollbar(); 
                                                chart.scrollbarY = new am4core.Scrollbar(); 
                                               // Add and configure Series    
                                                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                                                    categoryAxis.dataFields.category = "category";
                                                    categoryAxis.renderer.minGridDistance = 20;  
                                                    categoryAxis.renderer.labels.template.horizontalCenter = "right";
                                                    categoryAxis.renderer.labels.template.verticalCenter = "middle";
                                                    categoryAxis.renderer.labels.template.rotation = 300;
                                                    
                                                
                                                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                                                var series = chart.series.push(new am4charts.ColumnSeries3D());  
                                                    series.dataFields.categoryX = "category";  
                                                    series.dataFields.valueY = "value";    
                                                    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";   
                                                    chart.cursor = new am4charts.XYCursor();   
                                                    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                                                    series.columns.template.adapter.add("fill", function (fill, target) { 
                                                    	return chart.colors.getIndex(target.dataItem.index);
                                                    }); 
                                                var series2 = chart.series.push(new am4charts.LineSeries());
                                                    series2.name = "category";
                                                    series2.stroke = am4core.color("#CDA2AB");
                                                    series2.strokeWidth = 3;
                                                    series2.dataFields.valueY = "value";
                                                    series2.dataFields.categoryX = "category";  
                                                 
                                                 
                                                    series.columns.template.events.on("hit", function(ev) {
                                                        if (typeof ev.target.dataItem.dataContext.category) {  
                                                             gData = ev.target.dataItem.dataContext.rows;  
                                                            var _month = ev.target.dataItem.dataContext.categorySub; 
                                                             gDDChange   = false;
                                                            _public.showModalDailyRecords(_clientId,_year,_month,_clientName);  
                                                        }
                                                    }, this);     
                                                //Add title  
                                                var title = chart.titles.create();
                                                    title.text = "Monthly Collection"; 
                                                var resetLabel = chart.plotContainer.createChild(am4core.Label);
                                                    resetLabel.text = "[bold]<< Back to yearly data";
                                                    resetLabel.valign = "top";
                                                    resetLabel.x = 20;
                                                    resetLabel.y = 200;
                                                    resetLabel.cursorOverStyle = am4core.MouseCursorStyle.pointer; 
                                                    resetLabel.events.on('hit', function(ev) {
                                                        resetLabel.hide(); 
                                                        gMonthlyClicked=false;  
                                                            var _sqlCode = _code
                                                                ,_params = {
                                                                    client_id:_clientId 
                                                                }
                                                                ,_isColorSet = false
                                                                ,_json = {};
                                                                
                                                            switch (name) { 
                                                                case name:  
                                                                    _category   = "pay_year";
                                                                    _container  = _container;
                                                                    _value      = "total_fare"; 
                                                                break; 
                                                                 
                                                            }   
                                                            _json.container     = _container;
                                                            _json.value         = "total_fare";
                                                            _json.category      = "pay_year";
                                                            _json.isColorSet    = _isColorSet;
                                                            _json.subContainer  = _subContainer;
                                                            _getColor(function(colorSet){
                                                                _getYearlyData(_sqlCode,_params, function(data){ 
                                                                    _json.sqlCode   = _sqlCode;
                                                                    _json.client_id = _clientId;
                                                                    _json.colorSet  = colorSet;
                                                                    _json.data      = data;   
                                                                    _displayBarGraph(_json); 
                                                                });
                                                            });   
                                                    resetLabel.hide(); 
                                                }); 
                                                    resetLabel.show(); 
                                                
                                                
                                            }); 
                                        }; 
                                }
                              }, this);     
                        });
                            
                    };  
                        $.each(_rows,function(i,v){  
                            var _container   = "graph_"+i; 
                            var _gridDataContainer    = "gridGraphData"+i;  
                            var templateString = 
                              ' <div class="col-md-6 col-sm-6 col-12 graphs mt-3 ">'
                             +'     <div class="panel mb-0">'
                             +'         <div class="panel-hdr text-primary">'
                             +'             <h2>'
                             +'                 <span class="mr-2"><i class="far fa-chart-pie"></i></span>'+ v.client_name+''
                             +'             </h2>'
                             +'             <div class="panel-toolbar"> '
                             +'                 <button class="btn btn-panel waves-effect waves-themed far fa-window-minimize" data-action="panel-collapse"  data-offset="0,10" data-original-title="Collapse" data-toggle="tooltip" title="Collapse"></button>'
                             +'                 <button class="btn btn-panel waves-effect waves-themed fas fa-expand" data-action="panel-fullscreen"  data-offset="0,10" data-original-title="Fullscreen" data-toggle="tooltip" title="Expand"></button> '
                             +'             </div>'
                             +'         </div>'
                             +'         <div class="panel-container show">'
                             +'             <div class="panel-content"> ' 
                             +'                 <div class="panel-container collapse show">'
                             +'                     <div class="panel-content">'
                             +'                         <div class="zGraph" id="'+ _container +'"></div>'
                             +'                     </div>'
                             +'                 </div> '
                             +'             </div>'
                             +'         </div>'
                             +'     </div>'
                             +'</div>'
                             +' <div class="col-md-6 col-sm-6 col-12 graphs mt-3 ">'
                             +'     <div class="panel mb-0">'
                             +'         <div class="panel-hdr text-primary">'
                             +'             <h2>'
                             +'                 <span class="mr-2"><i class="far fa-chart-pie"></i></span>'+ v.client_name+''
                             +'             </h2>'
                             +'             <div class="panel-toolbar"> '
                             +'                 <button class="btn btn-panel waves-effect waves-themed far fa-window-minimize" data-action="panel-collapse"  data-offset="0,10" data-original-title="Collapse" data-toggle="tooltip" title="Collapse"></button>'
                             +'                 <button class="btn btn-panel waves-effect waves-themed fas fa-expand" data-action="panel-fullscreen"  data-offset="0,10" data-original-title="Fullscreen" data-toggle="tooltip" title="Expand"></button> '
                             +'             </div>'
                             +'         </div>'
                             +'         <div class="col-12 col-sm-12 col-md-12"> '
                             +'             <div class="row mt-2">  ' 
                             +'                 <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-1">' 
                             +'                     <div class="zGrid" id="'+ _gridDataContainer +'"></div>' 
                             +'                 </div>'
                             +'             </div>'
                             +'         </div>'
                             +'     </div>'
                             +'</div>'
                             ;
                             
                	       $('#newDiv').append(templateString);
                	        
                	        var _params = {
                                client_id:v.client_id 
                            }
                            ,_sqlCode = "P1389" 
                            ,_value = "total_fare"
                            ,_category = "pay_year"
                            ,_isColorSet = false 
                            ,_json = {};  
                           
                            _json.title         = "Yearly Collection";
                            _json.container     = _container;
                            _json.client_id     = v.client_id;
                            _json.client_name   = v.client_name;
                            _json.value         = _value;
                            _json.category      = _category;
                            _json.isColorSet    = _isColorSet;
                            _json.subContainer  = _gridDataContainer;
                            _getColor(function(colorSet){
                                _getYearlyData(_sqlCode,_params, function(data){ 
                                    _json.sqlCode   = _sqlCode;
                                    _json.colorSet  = colorSet;
                                    _json.data      = data;   
                                    _displayBarGraph(_json); 
                                });
                            });
                            
                        });  
                    }
                }); 
       }
        function gridData(o){
            var _data      = [] 
            var _monthName  = function(param){
                var  _month     = [] 
                _month[1]   = "January";
                _month[2]   = "February";
                _month[3]   = "March";
                _month[4]   = "April";
                _month[5]   = "May";
                _month[6]   = "Jun";
                _month[7]   = "July";
                _month[8]   = "August";
                _month[9]   = "September";
                _month[10]  = "October";
                _month[11]  = "November";
                _month[12]  = "December"; 
                for (var i = 0; i < param.length; i++) { 
                    for(var n=1;n<=_month.length-1; n++){ 
                        if(param[i].pay_month === n){   
                             _data.push(
                                {pay_month:_month[n],total_fare:param[i].total_fare}    
                            ); 
                        } 
                    }   
                } 
            }; 
             
            if(gMonthlyClicked===false){  
                $("#"+o.subContainer).dataBind({
                     rows: o.data
                    ,height : 338 
                    ,dataRows : [
                             {text: "Pay Year"                  ,type: "input"          ,name: "pay_year"               ,width: 150     ,style: "text-align:center"}
                            ,{text: "Total Fare"                ,width: 250     ,style: "text-align:right"
                                ,onRender: function(d){
                                    return app.bs({name: "total_fare"         ,type: "input"     ,value: app.svn(d,"total_fare") ? app.svn(d,"total_fare").toMoney() : 0.00 ,style : "text-align:right;padding-right: 0.3rem;"  });
                                } 
                            }    
                    ]
                    ,onComplete : function(o){
                        this.find("input").attr("readonly",true)
                        this.find(".zRow").css("width","100%")
                    }
                });     
            }
            if(gMonthlyClicked===true){ 
                 _monthName(o.data) 
                $("#"+o.subContainer).dataBind({
                     rows: _data
                    ,height : 338 
                    ,dataRows : [
                             {text: "Pay Month"                 ,type: "input"          ,name: "pay_month"              ,width: 150     ,style: "text-align:center"}
                            ,{text: "Total Fare"                                                                        ,width: 250     ,style: "text-align:right"
                                ,onRender: function(d){
                                    return app.bs({name: "total_fare"         ,type: "input"     ,value: app.svn(d,"total_fare") ? app.svn(d,"total_fare").toMoney() : 0.00  ,style : "text-align:right;padding-right: 0.3rem;" });
                                }
                            }    
                    ]
                    ,onComplete : function(o){
                       
                        var _data       = o.data;  
                        var _tot        = {total_fare:0}; 
                        var _total      = {}; 
                        var _h          = ""; 
                        for(var i=0; i < _data.length;i++ ){
                            var _info = _data[i];
                            _tot.total_fare    +=Number(_info.total_fare)|| 0;    
                        }  
                        _h  +=  '<div class="zRow even zTotal" id="colTrip">'  
                            +' <div class="zCell" style="width:150px;text-align:right;">Total Sales</div>'
                            +' <div class="zCell" style="width:250px;text-align:right;padding-right: 0.3rem;">'+_tot.total_fare.toMoney()+'</div>'
                        +'</div>'; 
                         
                        this.find("#table").append(_h); 
                        this.find("input").attr("readonly",true);
                        this.find(".zRow").css("width","100%")
                        
                        setFooterFreezed("#"+o.subContainer)
                    }
                }); 
            } 
        }
        function displayDailyRecords(clientId,year,month,clientName){ 
                $("#gridModalDailyRecords").dataBind({
                 sqlCode        : "P1387" 
                ,height         : 338
                ,parameters     : {client_id:clientId,year:year,month:month}
                ,dataRows       : [
                    {text: "Day"              ,width : 200          ,style:"text-align:center"
                        , onRender      : function(d) {  
                            return  app.svn (d,"pay_day");
                        }
                    } 
                    ,{text: "Total Fare"                ,width : 200     ,style : "text-align:right;"   
                        ,onRender: function(d){
                            return app.bs({name: "total_fare"         ,type: "input"     ,value: app.svn(d,"total_fare") ? app.svn(d,"total_fare").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                        } 
                    } 
                ]
                ,onComplete: function(o){
                    var _data = o.data.rows;  
                    var _tot        = {total_fare:0}; 
                    var _total      = {}; 
                    var _h          = "";
                    for(var i=0; i < _data.length;i++ ){
                        var _info = _data[i];
                        _tot.total_fare    +=Number(_info.total_fare)|| 0;    
                    } 
                    _h  +=  '<div class="zRow even zTotal" id="colTrip">'  
                        +' <div class="zCell" style="width:200px;text-align:right;">Total Sales</div>'
                        +' <div class="zCell" style="width:200px;text-align:right;padding-right: 0.3rem;">'+_tot.total_fare.toMoney()+'</div>'
                    +'</div>'; 
                    this.find("#table").append(_h); 
                    this.find("input").attr("readonly",true); 
                    this.find("#table").css("width","unset");
                    setFooterFreezed("#gridModalDailyRecords")
                    
                }
            });
        } 
        function setFooterFreezed(zGridId){ 
            var _zRows = $(zGridId).find(".zGridPanel.right .zRows");
            var _tableRight   = _zRows.find("#table");
            var _zRowsHeight =   _zRows.height();
            var _everyZrowsHeight = $(".zRow:not(:contains('Total Sales'))");
            var _zTotala = _tableRight.find(".zTotal");
            var _arr = [];
            var _height = 0;
            var _zTotal = _tableRight.find(".zRow:contains('Total Sales')");
            
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
                        if($(window).width() < 1536){
                            _zTotal.css({"top":_zRowsHeight - 38 -( _tableRight.offset().top - _zRows.offset().top) });
                            _zTotala.prev().css({"margin-bottom":40 });
                        }
                        else{
                           _zTotal.css({"top":_zRowsHeight - 20 - ( _tableRight.offset().top - _zRows.offset().top) });
                           _zTotala.prev().css({"margin-bottom":20 });
                        }
                       
                    });
                }else{
                    _zTotal.css({"top": _height});
                    
                }
            }
        }
         
        $("#filterMonth").click(function(){ 
            if(gDDChange===true) displayDailyRecords(gClientId,gYear,gMonth,gClientName);
        });
        $(".btnExport").click(function(){
            var _grid       = "#gridModalDailyRecords" 
                ,_fileName  = gClientName+" "+gMonthName+" "+gYear 
            $(_grid).convertToTable(function(table){
                var _html = table.get(0).outerHTML; 
                zsi.htmlToExcel({
                    fileName: _fileName
                    ,html : _html
                });
            }); 
           
        }); 
    return _public;
})();                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                        