   var pp = (function(){
    var  _pub            = {}
         ,svn           = zsi.setValIfNull 
    ;
    
    zsi.ready = function(){ 
        $(".page-title").html("Pay Partner");
        $(".panel-container").css("min-height", $(window).height() - 190); 
        displayPayPartner();   
    };
    _pub.showPartner = function(partnerId){ 
        $("#pay_partner_id").val(partnerId);
        $('#modalPartner').modal({ show: true, keyboard: false, backdrop: 'static' });   
        $('#apiForm').find("input").val("");
    };  
    function displayPayPartner(){    
        var cb = app.bs({name:"cbFilter1",type:"checkbox"});  
        $("#gridPayPartner").dataBind({
             sqlCode        : "P1390"  
    	    ,height         : $(window).height() - 300  
    	    ,blankRowsLimit : 5
            ,dataRows       : [ 
		        {text  : "Partner Name"          , width : 150              , style : "text-align:left;"            ,type:"input"       ,name:"first_name"       
                    ,onRender : function(d){
                         return app.bs({name:"pay_partner_id"               ,type:"hidden"                          ,value: app.svn(d,"pay_partner_id")}) 
                            +  app.bs({name:"is_edited"                     ,type:"hidden"      ,value: app.svn(d,"is_edited")})
                            +  app.bs({name:"partner_name"                  ,type:"input"                           ,value: app.svn(d,"partner_name")});
                    }
                }
                ,{text  : "Client"              , width : 150               , style : "text-align:left;"            ,type:"input"       ,name:"client_id"  }
                ,{text  : "Client Secret"       , width : 130               , style : "text-align:center;"          ,type:"input"       ,name:"client_secret" } 
                ,{text  : "Merchant"            , width : 130               , style : "text-align:center;"          ,type:"input"       ,name:"merchant" } 
                ,{text  : "API's"               ,width:60                   ,style:"text-align:center"
                    ,onRender : function(d){ 
                            var _link = "<a href='javascript:void(0)' ' title='API's onclick='pp.showPartner(\""+ app.svn (d,"pay_partner_id") +"\")'><i class='fas fa-plus'></i></a>";
                            return (d !== null ? _link : ""); 
                    }
                }
            ]
            ,onPageChange : function(){
                ctr=-1;
            }
            ,onComplete: function(o){
             
            }
        });    
    } 
    $("#btnSavePartner").click(function () {  
        $("#gridPayPartner").jsonSubmit({
             procedure: "pay_partner_upd" 
            ,onComplete: function (data) {
                if(data.isSuccess){  
                   partnerId = data.returnValue; 
                   zsi.form.showAlert("alert"); 
                   $("#gridPayPartner").trigger("refresh")
                } 
            }
        }); 
    });
    $("#btnSubmitAPI").click(function () {  
        $("#apiForm").jsonSubmit({
             procedure: "pay_partner_apis_upd" 
            ,isSingleEntry : true
            ,onComplete: function (data) {
                if(data.isSuccess){   
                   zsi.form.showAlert("alert"); 
                   $("#gridPayPartner").trigger("refresh")
                } 
            }
        }); 
    });
    return _pub;
})();     


                             