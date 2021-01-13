 (function(){
    var      bs                     = zsi.bs.ctrl
            ,svn                    = zsi.setValIfNull
            ,gtw                    = null
    ;
    zsi.ready = function() {
        $(".page-title").html("Levels");
        displayLevels();
    };
    
     $("#btnSaveLevel").click(function () {
       $("#gridLevel").jsonSubmit({
                 procedure  : "levels_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridLevel").trigger("refresh");
                }
        });
    });
    $("#btnDeleteLevel").click(function(){
        zsi.form.deleteData({
             code       : "ref-00017"
            ,onComplete : function(data){
                $("#gridLevel").trigger("refresh");
              }
        });       
    });
    
     function displayLevels(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridLevel").dataBind({
             sqlCode        : "L196" //levels_sel
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(document).height() - 260
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"level_id"                       ,type:"hidden"       ,value: app.svn(d,"level_id")})
                                + app.bs({name:"is_edited"                      ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"                ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Level No."                 ,name:"level_no"            ,type:"input"       ,width : 140   ,style : "text-align:left;"}
                ,{text: "Level Title"               ,name:"level_title"         ,type:"input"       ,width : 200   ,style : "text-align:left;"}
                ,{text: "Level Description"         ,name:"level_description"   ,type:"input"       ,width : 200   ,style : "text-align:left;"}
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                $("#cbFilter").setCheckEvent("#gridLevel input[name='cb']");
                
            }
        });
    } 
})();      