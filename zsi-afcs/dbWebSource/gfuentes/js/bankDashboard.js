        
var db=(function(){ 
        var   bs                    = zsi.bs.ctrl 
            ,_public                = {}
            ,gContainer             = null
            ,gName                  = ""
            ,gClientId              = ""
            ;
            
        
        zsi.ready = function(){   
            $(".page-title").html("Dashboard");
            var _roleId     = app.userInfo.role_id;  
            var _client_id  = app.userInfo.company_id; 
            if(_roleId === 5) {  
                $("#nonBankPersonnel").hide();
                displayBankPersonnelRecords();
            }  
        };
         
        function displayBankPersonnelRecords(){   
            zsi.getData({
                     sqlCode    : "B1448"  
                    ,parameters : {bank_id : app.userInfo.bank_id}
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
                                            id          : i
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
                                        var _clientId       = ev.target.dataItem.dataContext.client_id;
                                        var _year           = ev.target.dataItem.dataContext.category;
                                        var _container      = ev.target.dataItem.dataContext.container;
                                        var _code           = ev.target.dataItem.dataContext.code;
                                        var _clientName     = ev.target.dataItem.dataContext.client_name;  
                                        
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
                                            _getYearlyData(_sqlCode,_params, function(data){
                                                _json.colorSet  = colorSet;
                                                _json.data      = data; 
                                                _json.container = _container;
                                                _json.sqlCode   = _sqlCode;
                                                _displayMonhtlyGraph(_json); 
                                            });
                                        }); 
                                        
                                        var _displayMonhtlyGraph = function(o){  
                                            o.data.sort((a, b) => (a.pay_month > b.pay_month) ? 1 : -1);
                                            var _dataLength = o.data.length;
                                            var _data = [];
                                            var _colorSet = new am4core.ColorSet(); 
                                            var _getCategoryColor = function(category, index){
                                                var _color = $.grep(_colorRows, function(z) {
                                                    return z.field_name.toUpperCase() == category.toUpperCase();
                                                });
                                                return (!isUD(_color[0])) ? _color[0].color_value.toLowerCase() : _colorSet.getIndex(index);
                                            };
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
                                                            var _month = ev.target.dataItem.dataContext.categorySub; 
                                                           displayDailyRecords(_clientId,_year,_month,_clientName);       
                                                        }
                                                    }, this);     
                                                //Add title 
                                                var title = chart.titles.create();
                                                var resetLabel = chart.plotContainer.createChild(am4core.Label);
                                                    resetLabel.text = "[bold]<< Back to yearly data";
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
                                                            _json.title         = name;
                                                            _json.container     = _container;
                                                            _json.value         = "total_fare";
                                                            _json.category      = "pay_year";
                                                            _json.isColorSet    = _isColorSet;  
                                                            _getColor(function(colorSet){
                                                                _getYearlyData(_sqlCode,_params, function(data){ 
                                                                    _json.sqlCode   = _sqlCode;
                                                                    _json.client_id = _clientId;
                                                                    _json.colorSet  = colorSet;
                                                                    _json.data      = data;   
                                                                    _displayBarGraph(_json); 
                                                                });
                                                            }); 
                                                    }; 
                                                    _initCol("Yearly Data");   
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
                           var _container = "graph_"+i;  
                            var templateString = ' <div class="col-md-6 col-sm-6 col-12 graphs mt-3 ">'
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
                             +'</div>';
                	       $('#newDiv').append(templateString);
                	        
                	        var _params = {
                                client_id:v.client_id 
                            }
                            ,_sqlCode = "P1389" 
                            ,_value = "total_fare"
                            ,_category = "pay_year"
                            ,_isColorSet = false
                            ,_name = gName
                            ,_json = {};  
                           
                            _json.title         =  "Collection";
                            _json.container     = _container;
                            _json.client_id     = v.client_id;
                            _json.client_name   = v.client_name;
                            _json.value         = _value;
                            _json.category      = _category;
                            _json.isColorSet    = _isColorSet; 
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
        function displayDailyRecords(clientId,year,month,clientName){ 
            var _$mdl = $('#modalDailyRecords');
            var _ctr = 1;
                _$mdl.find(".modal-title").text(clientName); 
                _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
                
                $("#gridModalDailyRecords").dataBind({
                 sqlCode        : "P1387" 
                ,height         : $(window).height() - 300
                ,parameters     : {client_id:clientId,year:year,month:month}
                ,dataRows       : [
                    {text:"No."                                       ,width:60         ,style:"text-align:center"
                            ,onRender : function(d){
                            return _ctr++;
                        }
                     }
                    ,{text: "Payment Day"              ,width : 100         
                        ,onRender: function(d){
                            return app.bs({name: "pay_day"         ,type: "input"     ,value: app.svn(d,"pay_day")   ,style : "text-align:center;"});
                        }
                    } 
                    ,{text: "Total Fare"                ,width : 120     ,style : "text-align:right;"   
                        ,onRender: function(d){
                            return app.bs({name: "total_fare"         ,type: "input"     ,value: app.svn(d,"total_fare") ? app.svn(d,"total_fare").toMoney() : 0.00    ,style : "text-align:right;padding-right: 0.3rem;" });
                        } 
                    } 
                ]
                ,onComplete: function(o){
                    $("[name='cbFilter1']").setCheckEvent("#gridRoutes input[name='cb']");
                    var _zRow = this.find(".zRow");
                    _zRow.find("input").attr("disabled",true);
                }
            });
        }
        
    return _public;
})();                                                                                                    
                                                                                                                                                                                                                                                                                                                                                  