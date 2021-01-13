  (function(){
    var      bs                     = zsi.bs.ctrl
            ,svn                    = zsi.setValIfNull
            ,gtw                    = null
    ;
    zsi.ready = function() {
        $(".page-title").html("Positions");
        displayPositions();
    };
    
     $("#btnSavePosition").click(function () {
       $("#gridPosition").jsonSubmit({
                 procedure  : "positions_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridPosition").trigger("refresh");
                }
        });
    });
    $("#btnDeletePosition").click(function(){
        zsi.form.deleteData({
             code       : "ref-00018"
            ,onComplete : function(data){
                $("#gridPosition").trigger("refresh");
              }
        });       
    });
    
     function displayPositions(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridPosition").dataBind({
             sqlCode        : "P201" //positions_sel
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(document).height() - 260
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"position_id"                    ,type:"hidden"       ,value: app.svn(d,"position_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Position Title"            ,name:"position_title"      ,type:"input"        ,width : 150   ,style : "text-align:left;"}
                ,{text: "Position Description"      ,name:"position_desc"       ,type:"input"        ,width : 200   ,style : "text-align:left;"}
                ,{text: "Work Description"          ,name:"work_desc"           ,type:"input"        ,width : 200   ,style : "text-align:left;"}
                ,{text: "Level"                     ,name:"level_id"            ,type:"select"       ,width : 200   ,style : "text-align:left;"}
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                $("#cbFilter").setCheckEvent("#gridPosition input[name='cb']");
                
                _zRow.find("#level_id").dataBind({
                    sqlCode  : "L196" //levels_sel
                   ,text     : "level_title"
                   ,value    : "level_id"
                });
                
            }
        });
    } 
})();     