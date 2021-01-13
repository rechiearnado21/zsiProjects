var db=(function(){ 
        $(".page-title").html("Dashboard");    
        $('[data-toggle="tooltip"]').tooltip();       
       
        function displayCharts(){
          var gParams = [];
             
          am4core.useTheme(am4themes_animated);
            // Enable queuing 
            am4core.options.queue = true;
            am4core.options.onlyShowOnViewport = true;     
            var _colors = [];
            var _colorRows = [];
            var _getData = function(sqlCode,params, cb){  
                console.log("sqlcode",sqlCode);
                var _yrlyParams = params.year
                if(sqlCode ==="P1388"){  
                    gParams.push({
                        yearly: _yrlyParams
                    }); 
                } 
                zsi.getData({
                     sqlCode : sqlCode 
                    ,parameters : params
                    ,onComplete : function(d) {
                        cb(d.rows); 
                        
                    }
                });
            };
            
            var _dailyData = function(sqlCode,params, cb){ 
                var _params = {
                   client_id:app.userInfo.company_id
                   ,month: params.month 
                   ,year:params.year
                };
                zsi.getData({
                         sqlCode    : "P1387"
                        ,parameters : _params
                        ,onComplete : function(d) { 
                          cb(d.rows);   
                    }
                });
            }
            
            var _getColor = function(cb){ 
                var _colorSet = new am4core.ColorSet();
                    _colors = _colorSet;  
                    cb(_colors);
            }; 
            
            var _displayBarGraphDaily = function(o){ 
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
                            _json.category = v.pay_day;
                            _json.value = v.total_fare;
                            _json.color = _colorSet.next();  
                        _data.push(_json); 
                    });
                
                };
                _setData();  
                am4core.ready(function() { 
                    var chart = am4core.create(o.container, am4charts.XYChart); 
                    chart.numberFormatter.numberFormat = '###';
                    // Set data
                    var _platform = ""; 
                    var selected;
                    var _generateChartData = function() {
                        var chartData = [];  
                            
                        for (var i = 0; i < _data.length; i++) {  
                            if (i == selected) {
                              for (var x = 0; x < _data[i].subs.length; x++) { 
                                chartData.push({
                                  category: _data[i].subs[x].category,
                                  value: _data[i].subs[x].value,
                                  color: _data[i].subs[x].color, 
                                });
                              }
                            }
                            else {  
                                chartData.push({
                                    category: _data[i].category,
                                    value: _data[i].value,
                                    color: _data[i].color,
                                    id: i
                                  }); 
                                }
                             
                        }
                         
                        return chartData;
                    };
                    
                    // Add data
                    chart.data = _generateChartData(); 
                   // Add and configure Series    
                    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                        categoryAxis.dataFields.category = "category";
                        categoryAxis.renderer.minGridDistance = 20; 
                          
                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                    var series = chart.series.push(new am4charts.ColumnSeries());  
                        series.dataFields.categoryX = "category"; 
                        series.dataFields.valueY = "value";    
                        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";  
                        chart.cursor = new am4charts.XYCursor();   
                        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                        series.columns.template.adapter.add("fill", function (fill, target) { 
                        	return chart.colors.getIndex(target.dataItem.index);
                        }); 
                    var title = chart.titles.create();
                        title.text = "Month of "+gCtgry ;
                    var resetLabel = chart.plotContainer.createChild(am4core.Label);
                        resetLabel.text = "[bold]<<";
                        resetLabel.valign = "top";
                        resetLabel.x = 20;
                        resetLabel.y = 200;
                        resetLabel.cursorOverStyle = am4core.MouseCursorStyle.pointer; 
                        resetLabel.events.on('hit', function(ev) {
                            resetLabel.hide();
                            title.text = "Monthly Data"
                          // ev.target.baseSprite.data = categoryAxis.renderer.grid.template.location = 0;  
                            console.log("ev.target.baseSprite",ev.target.baseSprite)
                            resetLabel.hide();
                        });
                        
                         resetLabel.show();
                });
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
                            if(o.category!=="pay_month"){
                                _json.category = v.pay_year;
                                _json.value = v.total_fare;
                                _json.color = _colorSet.next();  
                            }else{
                                _json.category = v.pay_month;
                                _json.value = v.total_fare;
                                _json.color = _colorSet.next(); 
                                
                            }
                        _data.push(_json);
                        
                    });
                
                };
                _setData();  
                am4core.ready(function() { 
                    var chart = am4core.create(o.container, am4charts.XYChart); 
                    chart.numberFormatter.numberFormat = '###';
                    // Set data
                    var _platform = ""; 
                    var selected;
                    var generateChartData = function() {
                        var chartData = []; 
                        var _monthlyCtgry = ""; 
                            
                        for (var i = 0; i < _data.length; i++) {  
                            if (i == selected) {
                              for (var x = 0; x < _data[i].subs.length; x++) { 
                                chartData.push({
                                  category: _data[i].subs[x].category,
                                  value: _data[i].subs[x].value,
                                  color: _data[i].subs[x].color, 
                                });
                              }
                            } else { 
                             if(o.category==="pay_month"){  
                                if(_data[i].category === 1)  _monthlyCtgry= "January"
                                if(_data[i].category === 2)  _monthlyCtgry= "February"
                                if(_data[i].category === 3)  _monthlyCtgry= "March"
                                if(_data[i].category === 4)  _monthlyCtgry= "April"
                                if(_data[i].category === 5)  _monthlyCtgry= "May"
                                if(_data[i].category === 6)  _monthlyCtgry= "June"
                                if(_data[i].category === 7)  _monthlyCtgry= "July"
                                if(_data[i].category === 8)  _monthlyCtgry= "August"
                                if(_data[i].category === 9)  _monthlyCtgry= "September"
                                if(_data[i].category === 10) _monthlyCtgry = "October"
                                if(_data[i].category === 11) _monthlyCtgry = "November"
                                if(_data[i].category === 12) _monthlyCtgry = "December" 
                                chartData.push({
                                    category    : _monthlyCtgry,
                                    categorySub : _data[i].category,
                                    container   : o.container,
                                    parameters  : o.params,
                                    value       : _data[i].value,
                                    color       : _data[i].color,
                                    id: i
                                }); 
                            
                            }
                            else if(o.category==="pay_day"){  
                                chartData.push({
                                    category    : o.pay_day,   
                                    value       : _data[i].value,
                                    color       : _data[i].color,
                                    id: i
                                }); 
                            }
                            else{ 
                                chartData.push({
                                    category: _data[i].category,
                                    value: _data[i].value,
                                    color: _data[i].color,
                                    id: i
                                  }); 
                                }
                            }
                        }
                         
                        return chartData;
                    };
                    
                    // Add data
                    chart.data = generateChartData(); 
                   // Add and configure Series    
                    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());  
                        categoryAxis.dataFields.category = "category";
                        categoryAxis.renderer.minGridDistance = 20; 
                        /*categoryAxis.label.text = "{valueY.totalPercent.formatNumber('#.##')}%";*/ 
                    
                    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());  
                    var series = chart.series.push(new am4charts.ColumnSeries());  
                        series.dataFields.categoryX = "category"; 
                        series.dataFields.valueY = "value";   
                        //series.labels.template.text = "{category}: {value.percent.formatNumber('###.00')}%";
                        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]"; 
                        //valueLabel.label.text = "{valueY.category.formatNumber('#.##')}%";
                        
                          
                        
                        chart.cursor = new am4charts.XYCursor();   
                        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
                        series.columns.template.adapter.add("fill", function (fill, target) { 
                        	return chart.colors.getIndex(target.dataItem.index);
                        });
                    var title = chart.titles.create();
                        title.text = "Yearly Data";
                            
                    if(o.category==="pay_month"){ 
                        title.text = 'Monthly Data ';
                            series.columns.template.events.on("hit", function(ev) {
                                if (typeof ev.target.dataItem.dataContext.category) { 
                                var _catgry     = ev.target.dataItem.dataContext.category;
                                var _month      = ev.target.dataItem.dataContext.categorySub;
                                var _yearly     = ev.target.dataItem.dataContext.parameters;
                                var _container  = ev.target.dataItem.dataContext.container;
                                
                                /*var _sqlCode = "P1387"
                                    ,_params = {
                                        client_id   :app.userInfo.company_id 
                                       ,month       :_month
                                       ,year        :_yearly
                                    }  
                                    ,_value = "total_fare"
                                    ,_category = "pay_day"
                                    ,_isColorSet = false
                                    ,_json = {};
                                window.category = _catgry 
                                _getColor(function(colorSet){
                                    _getData(_sqlCode,_params, function(data){
                                        _json.colorSet = colorSet;
                                        _json.data = data;
                                        _json.category = _category;  
                                        _json.container = _container
                                        _displayBarGraph(_json); 
                                    });
                                });*/
                                 var _sqlCode = "P1387"
                                    ,_params = {
                                        client_id   :app.userInfo.company_id 
                                       ,month       :_month
                                       ,year        :_yearly
                                    }  
                                    ,_value = "total_fare"
                                    ,_category = "pay_day"
                                    ,_isColorSet = false
                                    ,_json = {};
                                    gCtgry = _catgry;
                                _getColor(function(colorSet){
                                    _getData(_sqlCode,_params, function(data){
                                        _json.colorSet = colorSet;
                                        _json.data = data;
                                        _json.category = _category;  
                                        _json.container = _container
                                        _displayBarGraphDaily(_json); 
                                    });
                                });

  
                                // update the chart title
                              //  ev.target.baseSprite.titles.getIndex(0).text = 'Month of ' + _catgry;

                                // set the monthly data for the clicked monthv.target.dataItem.dataContext)  
                            }
                          }, this);
                    }
                });
            };
             
            var _init = function(name){
                var _sqlCode = "P1389"
                    ,_params = {
                        client_id:app.userInfo.company_id 
                    }
                    ,_container = "graph1"
                    ,_value = "total_fare"
                    ,_category = "pay_year"
                    ,_isColorSet = false
                    ,_json = {};
                    
                switch (name) {
                    case "2020 Monthly Collection":
                        _sqlCode = "P1388";
                        _category = "pay_month";
                        _container = "graph2";
                        _value = "total_fare";
                        _params = {
                            client_id:app.userInfo.company_id
                            ,year : 2020
                        };
                        break; 
                    case "2019 Monthly Collection":
                        _sqlCode = "P1388";
                        _category = "pay_month";
                        _container = "graph3";
                        _value = "total_fare";
                        _params = {
                            client_id:app.userInfo.company_id
                            ,year : 2019
                        };
                        break; 
                    case "2018 Monthly Collection":
                        _sqlCode = "P1388";
                        _category = "pay_month";
                        _container = "graph4";
                        _value = "total_fare";
                        _params = {
                            client_id:app.userInfo.company_id
                            ,year : 2018
                        };
                        break;
                    case "2017 Monthly Collection":
                        _sqlCode = "P1388";
                        _category = "pay_month";
                        _container = "graph5";
                        _value = "total_fare";
                        _params = {
                            client_id:app.userInfo.company_id
                            ,year : 2017
                        };
                        break; 
                    case "2016 Monthly Collection":
                        _sqlCode = "P1388";
                        _category = "pay_month";
                        _container = "graph6";
                        _value = "total_fare";
                        _params = {
                            client_id:app.userInfo.company_id
                            ,year : 2016
                        };
                        break; 
                }
                    
                _json.title = name;
                _json.container = _container;
                _json.value = _value;
                _json.category = _category;
                _json.isColorSet = _isColorSet; 
                
                
                _getColor(function(colorSet){
                    _getData(_sqlCode,_params, function(data){
                        _json.colorSet = colorSet;
                        _json.data = data;
                        _json.category; 
                        _json.title = name; 
                        if(_sqlCode==="P1388")_json.params =_params.year; 
                        _displayBarGraph(_json); 
                    });
                });
                
            }; 
            _init("Collection"); 
            _init("2020 Monthly Collection"); 
            _init("2019 Monthly Collection");
            _init("2018 Monthly Collection"); 
            _init("2017 Monthly Collection");
            _init("2016 Monthly Collection");  
           // _init("Collection"); 
               
        }
        displayCharts();  
     
})();           
           
           
           
                                                                                                                    
                                                                                                                                                                                                                                                                                                     