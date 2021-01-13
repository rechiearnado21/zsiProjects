  (function(){
    var      bs                     = zsi.bs.ctrl
            ,svn                    = zsi.setValIfNull
            ,gtw                    = null
    ;
    zsi.ready = function() {
        $(".page-title").html("Level Other Income");
        displayLevelOtherIncome();
    };
    
     $("#btnSaveLevelOtherIncome").click(function () {
       $("#gridLevelOtherIncome").jsonSubmit({
                 procedure  : "level_other_income_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridLevelOtherIncome").trigger("refresh");
                }
        });
    });
    $("#btnDeleteLevelOtherIncome").click(function(){
        zsi.form.deleteData({
             code       : "ref-00019"
            ,onComplete : function(data){
                $("#gridLevelOtherIncome").trigger("refresh");
              }
        });       
    });
    
     function displayLevelOtherIncome(){
        var cb = app.bs({name:"cbFilter",type:"checkbox"});
        $("#gridLevelOtherIncome").dataBind({
             sqlCode        : "L205" //level_other_income_sel
            ,blankRowsLimit : 5
            ,width          : $(".panel-container").width() 
            ,height         : $(document).height() - 260
            ,dataRows       : [
                { text  : cb , width : 25   , style : "text-center" 
                    , onRender  :  function(d)
                        { return  app.bs({name:"level_other_income_id"      ,type:"hidden"       ,value: app.svn(d,"level_other_income_id")})
                                + app.bs({name:"is_edited"                  ,type:"hidden"       ,value: app.svn(d,"is_edited")})
                                + (d !==null ? app.bs({name:"cb"            ,type:"checkbox"}) : "" ); }
                }
                ,{text: "Level"                 ,name:"level_id"            ,type:"select"       ,width : 200   ,style : "text-align:left;"}
                ,{text: "Other Income"          ,name:"other_income_id"     ,type:"select"       ,width : 200   ,style : "text-align:left;"}
                ,{text: "Amount"                ,name:"amount"              ,type:"input"        ,width : 200   ,style : "text-align:center;"}
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                $("#cbFilter").setCheckEvent("#gridLevelOtherIncome input[name='cb']");
                _zRow.find("#level_id").dataBind({
                    sqlCode      : "L196" //levels_sel
                   ,text         : "level_title"
                   ,value        : "level_id"
                });
                _zRow.find("#other_income_id").dataBind({
                    sqlCode      : "O198" //other_income_sel
                   ,text         : "other_income_code"
                   ,value        : "other_income_id"
                });
            }
        });
    } 
})();        