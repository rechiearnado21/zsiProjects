 var vehicles = (function(){
    var _pub                = {}
        ,bs                 = zsi.bs.ctrl
        
    ;
    zsi.ready = function(){
        $(".page-title").html("Loading Branch Deposits"); 
        LoadingBranchDeposit();
         
    };
     
    function LoadingBranchDeposit(company_id,searchVal){
         var cb = app.bs({name:"cbFilter3",type:"checkbox"});
        $("#gridLoadingBranchDeposit").dataBind({
             sqlCode        : "L1300" //loading_branch_deposits_sel 
            ,height         : $(window).height() - 240
            ,blankRowsLimit : 5
            ,dataRows       : [
                {text: cb  ,width : 25   ,style : "text-align:left"
                            ,onRender  :  function(d)  
                                { return   app.bs({name:"loading_branch_deposit_id"    ,type:"hidden"  ,value: app.svn(d,"loading_branch_deposit_id")})
                                         + app.bs({name:"is_edited"             ,type:"hidden"  ,value: app.svn(d,"is_edited")})  
                                         + (d !==null ? app.bs({name:"cb",type:"checkbox"}) : "" );
                                }
                        }
                ,{text: "Loadin Branch"                     ,name:"loading_branch_id"           ,type:"select"      ,width : 100   ,style : "text-align:left;"}        
                ,{text: "Deposit Date"                      ,name:"deposit_date"                ,type:"input"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Deposit Ref No."                   ,name:"deposit_ref_no"              ,type:"input"      ,width : 100   ,style : "text-align:left;"}
                ,{text: "Deposit Amount"                    ,name:"deposit_amount"              ,type:"input"      ,width : 100   ,style : "text-align:left;"}
                 
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                    _zRow.find("[name='deposit_date']").datepicker({
                        autoPickTime : false
                        ,todayHighlight: true
                        ,autoclose : true
                    })
                    _zRow.find("[name='cbFilter3']").setCheckEvent("#gridLoadingBranchDeposit input[name='cb']");
                   /* _zRow.find("[name='loading_branch_id']").dataBind({
                        sqlCode : ""
                        ,text   :
                    });*/
                    
            }
        });
    } 
     
    $("#btnSaveLoadinBranchDeposit").click(function () {
       $("#gridLoadingBranchDeposit").jsonSubmit({
             procedure: "loading_branch_deposits_upd" 
            ,onComplete: function (data) {
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                $("#gridLoadingBranchDeposit").trigger("refresh");
            }
        });
    });  
    return _pub;
})();                         