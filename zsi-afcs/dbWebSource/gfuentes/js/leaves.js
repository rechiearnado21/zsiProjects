(function(){
    var      bs                     = zsi.bs.ctrl
            ,svn                    = zsi.setValIfNull
            ,gtw                    = null
    ;
    zsi.ready = function() {
        $(".page-title").html("Leaves");
        runDatePicker();
        $(".panel").css("height", $(".page-content").height());
        
        $("#userId").dataBind({
             sqlCode     : "U77" //users_sel
            ,text        : ("first_name"," ","middle_name"," ","last_name")
            ,value       : "user_id"
        })
        $("#leaveTypeId").dataBind({
             sqlCode     : "L187" //leave_types_sel
            ,text        : "leave_type"
            ,value       : "leave_type_id"
        })
    };
    
    
    runDatePicker = function(){
        $('#datepicker').datepicker(
        {
             todayHighlight  : true
            ,multidate       : true
            ,pickTime        : false
            
        }).on('changeDate', function(e) {
            $(this).closest('.input-group').find('.count').text(' ' + e.dates.length);
        });
            
    };
    
    $("#btnSaveLeaves").click(function () {
       $("#gridLeaves").jsonSubmit({
                 procedure  : "filed_leaves_upd"
                ,optionalItems: ["is_active"]
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    $("#gridLeaves").trigger("refresh");
                }
        });
    });
    $("#btnDeleteLeaves").click(function(){
        zsi.form.deleteData({
             code       : "ref-00014"
            ,onComplete : function(data){
                $("#gridLeaves").trigger("refresh");
              }
        });       
    });
    
    $("#btnGo").click(function () {
        var _row  = $(this).closest(".row");
        var _date = _row.find('#datepicker').val();
        var _user = _row.find('#userId').val();
        var _leaveType = _row.find('#leaveTypeId').val();
        var _rows = [];
        var _info = null;
        
        x = _date;
        
        $.each(_date.split(","), function(i,v){
            _info = { 
                 employee_id    : _user
                ,leave_type_id  : _leaveType
                ,leave_date     : v
            };
            
            if(i >= 0 && _date !== ""){
                $(".row").find("#gridId").removeClass("d-none");
                $(".row").find("#btnId").removeClass("d-none");
            }else{
                $(".row").find("#gridId").addClass("d-none");
                $(".row").find("#btnId").addClass("d-none");
            }
             _rows.push(_info);
        });
       
        displayDateOfLeaves(_rows);

    });
    
     function displayDateOfLeaves(data){
        $("#gridLeaves").dataBind({
             //sqlCode        : "F183" //filed_leaves_sel
             rows           : data
            ,width          : $(".zContainer").width() 
            ,height         : $(document).height("")
            ,dataRows       : [
                {text: "File Date"                                                              ,width : 190   ,style : "text-align:left;"
                    ,onRender  :  function(d)
                        { return   app.bs({name:"leave_id"                  ,type:"hidden"      ,value: app.svn(d,"leave_id")})
                                 + app.bs({name:"is_edited"                 ,type:"hidden"      ,value: app.svn(d,"is_edited")}) 
                                 + app.bs({name:"employee_id"               ,type:"hidden"      ,value: app.svn(d,"employee_id")})
                                 + app.bs({name:"leave_type_id"             ,type:"hidden"      ,value: app.svn(d,"leave_type_id")})
                                 + app.bs({name:"file_date"                 ,type:"input"       ,value: app.svn(d,"file_date")});
                        }
                }
                ,{text: "Leave Date"            ,name:"leave_date"          ,type:"input"       ,width : 190   ,style : "text-align:left;"}
                ,{text: "Filed Hours"           ,name:"filed_hours"         ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Approved Hours"        ,name:"approved_hours"      ,type:"input"       ,width : 150   ,style : "text-align:left;"}
                ,{text: "Approved?"                                                             ,width : 70    ,style : "text-align:left;" ,defaultValue:"N"
                    ,onRender  :  function(d)
                        { return   app.bs({name:"is_approved"               ,type:"yesno"       ,value: app.svn(d,"is_approved")})
                                 + app.bs({name:"is_approved_by"            ,type:"hidden"      ,value: app.svn(d,"is_approved_by")})
                                 + app.bs({name:"is_approved_date"          ,type:"hidden"      ,value: app.svn(d,"is_approved_date")}) ;
                        }
                }
                ,{text: "Leave Reason"          ,name:"leave_reason"        ,type:"input"       ,width : 200   ,style : "text-align:left;"}
                ,{text: "Approver Comment"                                                      ,width : 200   ,style : "text-align:left;"
                    ,onRender  :  function(d)
                        { return   app.bs({name:"approver_comment"          ,type:"input"       ,value: app.svn(d,"approver_comment")})  
                                 + app.bs({name:"created_by"                ,type:"hidden"      ,value: app.svn(d,"created_by")})
                                 + app.bs({name:"created_date"              ,type:"hidden"      ,value: app.svn(d,"created_date")}) ;
                        }
                }
                
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                _zRow.find("[name='file_date']").datepicker({todayHighlight:true}).datepicker("setDate", "0");
                
            }
        });
    } 
})();     