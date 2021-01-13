 var vehicledriverpao = (function(){
    var   bs                    = zsi.bs.ctrl 
        ,svn                    = zsi.setValIfNull 
        ,bsButton               = zsi.bs.button
        ,tblName                = "tblusers"
        ,_public                = {}
        , gTw                   = null
        , mdlAddNewDriverPao    = "modalWindowAddNewDriverPao"
        ,gCompanyId             = app.userInfo.company_id
        ,gSubTabName            = ""
        ,gSqlCode               = ""
        ,gActiveTab             = ""
        ,gFullName              = ""
        ,gDataRows
        ,gClientName
        ,gGridId                = ""
        ,gId                    = 0
        ,gPlateNo
        ,gVehicleId             = null
        ,gisDriver              = ""
        ,gisPao                 = ""
        ,gRouteId               = null
        ,gDataDD
        ,gtoKm                  = null
        ,gfromKm                = null
    ;
   
    zsi.ready = function(){
        $(".page-title").html("Vehicle Driver/PAO");
        gTw = new zsi.easyJsTemplateWriter();
        getTemplates();
        displayRoutes();
        if(app.userInfo.company_id === 0){
            $("#companyLogo").attr({src: base_url + 'img/logo.png'});
            $("#logoImg").attr({src: base_url + 'img/logo.png'});
        }
        else {
            $("#companyLogo").attr({src: base_url + 'dbimage/ref-0001/client_id/' + app.userInfo.company_id + "/company_logo" }); 
            $("#logoImg").attr({src: base_url + 'dbimage/ref-0001/client_id/' + app.userInfo.company_id + "/company_logo" }); 
        }
        zsi.getData({
             sqlCode    : "G1413" 
            ,parameters  : {client_id: app.userInfo.company_id} 
            ,onComplete : function(d) {
                var _hashKey = d.rows[0].hash_key;
                var _clientName = d.rows[0].client_name;
                gClientName = _clientName;
                $("#clientName").text("");
                $("#clientName").text(_clientName);
                $("#clientQRCode").text("");
                if(_hashKey){ var qrcode = new QRCode($("#clientQRCode").get(0),{width:150,height:150}).makeCode(_hashKey);}
                $("#clientQRCode").attr("title","");
                
            }
        });
        $("#route_id").select2({placeholder: "ROUTE",allowClear: true});
        // Install input filters.
         
        $("#fareComputationModal").find('input').keypress(function(event) {
            if (((event.which !== 46 || (event.which === 46 && $(this).val() === '')) ||
                    $(this).val().indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        }).on('paste', function(event) {
            event.preventDefault();
        });
    }; 
    
    gSubTabName = $.trim($(".sub-nav-tabs-drivers").find(".nav-link.active").text());  
    gActiveTab = $.trim($(".main-nav-tabs").find(".nav-link.active").text()); 
    
    $("#searchVal").attr('placeholder','Search vehicles...');
    $("#searchDiv").removeClass("hide");
    $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
        gActiveTab = $.trim($(e.target).text());
        
        if(gActiveTab === "PAO"){
            gRoleId = 2; 
            gPosition = 4;  
            $("#searchDiv").addClass("hide");
            gGridId = "#gridPAO";
            displayPAO();
            
        }
        if(gActiveTab === "Drivers"){
            gPosition = 3;
            gRoleId = 1;     
            $("#searchVal").attr('placeholder','Search drivers...');
            $("#searchDiv").removeClass("hide");
            gGridId = "#gridDriversLicensed";
            displayDrivers();
        }
        if(gActiveTab === "Vehicles"){
            $("#searchVal").attr('placeholder','Search vehicles...');
            $("#searchDiv").removeClass("hide");
            $("#route_id").dataBind({
                sqlCode      : "D1425"
               ,parameters   : {client_id: app.userInfo.company_id}
               ,text         : "route"
               ,value        : "route_id"
            });
            displayVehicles(); 
        }
        if(gActiveTab === "Devices"){
            $("#searchVal").attr('placeholder','Search vehicles...');
            $("#searchDiv").removeClass("hide"); 
            displayDevices();
        }
    });  
    $(".sub-nav-tabs-drivers").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());
        displayDrivers();   
    });  
    $(".nav-tab-vhs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){ 
        gSubTabName = $.trim($(e.target).text());  
        displayVehicles();   
    }); 
    $("#route_no").select2({placeholder: "ROUTE NO",allowClear: true, dropdownParent: $("#modalRouteNos")});
    $("#route_id2").select2({placeholder: "ROUTE",allowClear: true, dropdownParent: $("#modalRouteNos")});
    
    _public.submitNewDriverPao              =   function(){
        var _$grid = $("#gridNewDriverPao");
        if( zsi.form.checkMandatory()!==true) return false;
        var res = isRequiredInputFound("#gridNewDriverPao");
        if(!res.result){
            _$grid.jsonSubmit({
                 procedure  : "driver_pao_upd"
                 ,optionalItems: ["is_driver","is_pao","is_active","gender"]
                 ,onComplete : function (data) {
                     if(data.isSuccess===true) zsi.form.showAlert("alert");
                     $("#gridDriversLicensed").trigger("refresh");
                     $("#gridPAO").trigger("refresh");
                     displayAddNewDriverPao(gisDriver,gisPao);
                }
            });         
        } else {
            alert("Enter " + res.inputName);
        }
        
    };
    _public.showModalViewPaoImage           =   function (eL,id,firstName,lastName,middleName,nameSuffix,hashKey){ 
        var _frm = $("#frm_modalPao");
        var _middleName = middleName? middleName + "." + " ": "";
        var _nameSuffix = nameSuffix? " " + nameSuffix + "." : "";
        gFullName = firstName + " " + _middleName + lastName + _nameSuffix;
        
        
        _frm.find("#nameId").text(gFullName);
        _frm.find("#qrcodeDriverPao").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcodeDriverPao").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcodeDriverPao").attr("title","");
        $('#modalPao').modal({ show: true, keyboard: false, backdrop: 'static' });
        
        
    };  
    _public.showModalViewInfoVehicles       =   function (eL,id,vehiclePlateNo,vehicleType,hashKey,fileName) {
        var _frm = $("#frm_modalVehicleId");
        _frm.find("#plateNoId").find("u").text(vehiclePlateNo);
        _frm.find("#qrcodeVehicles").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcodeVehicles").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcodeVehicles").attr("title","");
        $('#modalVehicleId').modal({ show: true, keyboard: false, backdrop: 'static' });
        
    }; 
    _public.showModalRouteNos               =   function(eL,id) {
        var _$modal = $("#modalRouteNos");
        var _routeCode = $(eL).closest(".zRow").find('[name="route_id"] option[value="'+id+'"]').text();
        _$modal.find(".modal-title").text("Route » " + _routeCode ) ;
        gRouteId = id;
        displayRouteNos(id);
        $("#route_id2").dataBind({
            sqlCode      : "D1425"
           ,parameters   : {client_id: app.userInfo.company_id}
           ,text         : "route"
           ,value        : "route_id"
           ,onComplete   : function(){
               $(this).val(id).trigger("change");
           }
        });
        _$modal.modal({ show: true, keyboard: false, backdrop: 'static' });
        
    };
    _public.showModalDriverPaoAssignment    =   function(eL,id,plateNo) {
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear();
        var _$modal = $("#modalDriverPaoAssignment");
        gVehicleId = id;
        _$modal.find("#history_frm").datepicker({
             autoclose : true 
            ,endDate: yesterday
            ,todayHighlight: false 
        }).datepicker("setDate", yesterday).on("changeDate",function(e){
            _$modal.find("#history_to").datepicker({
                autoclose: true
            }).datepicker("setStartDate",e.date);
            _$modal.find("#history_to").datepicker().datepicker("setDate",e.date);
        });
        _$modal.find("#history_to").datepicker({
              autoclose : true
             ,endDate: yesterday
             ,startDate : yesterday
        }).datepicker("setDate",yesterday);
        $("#filterAssDriverPaoDate").datepicker({
             autoclose : false
            ,todayHighlight : true
            ,startDate : d
        }).datepicker("setDate", "0");
        
        _$modal.find(".modal-title").text("Vehicle Plate Number » " + plateNo );
        displayAssignDriverAndPao(id);
        _$modal.modal({ show: true, keyboard: false, backdrop: 'static' });
        
    };
    _public.showModalViewQR                 =   function (eL,hashKey,serialNo) {
        var _frm = $("#frm_modalQR");
        _frm.find("#serialNo").find("u").text(serialNo);
        _frm.find("#qrcode").text("");
        if(hashKey){ var qrcode = new QRCode(_frm.find("#qrcode").get(0),{width:150,height:150}).makeCode(hashKey);}
        _frm.find("#qrcode").attr("title","");
        
        $('#modalViewQR').modal({ show: true, keyboard: false, backdrop: 'static' });
    };
    _public.displayBaseComputation          =   function () {
        var _frm = $("#fareComputationModal");  
        _frm.modal({ show: true, keyboard: false, backdrop: 'static' });
        filterDropDown(gDataDD);
    }; 
     
    function filterDropDown(data){
        var _base_fare          =  $('#base_fare').val()
            ,_base_km            = $('#base_km').val()
            ,_succeeding_km_fare = $('#succeding_km_fare').val()
            ,_from_km            = $('#from_km').val()
            ,_to_km              = $('#to_km').val()
            ,_total_km           =  null
            ,_succeeding_km      =  null
            ,_succeeding_fare    =  null
            ,_total_fare         =  null
            ,totalKm = function(frm,to){ 
                gfromKm = frm; 
                gtoKm   = to;
                _total_km = to-frm; 
                $('#total_km').html(Math.round(_total_km)); 
            }
            ,succeedingKm = function(total_km,base_km){ 
                _succeeding_km = total_km-base_km;  
                if(isNaN(_succeeding_km)){
                    _succeeding_km=0;
                } 
                $('#succeeding_km').html(Math.round(_succeeding_km)); 
            }
            ,succeedingFare = function(_succeeding_km,km_fare){ 
                _succeeding_fare = parseFloat(_succeeding_km) * parseFloat(km_fare); 
                if(isNaN(_succeeding_fare)){
                    _succeeding_fare=0;
                }
                $('#succeeding_fare').html(Math.round(_succeeding_fare)); 
            } 
            ,totalFare = function(baseFare,succeedingFare){ 
                _total_fare = parseFloat(baseFare) + parseFloat(succeedingFare);  
                if(isNaN(_total_fare)){
                    _total_fare=0;
                } 
                
                $('#total_fare').html(Math.round(_total_fare)); 
            }
            ,percentage = function(percent,total){ 
                $("#total_discount").html(Math.round(((percent/ 100) * total)));
                  
            };
            
        $("select[id='from_location']").fillSelect({	                
             data   : data 	                   
            ,text   : "location"
            ,value  : "distance_km"  
            ,onChange : function(){   
                _from_km = $(this).val();  
                totalKm(_from_km,_to_km); 
                succeedingKm(_total_km,_base_km); 
                succeedingFare(_succeeding_km,_succeeding_km_fare) ;
                totalFare(_base_fare,_succeeding_fare) ;
                $('#from_km').html(_from_km);
                $("select[id='to_location']").removeAttr("disabled"); 
            }
            ,onComplete : function(){
               $("select[id='from_location']").val(gfromKm );
            }
        });  
        $("select[id='to_location']").fillSelect({	                
             data   : data 	                   
            ,text   : "location"
            ,value  : "distance_km"
            ,selectedValue : _to_km
            ,onChange : function(){ 
                _to_km = $(this).val();  
                totalKm(_from_km,_to_km); 
                succeedingKm(_total_km,_base_km) ;
                succeedingFare(_succeeding_km,_succeeding_km_fare) ;
                totalFare(_base_fare,_succeeding_fare) ;
                $('#to_km').html(_to_km); 
            }
            ,onComplete : function(){
               $("select[id='to_location']").val(gtoKm );
            }
        });  
        $("#base_fare").on("keyup change",function(){
            _base_fare = $(this).val();
            totalFare(_base_fare,_succeeding_fare) ;
            succeedingFare(_succeeding_km,_succeeding_km_fare);
        });
        $("#base_km").on("keyup change",function(){ 
            _base_km = $(this).val();
            succeedingKm(_total_km,_base_km) ;
            succeedingFare(_succeeding_km,_succeeding_km_fare) ;
            totalFare(_base_fare,_succeeding_fare);
        });
        $("#succeding_km_fare").on("keyup change",function(){ 
            _succeeding_km_fare = $(this).val();
            succeedingFare(_succeeding_km,_succeeding_km_fare) ;
            totalFare(_base_fare,_succeeding_fare);
        });  
        $("#btnCalculate").click(function(){ 
            var _discountValue = $("#discount").val();
            percentage(_discountValue,_total_fare);
        });
    }
    function getTemplates(){
        new zsi.easyJsTemplateWriter($("#generatedComponents").empty())
        .bsModalBox({
              id        : mdlAddNewDriverPao
            , sizeAttr  : "modal-full"
            , title     : "New User"
            , body      : gTw.new().modalBodyAddDriverPao({grid:"gridNewDriverPao",onClickSaveNewDriverPao:"vehicledriverpao.submitNewDriverPao();"}).html()  
        });
    
    } 
    function toExcelFormat(html){
        return "<html><head><meta charset='utf-8' /><style> table, td {border:thin solid black}table {border-collapse:collapse;font-family:Tahoma;font-size:10pt;}</style></head><body>"
             + html + "</body></html>";
    }
    function getFilters(){ 
        var  _searchVal     = $.trim($("#searchVal").val()); 
        return {
             client_id  : gCompanyId
            ,searchVal  : _searchVal
        };
    }
    function printQR(id){
        $('#myModal').modal('hide');
        $('#myModalPrintAssDriverPAO').modal('hide');
        setTimeout(function(){ 
            var _win = window.open('/');
            var _objDoc = _win.document;
            _objDoc.write('<html><body style="text-align:center;font-family: Arial, Helvetica, sans-serif;">');
            _objDoc.write('<div style="justify-content:center;display:flex;">');
            _objDoc.write( document.getElementById(id).innerHTML ); 
            _objDoc.write('</div>');
            _objDoc.write('</body></html>');
            _objDoc.close();
            _win.focus();
            _win.print();
            _win.close(); 
            
            return true;
        }, 500);
    }
    function displayRoutes(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridRoutes").dataBind({
             sqlCode        : "C1422"
            ,height         : $(window).height() - 460
            ,blankRowsLimit : 5
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"client_route_id"       ,type:"hidden"      ,value: app.svn(d,"client_route_id")}) 
                                 + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"client_id"             ,type:"hidden"      ,value: app.userInfo.company_id})
                                 + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                        }
                }
                ,{text:"Route No."                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='Route Nos' onclick='vehicledriverpao.showModalRouteNos(this,"+ app.svn (d,"route_id") +")'><i class='fas fa-list'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Route"                             ,name:"route_id"               ,type:"select"   ,width : 500   ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter1']").setCheckEvent("#gridRoutes input[name='cb']");
                var _zRow = this.find(".zRow");
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "D1269"
                   ,text         : "route"
                   ,value        : "route_id"
                });
            }
        });
    }
    function displayRouteNos(id){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridRouteNos").dataBind({
             sqlCode        : "R1427" 
            ,parameters     : {route_id:id}
            ,height         : 350         
            ,dataRows       : [
                {text: "Route No."                 ,width : 70   ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_no_id"             ,type:"hidden"      ,value: app.svn(d,"route_no_id")})
                                 + app.bs({name:"route_id"                ,type:"hidden"      ,value: id}) 
                                 + app.bs({name:"route_no"                ,type:"input"      ,value: app.svn(d,"route_no")}) ;
                                 + app.bs({name:"is_edited"               ,type:"hidden"      ,value: app.svn(d,"is_edited")});
                                 
                        }
                }
                ,{ text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                }
                ,{text: "Route Name"                      ,name:"route_name"               ,type:"input"       ,width : 450   ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter3']").setCheckEvent("#gridRouteNo input[name='cb']");
                $(".main-nav-tabs").find("[aria-controls='nav-routeDtls']").parent("li").addClass("hide");
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                var _routeNo;
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
    	            $("#route_no").dataBind({
                        sqlCode      : "D1431"
                       ,parameters   : {route_id:id}
                       ,text         : "route"
                       ,value        : "route_no"
                       ,onComplete   : function(){
                           $(this).val(_data.route_no).trigger("change");
                       }
                    });
    	            displayRouteDetails(id,_data.route_no);
    	            $(".main-nav-tabs").find("[aria-controls='nav-routeDtls']").parent("li").removeClass("hide");
                });
            }
        });
    }
    function displayRouteDetails(id,routeNo){
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
        var _routeId = $("#route_id2").val();
        var _routeNo = $("#route_no").val();
        gfromKm = null; 
        gtoKm   = null;
        $('#from_km').html("");
        $('#to_km').html(""); 
        $('#total_km').html("");
        $('#succeeding_km').html(""); 
        $('#succeeding_fare').html(""); 
        $('#total_fare').html(""); 
        
        $("#gridRouteDetails").dataBind({
             sqlCode        : "R1221"
            ,parameters     : {route_id:id? id: _routeId,route_no:routeNo? routeNo : _routeNo} 
            ,height         : $(window).height() - 337         
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_detail_id"         ,type:"hidden"      ,value: app.svn(d,"route_detail_id")})
                                 + app.bs({name:"is_edited"               ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"route_id"                ,type:"hidden"      ,value: id}) 
                                 + (d !==null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                        }
                }
                ,{text: "Route No."                     ,name:"route_no"             ,type:"input"       ,width : 60     ,style : "text-align:left;"}
                ,{text: "Location"                      ,name:"location"             ,type:"input"       ,width : 350    ,style : "text-align:left;"}
                ,{text: "Distance Kilometer"            ,name:"distance_km"          ,type:"input"       ,width : 110    ,style : "text-align:center;"}
                ,{text: "Fare "                         ,width : 100    ,style : "text-align:center;"
                    ,onRender  :  function(d)  
                        { 
                            var _distance = app.svn(d,"distance_km");
                            var _fare = 0.00; 
                            if(_distance <= 4){
                                _fare = 11;
                            }else if(_distance > 4){ 
                                _fare = ((_distance - 4) * 1.8) + 11; 
                            } 
                            return   Math.round(_fare);        
                        }
                }
                ,{text: "Sequence No."                  ,name:"seq_no"               ,type:"input"       ,width : 80     ,style : "text-align:center;"}
                //,{text: "Map Area"                      ,name:"map_area"             ,type:"input"       ,width : 300    ,style : "text-align:left;"}
            ]
            ,onComplete: function(d){
                var _dataRows = d.data.rows;
                $("[name='cbFilter2']").setCheckEvent("#gridRouteDetails input[name='cb']");  
                gDataDD = _dataRows;
            }
        });
    }
    function displayVehicles(){  
        var _cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        var _searchVal = $.trim($("#searchVal").val());  
        var _routeId = $("#route_id").val();
        var ctr=-1
            ,_o = getFilters()
            ,_params = {
                 client_id: _o.client_id
                ,route_id:(_routeId ? _routeId : "")
            };
        
                    
        $("#gridVehicles").dataBind({
             sqlCode     : "V1229"
            ,parameters  : _params
            ,height         : $(window).height() - 500
            ,dataRows       : [
    		    {text: _cb                                                                  ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"vehicle_id"               ,type:"hidden"      ,value: app.svn(d,"vehicle_id")}) 
                              + app.bs({name:"dummy"                    ,type:"hidden"      ,value: app.svn(d,"vehicle_plate_no")})
                              + app.bs({name:"dummy"                    ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                              + app.bs({name:"is_edited"                ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                 }
                ,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewInfoVehicles(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\", \""+ app.svn (d,"vehicle_type_id") +"\",\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text:"Assign Driver & PAO"                                       ,width:110         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='Assign Driver & PAO' onclick='vehicledriverpao.showModalDriverPaoAssignment(this,"+ app.svn (d,"vehicle_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\")'><i class='fas fa-calendar-alt'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Plate No."                 ,name:"vehicle_plate_no"         ,type:"input"                 ,width : 100   ,style : "text-align:center;" }
                ,{text: "Route Code"                ,name:"route_id"                 ,type:"select"                ,width : 500   ,style : "text-align:left;"}
                ,{text: "Vehicle Type"                                                          ,width : 200   ,style : "text-align:left;"
                            ,onRender  :  function(d)  
                        { return    app.bs({name:"vehicle_type_id"          ,type:"select"      ,value: app.svn(d,"vehicle_type_id")})  
                                 +  app.bs({name:"is_active"                ,type:"hidden"      ,value: app.svn(d,"is_active")});
                        }        
                }
                ,{text:"Odometer Reading"                   ,type:"input"           ,name:"odometer_reading"         ,width:105       ,style:"text-align:center"} 
                ,{text:"Driver(s)"                                       ,width:250         ,style:"text-align:center"
                    ,onRender : function(d){
                            return app.bs({name:"dummy"                ,type:"input"      ,value: app.svn(d,"driver")       ,style:"text-align:left"});
                    }
                }
                ,{text:"PAO(s)"                                       ,width:250         ,style:"text-align:left"
                    ,onRender : function(d){
                            return app.bs({name:"dummy"                ,type:"input"      ,value: app.svn(d,"pao")       ,style:"text-align:left"});
                    }
                }
                
            ]
            ,onComplete: function(o){
                var _this  = this;
                var _zRow = _this.find(".zRow");
                var _dRows = o.data.rows;
                _this.find("[name='cbFilter1']").setCheckEvent("#gridVehicles input[name='cb']");
                _this.find("[name='dummy']").attr("readonly", true);
                _zRow.find("[name='route_id']").dataBind({
                    sqlCode      : "D1425"
                   ,parameters   : {client_id: app.userInfo.company_id}
                   ,text         : "route"
                   ,value        : "route_id"
                });
                _zRow.find("[name='vehicle_type_id']").dataBind({
                    sqlCode      : "D1307"
                   ,text         : "vehicle_type"
                   ,value        : "fare_id"
                });
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
                _zRow.find("input[name='cb']").click(function(){
                    if($(this).is(':checked')) $(this).closest(".zRow").find("input[name='is_active']").val("N");
                    else $(this).closest(".zRow").find("input[name='is_active']").val("Y");
                });  
            }
        });
    }
    function displayAssignDriverAndPao(id){
        var cb = app.bs({name:"cbFilter4",type:"checkbox"});
        var _clientId = app.userInfo.company_id;
        var _date = $("#filterAssDriverPaoDate").val()
        var _data = [
                 {shift_id: 1,shift: 1}
                ,{shift_id: 2,shift: 2}
                ,{shift_id: 3,shift: 3}
            ];
        $("#gridDriverPaoAssignment").dataBind({
             sqlCode        : "D1428"
            ,parameters     : {vehicle_id:id,client_id:_clientId}
            ,blankRowsLimit : 5
            ,height         : 320        
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"driver_pao_assignment_id"      ,type:"hidden"      ,value: app.svn(d,"driver_pao_assignment_id")})
                                 + app.bs({name:"is_edited"                     ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"client_id"                     ,type:"hidden"      ,value: _clientId})
                                 + app.bs({name:"vehicle_id"                    ,type:"hidden"      ,value: id}) 
                                 + (d !==null ? app.bs({name:"cb"               ,type:"checkbox"}) : "" );
                        }
                }
                ,{text: "Assignment Date"                                                            ,width : 100        ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"assignment_date"      ,type:"input"      ,value: app.svn(d,"assignment_date")? app.svn(d,"assignment_date").toShortDate() : _date});
                        }
                }
                ,{text: "Driver"                     ,name:"driver_id"          ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "PAO"                        ,name:"pao_id"             ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "Shift No."                  ,name:"shift_id"           ,type:"select"       ,width : 100        ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                $("[name='cbFilter4']").setCheckEvent("#gridRouteDetails input[name='cb']");
                
                this.find("[name='driver_id']").dataBind({
                     sqlCode     : "D1402"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='pao_id']").dataBind({
                     sqlCode     : "D1403"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='shift_id']").fillSelect({
                     data        : _data
                    ,text        : "shift"
                    ,value       : "shift_id"
                });
                this.find("[name='assignment_date']").datepicker({
                     autoclose : false 
                    ,todayHighlight: true 
                    ,startDate: new Date()
                });
            }
        });
    }
    function displayAssignDriverAndPaoHistory(id){
        var _frm = $("#history_frm").val();
        var _to = $("#history_to").val();
        var _clientId = app.userInfo.company_id;
        var _data = [
                 {shift_id: 1,shift: 1}
                ,{shift_id: 2,shift: 2}
                ,{shift_id: 3,shift: 3}
            ];
        $("#gridDriverPaoAssignmentHistory").dataBind({
             sqlCode        : "D1430"
            ,parameters     : {vehicle_id:id,client_id:_clientId,date_frm:(_frm? _frm : ""),date_to:(_to? _to : "")}
            ,height         : 320        
            ,dataRows       : [
                {text: "Assignment Date"                                                            ,width : 100        ,style : "text-align:left;"
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"assignment_date"      ,type:"input"      ,value: app.svn(d,"assignment_date").toShortDate()});
                        }
                }
                ,{text: "Driver"                     ,name:"driver_id"          ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "PAO"                        ,name:"pao_id"             ,type:"select"       ,width : 250        ,style : "text-align:left;"}
                ,{text: "Shift No."                  ,name:"shift_id"           ,type:"select"       ,width : 100        ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                this.find("[name='driver_id']").dataBind({
                     sqlCode     : "D1402"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='pao_id']").dataBind({
                     sqlCode     : "D1403"
                    ,text        : "fullname"
                    ,value       : "id"
                });
                this.find("[name='shift_id']").fillSelect({
                     data        : _data
                    ,text        : "shift"
                    ,value       : "shift_id"
                });
                this.find("[name='assignment_date']").datepicker({
                     autoclose : false 
                    ,todayHighlight: true 
                });
                this.find("input,select").attr("disabled",true);
            }
        });
    }
    function displayDrivers(){
        var _cb = app.bs({name:"cbFilter2",type:"checkbox"}); 
        var _clientId = app.userInfo.company_id;
        var _searchVal = $("#searchValDriver").val();
        var _genderOptions = [
                                 {text:"M"     ,value:"M"}
                                ,{text:"F"     ,value:"F"}
                            ];
        var ctr=-1;
        var _$windowHeight = $(window).height()
            ,_sqlCode  = "D1232" 
            ,_o        = getFilters()
            ,_params   = {
                 client_id  : _o.client_id
                ,tab_id     : 1
                ,searchVal  : (_searchVal ? _searchVal : "")
                ,is_active  : 'Y'
            };
            
        switch(gActiveTab){
            case "Drivers":  
                switch (gSubTabName) {  
                    case "(15)Days for Renewal":  
                        _params.tab_id = 2;
                    break;
                    case "(30)Days for Renewal":  
                        _params.tab_id = 3;
                    break;
                    case "Expired License":  
                        _params.tab_id = 4;
                    break;  
                }
            break; 
        }
                    
        $("#gridDriversLicensed").dataBind({
             sqlCode        : "D1232"
            ,parameters     : _params
    	    ,height         : $(window).height() - 565 
    	    ,selectorType   : "checkbox" 
    	    ,rowsPerPage    : 50
            ,isPaging       : true
            ,dataRows       : [ 
                {text: _cb                                                                  ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"dummy"               ,type:"hidden"      ,value: app.svn(d,"first_name")}) 
                              + app.bs({name:"dummy"               ,type:"hidden"      ,value: app.svn(d,"last_name")})
                              + app.bs({name:"dummy"               ,type:"hidden"      ,value: app.svn(d,"middle_name")})
                              + app.bs({name:"dummy"               ,type:"hidden"      ,value: app.svn(d,"name_suffix")})
                              + app.bs({name:"dummy"               ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")})
                              + app.bs({name:"dummy"               ,type:"hidden"      ,value: app.svn(d,"employee_no")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                }
        		,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++; 
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewPaoImage(this,\""+ app.svn (d,"id") +"\",\""+ $.trim(app.svn (d,"first_name")) +"\",\""+ $.trim(app.svn (d,"last_name")) +"\",\""+ app.svn (d,"middle_name") +"\",\""+ app.svn (d,"name_suffix") +"\",\""+ app.svn (d,"emp_hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            
                            return (d !== null ? _link : ""); 
                            
                    }
                }
                ,{text:"Employee No."            ,width:95          ,style:"text-align:center"          ,sortColNo:1
                    ,onRender : function(d){
                        return app.bs({name:"id"                    ,type:"hidden"      ,value: app.svn(d,"id")})
                             + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                             + app.bs({name:"client_id"             ,type:"hidden"      ,value: _clientId})
                             + app.bs({name:"employee_no"           ,type:"input"       ,value: app.svn(d,"employee_no")        ,style:"text-align:center"});
                    } 
                }
                ,{text:"Last Name"              ,type:"input"           ,name:"last_name"           ,width:150        ,style:"text-align:left"      ,sortColNo:4}
                ,{text:"First Name"             ,type:"input"           ,name:"first_name"          ,width:150        ,style:"text-align:left"      ,sortColNo:5}
                ,{text:"Middle Name"            ,type:"input"           ,name:"middle_name"         ,width:100        ,style:"text-align:center"}
                ,{text:"Name Suffix"            ,type:"input"           ,name:"name_suffix"         ,width:80         ,style:"text-align:center"}
                ,{text:"Gender"                 ,type:"select"          ,name:"gender"              ,width:50         ,style:"text-align:center"}
                ,{text:"Mobile No."                                                                 ,width:105        ,style:"text-align:center"
                    ,onRender : function(d){
                        return app.bs({name:"contact_phone_no"          ,type:"input"       ,value: app.svn(d,"contact_phone_no")       ,style:"text-align:center"});
                    }
                }
                ,{text  : "Academy No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_academy_no"}
                ,{text  : "License No."                 ,width : 100           ,style : "text-align:center;"          ,type:"input"       ,name:"driver_license_no"}
                ,{text  : "License Expr. Date"          ,width : 120           ,style : "text-align:center;"          
                     ,onRender : function(d){ 
                        return app.bs({name:"driver_license_exp_date"       ,type:"input"       ,value: app.svn(d,"driver_license_exp_date").toShortDate()})
                             + app.bs({name:"is_driver"                     ,type:"hidden"      ,value: app.svn(d,"is_driver")})
                             + app.bs({name:"is_pao"                        ,type:"hidden"      ,value: app.svn(d,"is_pao") });
                    }
                } 
                ,{text:"Driver"                 ,type:"yesno"           ,name:"is_driver"           ,width:60         ,style:"text-align:center" ,defaultValue:"N"}
                ,{text:"PAO"                    ,type:"yesno"           ,name:"is_pao"              ,width:60         ,style:"text-align:center" ,defaultValue:"N"}
                ,{text:"Active?"                ,type:"yesno"           ,name:"is_active"           ,width:60         ,style:"text-align:center" ,defaultValue:"Y"} 
            ] 
            ,onComplete: function(o){
                var _zRow = this.find(".zRow");
                this.find("[name='cbFilter2']").setCheckEvent("#gridDriversLicensed input[name='cb']");
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "tranfer_type"
                   ,value        : "tranfer_type_id"
                });
                _zRow.find("[name='bank_id']").dataBind({
                    sqlCode      : "B1245"
                   ,text         : "bank_code"
                   ,value        : "bank_id"
                });
                this.find("input[name='driver_license_exp_date']").datepicker({
                      pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                });
                _zRow.find("[name='transfer_type_id']").dataBind({
                    sqlCode      : "D1284"
                   ,text         : "transfer_type"
                   ,value        : "transfer_type_id"
                });
                this.find("select[name='civil_status_code']").dataBind("civil_status");
                this.find("select[name='empl_type_code']").dataBind("empl_types");
                this.find("select[name='gender']").fillSelect({data: _genderOptions});
                this.find('input[name="contact_phone_no"]').keyup(function(e){
                  if (/\D/g.test(this.value))
                  {
                    this.value = this.value.replace(/\D/g, '');
                  }
                });
                markNewUserMandatory();
            }
        });
                    
    }
    function displayPAO(){    
        var _cb = app.bs({name:"cbFilter3",type:"checkbox"}); 
        var _searchVal = $("#searchValPao").val();
        var _genderOptions = [
                                 {text:"M"     ,value:"M"}
                                ,{text:"F"     ,value:"F"}
                            ];
        var _clientId = app.userInfo.company_id;
        var ctr=-1
            ,_o = getFilters()
            ,_params = {
                 client_id: _o.client_id
                ,searchVal:(_searchVal ? _searchVal : "")
            };
            
        $("#gridPAO").dataBind({
             sqlCode     : "P1233"
            ,parameters  : _params 
    	    ,height         : $(window).height() - 520
    	    ,selectorType   : "checkbox"
    	    ,rowsPerPage    : 50
            ,isPaging : true
            ,dataRows       : [ 
                {text: _cb                                                                  ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"first_name")}) 
                              + app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"last_name")})
                              + app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"middle_name")})
                              + app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"name_suffix")})
                              + app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"emp_hash_key")})
                              + app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"employee_no")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                }
        		,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            ctr++; 
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewPaoImage(this,\""+ app.svn (d,"id") +"\",\""+ $.trim(app.svn (d,"first_name")) +"\",\""+ $.trim(app.svn (d,"last_name")) +"\",\""+ app.svn (d,"middle_name") +"\",\""+ app.svn (d,"name_suffix") +"\",\""+ app.svn (d,"emp_hash_key") +"\")'><i class='fas fa-eye'></i></a>";
                            
                            return (d !== null ? _link : ""); 
                            
                    }
                }
                ,{text:"Employee No."            ,width:95          ,style:"text-align:center"          ,sortColNo:1
                    ,onRender : function(d){
                        return app.bs({name:"id"                    ,type:"hidden"      ,value: app.svn(d,"id")})
                             + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                             + app.bs({name:"client_id"             ,type:"hidden"      ,value: _clientId})
                             + app.bs({name:"employee_no"           ,type:"input"       ,value: app.svn(d,"employee_no")    ,style:"text-align:center"});
                    } 
                }
                ,{text:"Last Name"              ,type:"input"           ,name:"last_name"           ,width:150        ,style:"text-align:left"      ,sortColNo:4}
                ,{text:"First Name"             ,type:"input"           ,name:"first_name"          ,width:150        ,style:"text-align:left"      ,sortColNo:5}
                ,{text:"Middle Name"            ,type:"input"           ,name:"middle_name"         ,width:100        ,style:"text-align:center"}
                ,{text:"Name Suffix"            ,type:"input"           ,name:"name_suffix"         ,width:80         ,style:"text-align:center"}
                ,{text:"Gender"                 ,type:"select"          ,name:"gender"              ,width:50         ,style:"text-align:center"}
                ,{text:"Mobile No."                                                         ,width:105        ,style:"text-align:center"
                    ,onRender : function(d){
                        return app.bs({name:"contact_phone_no"              ,type:"input"       ,value: app.svn(d,"contact_phone_no")       ,style:"text-align:center"})
                             + app.bs({name:"driver_academy_no"             ,type:"hidden"       ,value: app.svn(d,"driver_academy_no")})
                             + app.bs({name:"driver_license_no"             ,type:"hidden"       ,value: app.svn(d,"driver_license_no")})
                             + app.bs({name:"driver_license_exp_date"       ,type:"hidden"       ,value: app.svn(d,"driver_license_exp_date")})
                             + app.bs({name:"is_driver"                     ,type:"hidden"      ,value: app.svn(d,"is_driver")})
                             + app.bs({name:"is_pao"                        ,type:"hidden"      ,value: app.svn(d,"is_pao") });
                    }
                }
                ,{text:"Driver"                 ,type:"yesno"           ,name:"is_driver"           ,width:60         ,style:"text-align:center" ,defaultValue:"N"}
                ,{text:"PAO"                    ,type:"yesno"           ,name:"is_pao"              ,width:60         ,style:"text-align:center" ,defaultValue:"N"}
                ,{text:"Active?"                ,type:"yesno"           ,name:"is_active"           ,width:60         ,style:"text-align:center" ,defaultValue:"Y"}
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){ 
                this.find("[name='cbFilter3']").setCheckEvent("#gridPAO input[name='cb']");
                this.find("select[name='civil_status_code']").dataBind("civil_status");
                this.find("select[name='empl_type_code']").dataBind("empl_types");
                this.find("select[name='gender']").fillSelect({data: _genderOptions});
                this.find('input[name="contact_phone_no"]').keyup(function(e){
                  if (/\D/g.test(this.value))
                  {
                    this.value = this.value.replace(/\D/g, '');
                  }
                });
                markNewUserMandatory();
            }
        });    
                    
        
    }  
    function displayDevices(){
        var _ctr = 1;
        var _cb = app.bs({name:"cbFilter4",type:"checkbox"}); 
        var _searchVal = $("#searchValDevice").val();
        $("#gridDevices").dataBind({
             sqlCode        : "D1214"
            ,parameters     : {company_id: app.userInfo.company_id,searchVal:_searchVal? _searchVal : ""} 
            ,height         : $(window).height() - 491      
            ,dataRows       : [
                {text: _cb                                                                  ,width:25           ,style:"text-align:left"
                     ,onRender : function(d){
                         return app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"serial_no")}) 
                              + app.bs({name:"dummy"            ,type:"hidden"      ,value: app.svn(d,"hash_key")})
                              + (d !== null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                     }
                }
                ,{text:"Item No."                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            return _ctr++;
                    }
                }
                ,{text:"View QR"                                       ,width:60         ,style:"text-align:center"
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View' onclick='vehicledriverpao.showModalViewQR(this,\""+ app.svn (d,"hash_key") +"\",\""+ app.svn (d,"serial_no") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                }
                ,{text: "Device Id"                                                                          ,width: 60      ,style: "text-align:center;"
                    ,onRender   : function(d){
                        return app.svn(d,"device_id")
                             + app.bs({name:"device_id"             ,type:"hidden"      ,value: app.svn(d,"device_id")})
                             + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) ;
                    }
                }
                ,{text: "Serial No."                           ,name:"serial_no"         ,type:"input"        ,width: 160      ,style: "text-align:center;"}
                ,{text: "Mobile No."                                                                          ,width: 120      ,style: "text-align:center;"
                    ,onRender   : function(d){
                        return app.bs({name:"mobile_no"             ,type:"input"       ,value: app.svn(d,"mobile_no")         ,style: "text-align:center;"});
                    }
                }
                ,{text: "Load Date"                                                                           ,width: 100      ,style: "text-align:center;"
                    ,onRender   : function(d){
                         return app.bs({name:"load_date"             ,type:"input"       ,value: app.svn(d,"load_date").toShortDate()        ,style: "text-align:center;"});
                    }
                }
                ,{text: "Registered?"                               ,name: "is_active"              ,type:"yesno"       ,width : 80    ,style : "text-align:center;" ,defaultValue:"N"}
            ]
            ,onComplete: function(){
                var _this = this;
                this.find('input[name="mobile_no"]').keyup(function(e){
                  if (/\D/g.test(this.value))
                  {
                    this.value = this.value.replace(/\D/g, '');
                  }
                });
                this.find("[name='cbFilter4']").setCheckEvent("#gridDevices input[name='cb']");
                _ctr = 1;
                 _this.find("[name='load_date']").datepicker({
                     pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                });
            }
        });
    }
    function displayAddNewDriverPao(is_driver,is_pao){
        var _clientId = app.userInfo.company_id;
        var _genderOptions      =   [
                                         {text:"M"     ,value:"M"}
                                        ,{text:"F"     ,value:"F"}
                                    ]
           ,_inactiveTypeOptions =  [
                                         {text:"A"      ,value:"A"}
                                        ,{text:"B"      ,value:"B"}
                                    ] 
                                    
                          
        $("#gridNewDriverPao").dataBind({
                 height         : 600
                ,blankRowsLimit : 10
                ,dataRows       : [
                        {text:"Employee No."            ,width:95         ,style:"text-align:center"
                            ,onRender : function(d){
                                return app.bs({name:"id"                    ,type:"hidden"      ,value: app.svn(d,"id")})
                                     + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                     + app.bs({name:"client_id"             ,type:"hidden"      ,value: _clientId})
                                     + app.bs({name:"employee_no"           ,type:"input"       ,value: app.svn(d,"employee_no") });
                            } 
                        }
                        ,{text:"Last Name"              ,type:"input"           ,name:"last_name"           ,width:150          ,style:"text-align:left"}
                        ,{text:"First Name"             ,type:"input"           ,name:"first_name"          ,width:150          ,style:"text-align:left"}
                        ,{text:"Middle Name"            ,type:"input"           ,name:"middle_name"         ,width:100          ,style:"text-align:center"}
                        ,{text:"Name Suffix"            ,type:"input"           ,name:"name_suffix"         ,width:80           ,style:"text-align:center"}
                        ,{text:"Gender"                 ,type:"select"          ,name:"gender"              ,width:50           ,style:"text-align:center"}
                        ,{text:"Mobile No."             ,type:"input"           ,name:"contact_phone_no"    ,width:105          ,style:"text-align:center"}
                        ,{text:"Academy No."            ,type:"input"           ,name:"driver_academy_no"   ,width:100          ,style : "text-align:center;"}
                        ,{text:"License No."            ,type:"input"           ,name:"driver_license_no"   ,width:100          ,style : "text-align:center;"}
                        ,{text:"License Expr. Date"                                                         ,width:120          ,style : "text-align:center;"          
                             ,onRender : function(d){ 
                                return app.bs({name:"driver_license_exp_date"       ,type:"input"       ,value: app.svn(d,"driver_license_exp_date").toShortDate()});
                            }
                        } 
                        ,{text:"Driver?"                ,type:"yesno"           ,name:"is_driver"           ,width:60         ,style:"text-align:center" ,defaultValue: is_driver}
                        ,{text:"PAO?"                   ,type:"yesno"           ,name:"is_pao"              ,width:60         ,style:"text-align:center" ,defaultValue: is_pao}
                        ,{text:"Active?"                ,type:"yesno"           ,name:"is_active"           ,width:60         ,style:"text-align:center" ,defaultValue: "Y"}
                    ]
            ,onComplete: function(){
                var _this = this;
                var _zRow = _this.find(".zRow");
                _this.find("[name='driver_license_exp_date']").datepicker({
                     pickTime  : false
                    , autoclose : true
                    , todayHighlight: true
                });
                _this.find("[name='cbFilter1']").setCheckEvent("#grid input[name='cb']");
                _this.find("select[name='gender']").fillSelect({data: _genderOptions});
                _this.find(".zHeaders .item:nth-child(15) .text").css({
                    "text-align": "right"
                    ,"width": "100%"
                    ,"margin-right": "4px"
                });
                _this.find('[name="basic_pay"]').attr("readonly",true);
                _this.find("select[name='civil_status_code']").dataBind("civil_status");
                _this.find("select[name='empl_type_code']").dataBind("empl_types");
                _zRow.find("select[name='pay_type_code']").dataBind("pay_types");
                _zRow.find("[name='department_id']").dataBind({
                     sqlCode        : "D1438"  
                    ,parameters     : {client_id : _clientId}
                    ,text           : "dept_sect_name"
                    ,value          : "dept_sect_id"
                    ,onChange : function(o){  
                        $(this).closest(".zRow").find("[name='section_id']").dataBind({
                             sqlCode        : "D1440"
                            ,parameters     : {client_id : _clientId, department_id : $(this).val()} 
                            ,text           : "dept_sect_name"
                            ,value          : "dept_sect_id"
                        }); 
                    }
                });
                _zRow.find("[name='position_id']").dataBind({
                     sqlCode      : "D1439" 
                    ,parameters   : {client_id : _clientId}
                    ,text         : "position_title"
                    ,value        : "position_id"
                    ,onChange     : function(d){
                        var  _info       = d.data[d.index - 1]
                            ,_basic_pay  = _info.basic_pay
                            ,_$zRow      = $(this).closest(".zRow");
                            _$zRow.find('[name="basic_pay"]').val(_basic_pay);
                    }
                }); 
                this.find('input[name="contact_phone_no"]').keyup(function(e){
                  if (/\D/g.test(this.value))
                  {
                    this.value = this.value.replace(/\D/g, '');
                  }
                });
                _this.find("select[name='contact_relation_id']").dataBind("relations");
                markNewUserMandatory();
            }
        });
    }
    function commaSeparateNumber(n){
        var _res = "";
        if($.isNumeric(n)){
            var _num = parseFloat(n).toFixed(2).toString().split(".");
            _res = _num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (!isUD(_num[1]) ? "." + _num[1] : "");
        }
        return _res;
    } 
    function markNewUserMandatory(){
        zsi.form.markMandatory({       
          "groupNames":[
                {
                     "names" : ["last_name","first_name"]
                    ,"type":"M"
                }             
              
          ]      
          ,"groupTitles":[ 
                 {"titles" : ["Last Name","First Name"]}
          ]
        });    
    } 
    function isRequiredInputFound(form){
        var result = false;
        var inputName = "";
        $(form).find("input[name='is_edited']").each(function(e){
            if($.trim(this.value) === "Y"){
                var $zRow = $(this).closest(".zRow");
                var lastName = $zRow.find("[name='last_name']").val();
                var firstName = $zRow.find("[name='first_name']").val();
                
                if ($.trim(lastName) === ""){
                    result = true;
                    inputName = "Last Name";
                }  
                if ($.trim(firstName) === ""){
                    result = true;
                    inputName = "First Name";
                }
            }
        });
    
        return {result, inputName};
    }
    function dateValidation(){
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var _date = month + "/"+day+"/" +    d.getFullYear();
        var _$mdl = $("#myModalPrintAssDriverPAO");
        
        _$mdl.find("#assignedDriverPAOFrm").datepicker({
             autoclose : true 
            ,todayHighlight: false 
        }).datepicker("setDate", _date).on("changeDate",function(e){
            _$mdl.find("#assignedDriverPAOTo").datepicker({
                autoclose: true
            }).datepicker("setStartDate",e.date);
            $("#assignedDriverPAOTo").datepicker().datepicker("setDate",e.date);
        });
        _$mdl.find("#assignedDriverPAOTo").datepicker({
              autoclose : true
             ,startDate : _date
        }).datepicker("setDate","0");
        
    }
        
    
    $("#btnSearchValDevice,#btnSearchValDriver,#btnSearchValPao").click(function(){
        var _colName = $(this)[0].id;
        
        if(_colName === "btnSearchValDevice") displayDevices();
        if(_colName === "btnSearchValDriver") displayDrivers();
        if(_colName === "btnSearchValPao") displayPAO();
        
    });
    $("#btnSaveDrivers,#btnSavePaos").click(function () {
        var _colName = $(this)[0].id;
        var _grid = "#gridDriversLicensed";
        if(_colName === "btnSavePaos") _grid = "#gridPAO";
        var res = isRequiredInputFound(_grid);
        if(!res.result){
            $(_grid).jsonSubmit({
                 procedure: "driver_pao_upd"
                ,notIncludes: ["cb","dummy"]
                ,optionalItems: ["is_active","contact_relation_id","gender","civil_status_code","empl_type_code"]
                ,onComplete : function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $(_grid).trigger("refresh");
                }
            });         
        } else {
            alert("Enter " + res.inputName);
        }
        
        
    });
    $("#btnAddDriver,#btnAddPao").click(function () {
        var _$mdl = $('#' + mdlAddNewDriverPao);
        var _colName = $(this)[0].id;
        var _title = "Add New Driver(s)";
        gisDriver = "Y";
        gisPao = "N";
        
        if(_colName === "btnAddPao") {
            _title = "Add New PAO(s)";
            gisPao = "Y";
            gisDriver = "N";
        }
        
        _$mdl.find(".modal-title").text(_title);
        displayAddNewDriverPao(gisDriver,gisPao);
        _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        
    });
    $("#btnFilterValRouteId,#btnFilterValRouteNo").click(function(){
       var _colName = $(this)[0].id;
       var _val = $("#route_id2").val();
       
       if(_colName === "btnFilterValRouteId") displayRouteNos(_val);
       if(_colName === "btnFilterValRouteNo") displayRouteDetails();
    });
    $("#btnResetValHistory").click(function(){
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate() - 1;
        var yesterday = (d.getMonth() + 1) + "/"+day+"/" +    d.getFullYear();
        
        $("#history_frm,#history_to").datepicker({
             autoclose : false 
            ,todayHighlight: false 
            ,endDate: yesterday
        }).datepicker("setDate", yesterday);
        
       displayAssignDriverAndPaoHistory(gVehicleId);
    });
    $("#btnFilterHistory").click(function(){
       displayAssignDriverAndPaoHistory(gVehicleId);
       
       $("#historyId").show(500);
    });
    $(".btnPrintId").click(function(){
        var _$tbody = $("#qrTable > tbody");
        var _style = "text-align:center;border:0.1rem solid black;margin-left: 10px; margin-top: 10px;width: 204px !important;padding:4px";
        var _createQR = function(text){new QRCode(document.getElementById(text), {width:160, height:160}).makeCode(text);}
        var obj = {};
        var _data = [];
        var  _row= $(gGridId).find("[name='cb']:checked").parent(".zCell");
        
        for(var x =0; x < _row.length; x++){
            var _rows = _row[x];
            var _inputs = $(_rows).find("input");
            var arr = [].map.call( _inputs, function( input ) {
                return input.value;
            }).join( ',' );
            var data = arr.split(",");
            
            obj = {
                 first_name     : data[0]
                ,last_name      : data[1]
                ,middle_name    : data[2]
                ,name_suffix    : data[3]
                ,emp_hash_key   : data[4]
                ,employee_no    : data[5]
            }
            
            _data.push(obj);
        }
        
        var _getData = function(cb){
            var _arr = [],
                _obj= {},
                _ctr = 0,
                _ctr2 = 0,
                _h = "";  
                
            for(var i=0; i < _data.length; i++ ){
                _ctr++;
                _ctr2++;
                var _o = _data[i];
                
                var _hashKey = _o.emp_hash_key;
                var _nameSuffix = _o.name_suffix? " " + _o.name_suffix + "." : "";
                var _middleName = _o.middle_name? _o.middle_name + "." + " ": ""; 
                var _fulName =  _o.first_name + " " + _middleName + _o.last_name + _nameSuffix;
                
                _h +='<td><div id="empId_'+_o.id+'" style="'+ _style +'">'
                    //+'    <div class="text-center" style="margin-top:15px;">'
                    //+'        <div style="font-size:15px"><b>'+gClientName+'</b></div>'
                    //+'    </div>'
                    //+'    <div style="justify-content:center;margin-top:12px;margin-bottom:8px;display:flex;">'
                    //+'        <div style="width:96px; height:96px; border:1px solid black;align-items:center;"><span>PHOTO</span></div>'
                    //+'    </div>'
                    +'    <div class="text-center" style="margin-bottom:5px;">'
                    +'        <div class="m-0 font-weight-bold" style="font-size:15px !important;padding:0px !important;margin:0px !important;">'+_fulName+'</div>'
                    +'    </div>'
                    //+'   <span style="font-size:14px !important; text-align:left !important">'+_o.employee_no+'</span>'
                    +'   <div style="width: 100%;height:auto;justify-content:center;display:flex;margin-bottom:5px;">'
                    +'         <div id="'+_hashKey+'"></div>'
                    +'   </div>'
                    +'</div></td>';
                
                _obj["hash" +_ctr] = _hashKey;
                
                if ((_ctr && (_ctr % 3 === 0)) || (_data.length === _ctr2)) {
                    _h = "<tr>"+ _h +"</tr>";
                    _$tbody.append(_h);
                    _arr.push(_obj);
                    _obj = {};
                    _ctr = 0;
                    _h = "";
                }
                
                
            }
            cb(_arr);
               
        };
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _hash1  = _o.hash1,
                    _hash2  = (isUD(_o.hash2)? "":_o.hash2),
                    _hash3 = (isUD(_o.hash3)? "":_o.hash3),
                    _hashId1 = _o.hashId1,
                    _hashId2  = (isUD(_o.hashId2)? "":_o.hashId2),
                    _hashId3  = (isUD(_o.hashId3)? "":_o.hashId3);
                
                _createQR(_hash1,_hashId1); 
                if(_hash2) _createQR(_hash2,_hashId2); 
                if(_hash3) _createQR(_hash3,_hashId3);
            }
        }); 
        
        if(_data.length > 0){
            setTimeout(function(){
                $('#myModal').find("#msg").text("Are you sure you want to print this ID's?");
                $('#myModal').modal('show');
            },100);
        }else alert("Please select checkbox to proceed.");
        
    });
    $("#btnPrintSaveId").click(function(){
        printQR("printThis");
    });
    $(".btnPrint").click(function(){
        var _$tbody = $("#qrTable > tbody");
        var _style = "text-align:center;border:1px solid black; margin-left: 5px; margin-top: 5px;width: 204px !important;padding:3px;";
        var _createQR = function(text){new QRCode(document.getElementById(text), {width:160, height:160}).makeCode(text);}
        var obj = {};
        var _data = [];
        var  _row= $("#gridVehicles").find("[name='cb']:checked").parent(".zCell");
        
        for(var x =0; x < _row.length; x++){
            var _rows = _row[x];
            var _inputs = $(_rows).find("input");
            var arr = [].map.call( _inputs, function( input ) {
                return input.value;
            }).join( ',' );
            var data = arr.split(",");
            
            obj = {
                 vehicle_plate_no     : data[1]
                ,hash_key             : data[2]
            }
            
            _data.push(obj);
        }
        
        
        var _getData = function(cb){
            var _arr = [],
                _obj= {},
                _ctr = 0,
                _ctr2 = 0,
                _h = "";  
                
            for(var i=0; i < _data.length; i++ ){
                _ctr++;
                _ctr2++;
                var _o = _data[i];
                var _hashKey = _o.hash_key;
                var _plateNo = _o.vehicle_plate_no;
                
                _h += "<td><div style='"+ _style +"'><span style='font-size:20px;'>"+_plateNo+"</span><div style='width:100%;justify-content:center;display:flex;'><div id='"+ _hashKey +"'></div></div><div style='width:100%;text-align:center;'><span style='font-size:15px !important; text-align:left !important'><b>"+gClientName+"</b></span></div></div></td>";
                
                _obj["hash" +_ctr] = _hashKey;
                
                if ((_ctr && (_ctr % 3 === 0)) || (_data.length === _ctr2)) {
                    _h = "<tr>"+ _h +"</tr>";
                    _$tbody.append(_h);
                    _arr.push(_obj);
                    _obj = {};
                    _ctr = 0;
                    _h = "";
                }
                
            }
            cb(_arr);
               
        };
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _hash1  = _o.hash1,
                    _hash2  = (isUD(_o.hash2)? "":_o.hash2),
                    _hash3 = (isUD(_o.hash3)? "":_o.hash3),
                    _hashId1 = _o.hashId1,
                    _hashId2  = (isUD(_o.hashId2)? "":_o.hashId2),
                    _hashId3  = (isUD(_o.hashId3)? "":_o.hashId3);
                
                _createQR(_hash1,_hashId1); 
                if(_hash2) _createQR(_hash2,_hashId2); 
                if(_hash3) _createQR(_hash3,_hashId3);
            }
        }); 
        
        if(_data.length > 0){
            setTimeout(function(){
                $('#myModal').find("#msg").text("Are you sure you want to print this vehicle QR's?");
                $('#myModal').modal('show');
            },100);
        }else alert("Please select checkbox to proceed.");
    });
    $(".btnPrintDevicesQr").click(function(){
        var _$tbody = $("#qrTable > tbody");
        var _style = "text-align:center;border:1px solid black; margin-left: 5px; margin-top: 5px;width: 204px !important;padding:3px;";
        var _createQR = function(text){new QRCode(document.getElementById(text), {width:160, height:160}).makeCode(text);}
        var obj = {};
        var _data = [];
        var  _row= $("#gridDevices").find("[name='cb']:checked").parent(".zCell");
        
        for(var x =0; x < _row.length; x++){
            var _rows = _row[x];
            var _inputs = $(_rows).find("input");
            var arr = [].map.call( _inputs, function( input ) {
                return input.value;
            }).join( ',' );
            var data = arr.split(",");
            
            obj = {
                 serial_no     : data[0]
                ,hash_key      : data[1]
            }
            
            _data.push(obj);
        }
        
        
        var _getData = function(cb){
            var _arr = [],
                _obj= {},
                _ctr = 0,
                _ctr2 = 0,
                _h = "";  
                
            for(var i=0; i < _data.length; i++ ){
                _ctr++;
                _ctr2++;
                var _o = _data[i];
                var _hashKey = _o.hash_key;
                var _serial_no = _o.serial_no;
                
                _h += "<td><div style='"+ _style +"'><span style='font-size:20px;'>"+_serial_no+"</span><div style='width:100%;justify-content:center;display:flex;'><div id='"+ _hashKey +"'></div></div><div style='width:100%;text-align:center;'><span style='font-size:15px !important; text-align:left !important'><b>"+gClientName+"</b></span></div></div></td>";
                
                _obj["hash" +_ctr] = _hashKey;
                
                if ((_ctr && (_ctr % 3 === 0)) || (_data.length === _ctr2)) {
                    _h = "<tr>"+ _h +"</tr>";
                    _$tbody.append(_h);
                    _arr.push(_obj);
                    _obj = {};
                    _ctr = 0;
                    _h = "";
                }
                
            }
            cb(_arr);
               
        };
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _hash1  = _o.hash1,
                    _hash2  = (isUD(_o.hash2)? "":_o.hash2),
                    _hash3 = (isUD(_o.hash3)? "":_o.hash3),
                    _hashId1 = _o.hashId1,
                    _hashId2  = (isUD(_o.hashId2)? "":_o.hashId2),
                    _hashId3  = (isUD(_o.hashId3)? "":_o.hashId3);
                
                _createQR(_hash1,_hashId1); 
                if(_hash2) _createQR(_hash2,_hashId2); 
                if(_hash3) _createQR(_hash3,_hashId3);
            }
        }); 
        
        if(_data.length > 0){
            setTimeout(function(){
                $('#myModal').find("#msg").text("Are you sure you want to print this vehicle QR's?");
                $('#myModal').modal('show');
            },100);
        }else alert("Please select checkbox to proceed.");
    });
    $("#btnPrintId").click(function(){
        printCanvas("printThisId");
    });
    $("#btnFilterVal").click(function(){
       displayVehicles(); 
    });
    $("#download").click(function() { 
        html2canvas($("#printThisId"),{
            onrendered: function(canvas){
                var _imgData = canvas.toDataURL("image/png");
                var _newImgData = _imgData.replace(/^data:image\/png/, "data:application/octet-stream");
                $("#download").attr("download", ""+gFullName+"Id.png").attr("href", _newImgData);
            }
        });
    });
    $("#btnUploadExcel").click(function(){
        var _grid = "#gridVehicles";  
            _fileName = gActiveTab
        $(_grid).convertToTable(function(table){
            var _html = table.get(0).outerHTML; 
            zsi.htmlToExcel({
                fileName: _fileName
                ,html : _html
            });
        }); 
       
    }); 
    $("#btnSaveDevices").click(function () {
        $("#gridDevices").jsonSubmit({
             procedure: "devices_upd"
            ,notIncludes: ["dummy"]
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) { 
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridDevices").trigger("refresh");
            }
        });
    });
    $("#btnInactiveVehicles").click(function(){
       var _$body = $("#frm_modalInactiveVehicles").find(".modal-body"); 
        g$mdl = $("#modalInactiveVehicles");
        g$mdl.find(".modal-title").text("Inactive Vehicles") ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayInactiveVehicles();
    });
    $("#btnSaveVehicles").click(function () {
        $("#gridVehicles").find("input[name='cb']:checked").closest(".zRow").find("input[name='is_active']").each(function(){this.value = "Y"});
        $("#gridVehicles").jsonSubmit({
             procedure: "vehicle_upd"
            ,notIncludes: ["dummy"]
            ,optionalItems: ["is_active"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridVehicles").trigger("refresh");
            }
        });
    });   
    $("#btnSaveDriverPaoAssignment").click(function () {
        $("#gridDriverPaoAssignment").jsonSubmit({
             procedure: "driver_pao_assignment_upd"
            ,optionalItems: ["driver_id","pao_id","shift_id"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayAssignDriverAndPao(gVehicleId);
                $("#gridVehicles").trigger("refresh");
            }
        });
    });   
    $("#btnSaveRoute").click(function () {
       $("#gridRoutes").jsonSubmit({
             procedure: "client_routes_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridRoutes").trigger("refresh");
            }
        });
    });
    $("#btnDeleteRoute").click(function(){ 
        $("#gridRoutes").deleteData({
            tableCode: "ref-00011"
            ,onComplete : function(d){
                $('#gridRoutes').trigger('refresh');
            }
         });      
    });
    $("#btnSearchValAssDriverPao").click(function(){
        displayAssignDriverAndPao(gVehicleId);
    });
    $("#btnDeleteDriverPaoAssignment").click(function(){ 
        $("#gridDriverPaoAssignment").deleteData({
            tableCode: "ref-00012"
            ,onComplete : function(d){
                $('#gridDriverPaoAssignment').trigger('refresh');
                $('#gridVehicles').trigger('refresh');
            }
         });      
    });
    $(".btnExport").click(function(){
        var _grid = "#gridRouteDetails"; 
            _fileName = "Route Details"  
        $(_grid).convertToTable(function(table){
            var _html = table.get(0).outerHTML; 
            zsi.htmlToExcel({
                fileName: _fileName
                ,html : _html
            });
        }); 
       
    }); 
    $("#btnPrintAssDriverPAO").click(function(){
        var _$mdl = $("#myModalPrintAssDriverPAO");
        
        dateValidation();
        
        _$mdl.modal("toggle"); 
    });
    $("#btnPrintSaveAssDriverPAO").click(function(){
        var _$mdl = $("#myModalPrintAssDriverPAO");
        var _frm = _$mdl.find("#assignedDriverPAOFrm").val();
        var _to = _$mdl.find("#assignedDriverPAOTo").val()
            ,_o = getFilters()
            ,_params = {
                 client_id  : _o.client_id
                ,date_from  : _frm
                ,date_to    : _to
            };
        $("#tableAssDriverPao").find("tbody").html("");
        zsi.getData({
             sqlCode     : "V1488"
            ,parameters  : _params
            ,onComplete  : function(d){
                var _html = ""
                $.each(d.rows, function(i,v){
                    _html = '<td style="border: 1px solid #404040;padding: 8px;text-align:center;">'+v.vehicle_no+'</td>'
                          + '<td style="border: 1px solid #404040;padding: 8px;text-align:center;">'+(v.assignment_date).toShortDate()+'</td>'
                          + '<td style="border: 1px solid #404040;padding: 8px;text-align:center;">'+v.driver+'</td>'
                          + '<td style="border: 1px solid #404040;padding: 8px;text-align:center;">'+v.pao+'</td>'
                          
                    $("#tableAssDriverPao").find("tbody").append('<tr>'+_html+'</tr>');
                });
                
                printQR("printThisIdTblAssDriverPAO");
            }
        });
        
    });
    return _public;
})();                                                                                                                                                     