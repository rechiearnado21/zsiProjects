 var th = (function(){ 
    var _pub                = {}
        ,bs                 = zsi.bs.ctrl
        ,gCollapse          = false
        ,gMonthName         = ""
    ;
    zsi.ready = function(){
        $(".page-title").html("Transaction History"); 
        $(".gridCollapse").hide();
        displayTopEarners();
        dropdown();  
    }; 
     
    function dropdown(){
        var monthName = function(param){
            var _month     = [] ;
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
        
        $("#year").dataBind({
             sqlCode : "D1494"
            ,text    : "year"
            ,value   : "year"
            ,onChange: function(){
                var _year = this.val();
                $("#month").dataBind({
                     sqlCode    : "D1493"
                    ,parameters : {year:_year}
                    ,text       : "month"
                    ,value      : "month"
                    ,onChange   : function(){
                        gCollapse=true;
                        if(this.val()===""){
                            gCollapse=false;
                        }else monthName(this.val());
                        
                        
                    }
                    ,onComplete : function(){
                        if(this.val()===""){
                            gCollapse=false;
                        }else monthName(this.val());
                    }
                });
            }
            ,onComplete : function(){ }
        }); 
    }  
    function displayTopEarners(year,month){  
        zsi.getData({
             sqlCode    : "T1487" 
             ,parameters     : {
                        client_id  : app.userInfo.company_id
                        ,year      : year?year:""
                        ,month     : month?month:""  
            }
            ,onComplete : function(d) {
                var _rows= d.rows;
                _rows.sort((a, b) => (a.total_collection_amt < b.total_collection_amt) ? 1 : -1);
                $("#gridTopEarners").dataBind({
                     rows           : _rows
                    ,height         : $(window).height() - 600
                    ,blankRowsLimit : 0
                    ,dataRows       : [
                          {text: "Driver"                ,width : 150    ,style : "text-align:left;"   
                            ,onRender: function(d){
                                return  app.bs({name: "driver_name"          ,value: app.svn(d,"driver_name")  });
                                
                            } 
                          }  
                         ,{text: "Total Collections"                ,width : 120    ,style : "text-align:right;"   
                            ,onRender: function(d){
                                return  app.bs({name: "total_collection_amt"          ,value: app.svn(d,"total_collection_amt").toCommaSeparatedDecimal()         ,style : "text-align:right;padding-right: 0.3rem;"});
                                
                            } 
                        } 
                    ]
                    ,onComplete: function(o){
                        var _this   = this; 
                        getTimeDataSorting(_rows); 
                    }
                });
            }
        });
        
    }   
    function getTimeDataSorting(data){  
        var _rows = data;  
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
                        _json.category = v.driver_name;
                        _json.value = v.total_collection_amt; 
                        _json.driver_id = v.driver_id
                        _json.color = _colorSet.next();  
                    _data.push(_json);
                    
                });
            
            };
            _setData();  
            am4core.ready(function() { 
                 var chart = am4core.create(o.container, am4charts.XYChart3D); 
                chart.hiddenState.properties.opacity = 0; // this creates initial fade-in 
                chart.paddingBottom = 30;

                // Set data  
                var generateChartData = function() { 
                    var chartData       = [] 
                        ,_dataLength    = _data.length;
                        
                    for (var i = 0; i < _dataLength; i++) {  
                        chartData.push({
                            category: _data[i].category,
                            value: _data[i].value,
                            src : base_url + "dbimagebyclient/E1411/" + app.userInfo.company_id + "/" + _data[i].driver_id,
                            color: _data[i].color,
                            id: i
                          }); 
                           
                        } 
                        
                    return chartData; 
                }; 
                // Add data
                chart.data = generateChartData(); 
                chart.padding(40, 40, 40, 40);
                chart.scrollbarX = new am4core.Scrollbar(); 
                chart.scrollbarY = new am4core.Scrollbar(); 
               // Add and configure Series    
                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                    categoryAxis.dataFields.category = "category";
                    categoryAxis.renderer.grid.template.strokeOpacity = 0;
                    categoryAxis.renderer.minGridDistance = 10;
                    categoryAxis.renderer.labels.template.dy = 35;
                    categoryAxis.renderer.tooltip.dy = 35;
               
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                    valueAxis.renderer.inside = true;
                    valueAxis.renderer.labels.template.fillOpacity = 0.3;
                    valueAxis.renderer.grid.template.strokeOpacity = 0;
                    valueAxis.min = 0;
                    valueAxis.cursorTooltipEnabled = false;
                    valueAxis.renderer.baseGrid.strokeOpacity = 0;
                    
                var series = chart.series.push(new am4charts.ColumnSeries());
                    series.dataFields.valueY = "value";
                    series.dataFields.categoryX = "category";
                    series.tooltipText = "{valueY.value}";
                    series.tooltip.pointerOrientation = "vertical";
                    series.tooltip.dy = - 6;
                    series.columnsContainer.zIndex = 100;
                    
                    var columnTemplate = series.columns.template;
                    columnTemplate.width = am4core.percent(50);
                    columnTemplate.maxWidth = 66;
                    columnTemplate.column.cornerRadius(60, 60, 10, 10);
                    columnTemplate.strokeOpacity = 0;

                    series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueY", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
                    series.mainContainer.mask = undefined;
                    
                var cursor = new am4charts.XYCursor();
                    chart.cursor = cursor;
                    cursor.lineX.disabled = true;
                    cursor.lineY.disabled = true;
                    cursor.behavior = "none";
                    
                var bullet = columnTemplate.createChild(am4charts.CircleBullet);
                    bullet.circle.radius = 30;
                    bullet.valign = "bottom";
                    bullet.align = "center";
                    bullet.isMeasured = true;
                    bullet.mouseEnabled = false;
                    bullet.verticalCenter = "bottom";
                    bullet.interactionsEnabled = false;
                    
                var hoverState = bullet.states.create("hover");
                var outlineCircle = bullet.createChild(am4core.Circle);
                    outlineCircle.adapter.add("radius", function (radius, target) {
                        var circleBullet = target.parent;
                        return circleBullet.circle.pixelRadius + 10;
                    })
                    
                    var image = bullet.createChild(am4core.Image);
                    image.width = 60;
                    image.height = 60;
                    image.horizontalCenter = "middle";
                    image.verticalCenter = "middle";
                    image.propertyFields.href = "src";
                    
                    image.adapter.add("mask", function (mask, target) {
                        var circleBullet = target.parent;
                        return circleBullet.circle;
                    })
                    
                    var previousBullet;
                    chart.cursor.events.on("cursorpositionchanged", function (event) {
                        var dataItem = series.tooltipDataItem;
                    
                        if (dataItem.column) {
                            var bullet = dataItem.column.children.getIndex(1);
                    
                            if (previousBullet && previousBullet != bullet) {
                                previousBullet.isHover = false;
                            }
                    
                            if (previousBullet != bullet) {
                    
                                var hs = bullet.states.getKey("hover");
                                hs.properties.dy = -bullet.parent.pixelHeight + 30;
                                bullet.isHover = true;
                    
                                previousBullet = bullet;
                            }
                        }
                    })
     
            });
          
        }; 
        var _container = "graphTopEarners"
            ,_value = "total_collection_amt"
            ,_category = "vehicle_plate_no"
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
     
    $("#btnFilterEarners").click(function(){
        var _year  = $.trim($("#year").val());
        var _month = $.trim($("#month").val()); 
        
        if(gCollapse===true){
            $("#hdrTopEarners").html("Top Earners of "+gMonthName+" "+_year);
            $(".gridCollapse").show();
            displayTopEarners(_year,_month);
        }else  $(".gridCollapse").hide();
        
      
    });
     
    return _pub;
})();               










     