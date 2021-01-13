 var route = (function(){
    var  _pub            = {}
        ,gActiveTab      = ""
        ,gRouteNo
        ,gRouteId
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Routes");
        displayRoutes();
        $("#route_id").select2({placeholder: "ROUTE",allowClear: true});
        $("#route_no").select2({placeholder: "ROUTE NO",allowClear: true});
    };
    
    function displayRoutes(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridRoutes").dataBind({
             sqlCode        : "R1224"
            ,height         : $(window).height() - 306
            ,blankRowsLimit : 5
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_id"              ,type:"hidden"      ,value: app.svn(d,"route_id")}) 
                                 + app.bs({name:"is_edited"             ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + (d !==null ? app.bs({name:"cb"       ,type:"checkbox"}) : "" );
                        }
                }
                ,{ text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                }
                ,{text: "Route Code"                             ,name:"route_code"               ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Route Description"                      ,name:"route_desc"               ,type:"input"       ,width : 450   ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter1']").setCheckEvent("#gridRoutes input[name='cb']");
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                var _routeId;
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
    	            _routeId = _data.route_id;
    	            $("#route_id").dataBind({
                        sqlCode      : "D1269"
                       ,text         : "route"
                       ,value        : "route_id"
                       ,onChange     : function(){
                           var _val = $(this).val();
                           gRouteId = _val;
                       }
                       ,onComplete   : function(){
                           $(this).val(_routeId).trigger("change");
                       }
                    });
    	            displayRouteNos(_routeId);
    	            $(".page-title").html("Routes » " + _data.route_code + " » " + _data.route_desc);
    	            $(".main-nav-tabs").find("[aria-controls='nav-routeno']").parent("li").removeClass("hide");
                });
            }
        });
    }
    function displayRouteNos(id){
        var cb = app.bs({name:"cbFilter3",type:"checkbox"});
        var _routeId = $("#route_id").val();
        $("#gridRouteNo").dataBind({
             sqlCode        : "R1427"
            ,parameters     : {route_id:id? id : _routeId}
            ,blankRowsLimit : 5
            ,height         : $(window).height() - 337         
            ,dataRows       : [
                 { text  : cb , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return   app.bs({name:"route_no_id"         ,type:"hidden"      ,value: app.svn(d,"route_no_id")})
                                 + app.bs({name:"is_edited"               ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                                 + app.bs({name:"route_id"                ,type:"hidden"      ,value: id}) 
                                 + (d !==null ? app.bs({name:"cb"         ,type:"checkbox"}) : "" );
                        }
                }
                ,{ text  : "" , width : 25   , style : "text-center" 
                    ,onRender  :  function(d)  
                        { return  (d !==null ? app.bs({name:"rb"       ,type:"radio"   ,style:" width: 13px; margin:0 5px; cursor:pointer;"}) : "" ); }
                }
                ,{text: "Route No."                       ,name:"route_no"             ,type:"input"       ,width : 60     ,style : "text-align:left;"}
                ,{text: "Route Name"                      ,name:"route_name"           ,type:"input"       ,width : 450    ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter3']").setCheckEvent("#gridRouteNo input[name='cb']");
                $(".main-nav-tabs").find("[aria-controls='nav-routeDtls']").parent("li").addClass("hide");
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
    	            _routeNo = _data.route_no;
    	            gRouteNo =_data.route_no;
    	            $("#route_no").dataBind({
                        sqlCode      : "D1431"
                       ,parameters   : {route_id: id? id :_routeId}
                       ,text         : "route"
                       ,value        : "route_no"
                       ,onComplete   : function(){
                           $(this).val(_data.route_no).trigger("change");
                       }
                    });
    	            displayRouteDetails(id,_routeNo);
    	            $(".page-title").html("Route » " + _data.route_no + " » " + _data.route_name);
    	            $(".main-nav-tabs").find("[aria-controls='nav-routeDtls']").parent("li").removeClass("hide");
                });
            }
        });
    }
    function displayRouteDetails(id,routeNo){
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
        var _routeId = $("#route_id").val();
        var _routeNo = $("#route_no").val();
        $("#gridRouteDetails").dataBind({
             sqlCode        : "R1221"
            ,parameters     : {route_id:id? id : _routeId,route_no:routeNo? routeNo : _routeNo}
            ,blankRowsLimit : 5
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
                ,{text: "Sequence No."                  ,name:"seq_no"               ,type:"input"       ,width : 80     ,style : "text-align:center;"}
                ,{text: "Map Area"                      ,name:"map_area"             ,type:"input"       ,width : 300    ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                $("[name='cbFilter2']").setCheckEvent("#gridRouteDetails input[name='cb']");
            }
        });
    }
    
    _pub.showModalRouteDetails = function(id,routeCode) {
        var  _mdl = $("#modalRouteDetails");
        _mdl.find(".modal-title").text("Route Code » " + routeCode ) ;
        
        displayRouteDetails(id);
        _mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        
    };
    
    $("#btnFilterVal").click(function(){
        var  _searchVal = $.trim($("#route_id").val()); 
        var  _route = $('#route_id option[value="'+_searchVal+'"]').text();
        
        $(".page-title").html("Routes » " + _route);
        displayRouteNos(); 
    });
    $("#btnFilterVal1").click(function(){
        var  _searchVal = $.trim($("#route_no").val()); 
        var  _route = $('#route_no option[value="'+_searchVal+'"]').text();
        
        $(".page-title").html(_route);
        displayRouteDetails(); 
        displayRouteNos();
    });
    $("#btnSaveRoute").click(function () {
       $("#gridRoutes").jsonSubmit({
             procedure: "routes_ref_upd"
            ,notIncludes: ["rb"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridRoutes").trigger("refresh");
            }
        });
    });
    $("#btnSaveRouteDetails").click(function () {
       $("#gridRouteDetails").jsonSubmit({
             procedure: "route_details_upd"
            ,notIncludes: ["rb"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $('#gridRouteDetails').trigger('refresh');
            }
        });
    }); 
    $("#btnSaveRouteNo").click(function () {
       $("#gridRouteNo").jsonSubmit({
             procedure: "route_nos_upd"
            ,notIncludes: ["rb"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $('#gridRouteNo').trigger('refresh');
            }
        });
    }); 
    $("#btnDeleteRoute").click(function(){ 
        $("#gridRoutes").deleteData({
            tableCode: "ref-00016" //code change to tableCode
            ,onComplete : function(d){
                $('#gridRoutes').trigger('refresh');
            }
         });      
    });
    $("#btnDeleteRouteNo").click(function(){ 
        $("#gridRouteNo").deleteData({
            tableCode: "ref-00015" //code change to tableCode
            ,onComplete : function(d){
                $('#gridRouteNo').trigger('refresh');
            }
         });      
    });
    $("#btnDeleteRouteDetails").click(function(){
        $("#gridRouteDetails").deleteData({
            tableCode: "ref-00013" //code change to tableCode
            ,onComplete : function(d){
                $('#gridRouteDetails').trigger('refresh');
            }
         }) ;     
    }); 
    
    return _pub;
})();            






       