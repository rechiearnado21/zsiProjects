(function(){
    
    var  bs    = zsi.bs.ctrl
        ,svn   = zsi.setValIfNull
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Employees");
        displayEmployees();
    };
    
    function displayEmployees(){
        var cb = bs({name:"cbFilter1",type:"checkbox"}); 
            _genderOptions      =   [
                                         { text:"M"     ,value:"M"          }
                                        ,{ text:"F"     ,value:"F"          }
                                    ]
                            
            /*,_civilStatusOptions =   [
                                         { text:"M"     ,value:"Married"    }
                                        ,{ text:"S"     ,value:"Single"     }
                                        ,{ text:"D"     ,value:"Divorced"   }
                                        ,{ text:"W"     ,value:"Widowed"    }
                                    ]*/
        
           /* ,_employementOptions =   [
                                         { text:"E"     ,value:"Employed"   }
                                        ,{ text:"O"     ,value:"OJT"        }
                                        ,{ text:"R"     ,value:"Regular"    }
                                        
                                    ]*/
        
           ,_inactiveTypeOptions =  [
                                         {text:"A"      ,value:"A"          }
                                        ,{text:"B"      ,value:"B"          }
                                    ] 
                                    
          /*  ,_payTypeCode         =  [
                                         {text:"A"      ,value:"A"          }
                                        ,{text:"B"      ,value:"B"          }
                                    ] */
        ;                           
        
    
        $("#grid").dataBind({
                 
                 sqlCode    : "E162"
                ,width      : $(".zContainer").outerWidth()
                ,height     : $(document).height() - 260
                ,blankRowsLimit : 5
                ,dataRows   : [
                     {text: cb                      ,width:25           ,style:"text-align:center"
                         ,onRender : function(d){
                            return bs({name:"id"          ,type:"hidden"  ,value: svn (d,"id")})
                                 + bs({name:"is_edited"   ,type:"hidden"  ,value: svn(d,"is_edited")}) 
                                 + (d !== null ? bs({name:"cb"  ,type:"checkbox"}) : "" );
                         }
                     }
                    ,{text:"Employee ID"            ,type:"input"       ,name:"employee_id"         ,width:105        ,style:"text-align:center"}
                    ,{text:"Last Name"              ,type:"input"       ,name:"last_name"           ,width:150        ,style:"text-align:left"  }
                    ,{text:"First Name"             ,type:"input"       ,name:"first_name"          ,width:150        ,style:"text-align:left"  }
                    ,{text:"Middle Name"            ,type:"input"       ,name:"middle_name"         ,width:75         ,style:"text-align:center"}
                    ,{text:"Name Suffix"            ,type:"input"       ,name:"name_suffix"         ,width:105        ,style:"text-align:left"  }
                    ,{text:"Gender"                 ,type:"select"      ,name:"gender"              ,width:50         ,style:"text-align:left"  }
                    ,{text:"Civil Status Code"      ,type:"select"      ,name:"civil_status_code"   ,width:100        ,style:"text-align:left"  }
                    ,{text:"Employement Type Code"  ,type:"select"      ,name:"empl_type_code"      ,width:140        ,style:"text-align:left"  }
                    ,{text:"Basic Pay"              ,type:"input"       ,name:"basic_pay"           ,width:105        ,style:"text-align:left"  }
                    ,{text:"Pay Type Code"          ,type:"select"      ,name:"pay_type_code"       ,width:105        ,style:"text-align:left"  }
                    ,{text:"SSS No."                ,type:"input"       ,name:"sss_no"              ,width:105        ,style:"text-align:left"  }
                    ,{text:"TIN"                    ,type:"input"       ,name:"tin"                 ,width:105        ,style:"text-align:left"  }
                    ,{text:"PhilHealth No."         ,type:"input"       ,name:"philhealth_no"       ,width:105        ,style:"text-align:left"  }
                    ,{text:"HMDF No."               ,type:"input"       ,name:"hmdf_no"             ,width:105        ,style:"text-align:left"  }
                    ,{text:"Account No."            ,type:"input"       ,name:"account_no"          ,width:105        ,style:"text-align:left"  }
                    ,{text:"Active?"                ,type:"yesno"       ,name:"is_active"           ,width:50         ,style:"text-align:center"    ,defaultValue:"Y"}
                    ,{text:"In Active Type Code"    ,type:"select"      ,name:"inactive_type_code"  ,width:130        ,style:"text-align:left"  }
                    ,{text:"Inactive Date"          ,type:"input"       ,name:"inactive_data"       ,width:120        ,style:"text-alignleft"   }
                    ,{text:"Position"               ,type:"select"      ,name:"position_id"         ,width:120        ,style:"text-alignleft"   }
            ]
            ,onComplete: function(){
                var _zRow = this.find(".zRow");
                this.find("#cbFilter1").setCheckEvent("#grid input[name='cb']");
                this.find("select[name='gender']").fillSelect({data: _genderOptions}); 
                this.find("select[name='civil_status_code']").dataBind("civil_status");
                this.find("select[name='empl_type_code']").dataBind("empl_types");
                this.find("select[name='inactive_type_code']").fillSelect({data: _inactiveTypeOptions});
                this.find("select[name='pay_type_code']").dataBind("pay_types");
                _zRow.find("#position_id").dataBind({
                     sqlCode      : "P201" //position_sel
                    ,text         : "position_title"
                    ,value        : "position_id"
                });
            }  
        });
    }  
    
    $("#btnSave").click(function () {
       $("#grid").jsonSubmit({
                 procedure: "employees_upd"
                ,onComplete: function (data) {
                    if(data.isSuccess===true) zsi.form.showAlert("alert");
                    displayEmployees();
                }
        });
    });
    
    $("#btnDelete").click(function(){
        zsi.form.deleteData({
             code       : "ref-0005"
            ,onComplete : function(data){
                displayEmployees();
            }
        });   
    });  
    
})();

                   