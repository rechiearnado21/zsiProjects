 var route = (function(){
    var _pub            = {};
    
    zsi.ready = function(){
        $(".page-title").html("Routes");
        displayRoutes();

    };
    
    function displayRoutes(){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});
        $("#gridRoutes").dataBind({
             sqlCode        : "R1224" //route_ref_sel
            ,height         : $(window).height() - 240
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
                ,{text: "Route Code"                             ,name:"route_code"     ,type:"input"   ,width : 150   ,style : "text-align:left;"}
                ,{text: "Route Description"                      ,name:"route_desc"               ,type:"input"       ,width : 450   ,style : "text-align:left;"}
            ]
            ,onComplete: function(o){
                $("[name='cbFilter1']").setCheckEvent("#gridRoutes input[name='cb']");
                var _dRows = o.data.rows;
                var _this  = this;
                var _zRow  = _this.find(".zRow");
                _zRow.find("input[type='radio']").click(function(){
    	            var _i      = $(this).closest(".zRow").index();
    	            var _data   = _dRows[_i];
    	            displayRouteDetails(_data.route_id);
    	            $(".page-title").html("Routes » " + _data.route_code + " » " + _data.route_desc);
    	            $("#nav-tab").find("[aria-controls='nav-routeDtls']").removeClass("hide");
                });
            }
        });
    }
    
    function displayRouteDetails(id){
        var cb = app.bs({name:"cbFilter2",type:"checkbox"});
        $("#gridRouteDetails").dataBind({
             sqlCode        : "R1221"
            ,parameters     : {route_id:id}
            ,blankRowsLimit : 5
            ,height         : $(window).height() - 240         
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
                ,{text: "Location"                      ,name:"location"             ,type:"input"       ,width : 250    ,style : "text-align:left;"}
                ,{text: "Distance Kilometer"            ,name:"distance_km"          ,type:"input"       ,width : 110    ,style : "text-align:center;"}
                ,{text: "Sequence No."                  ,name:"seq_no"               ,type:"input"       ,width : 80     ,style : "text-align:center;"}
                ,{text: "Map Area"                      ,name:"map_area"             ,type:"input"       ,width : 300    ,style : "text-align:left;"}
            ]
            ,onComplete: function(){
                $("[name='cbFilter2']").setCheckEvent("#gridRouteDetails input[name='cb']");
                this.find('[name="dummy_id"]').attr("readonly",true);
            }
        });
    }
    
    _pub.showModalRouteDetails = function(id,routeCode) {
        g$mdl = $("#modalRouteDetails");
        g$mdl.find(".modal-title").text("Route Code » " + routeCode ) ;
        g$mdl.modal({ show: true, keyboard: false, backdrop: 'static' });
        displayRouteDetails(id);
    };
    
    $("#btnSaveRoute").click(function () {
       $("#gridRoutes").jsonSubmit({
             procedure: "routes_ref_upd"
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridRoutes").trigger("refresh");
            }
        });
    });
    
    $("#btnSaveRouteDetails").click(function () {
       $("#gridRouteDetails").jsonSubmit({
             procedure: "route_details_upd"
            ,notIncludes : ["dummy_id"]
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $('#gridRouteDetails').trigger('refresh');
            }
        });
    });
    
    $("#btnDeleteRoute").click(function(){
        zsi.form.deleteData({
             code       : "ref-00016"
            ,onComplete : function(data){
                $('#gridRoutes').trigger('refresh');
            }
        });       
    });
    
    $("#btnDeleteRouteDetails").click(function(){
        zsi.form.deleteData({
             code       : "ref-00013"
            ,onComplete : function(data){
                $('#gridRouteDetails').trigger('refresh');
            }
        });       
    });
    
    return _pub;
})();         