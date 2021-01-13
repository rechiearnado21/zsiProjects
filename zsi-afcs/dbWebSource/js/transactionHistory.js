 var th = (function(){ 
    var _pub                = {}
        ,bs                 = zsi.bs.ctrl 
    ;
    zsi.ready = function(){
        $(".page-title").html("Transaction History");   
        validation();
    }; 
    
    _pub.showModalTransaction = function (eL,id,vehiclePlateNo,fileName,Fname,Pdate) { 
        var _frm = $("#frm_modalTransactionHistory"); 
        var _imgFilename = fileName !=="" ? "/file/viewImage?fileName="+fileName : "../img/avatar-m.png"; 
        _frm.find("#plateNoId").text(vehiclePlateNo); 
        _frm.find("#imgFilename").attr("src", _imgFilename); 
        _frm.find("#passenger_id").text(Fname); 
        _frm.find("#payment_date").text(Pdate.toShortDate()); 
        $('#modalTransactionHistory').modal({ show: true, keyboard: false, backdrop: 'static' }); 
        
    };  
    
    function validation(){
        $("#passengerRadio").click(function(){
            $("#passengerForm").removeClass("hide");
            $("#vehicleForm").addClass("hide");
            $("#passengerForm").find("input").val("");
             $("#VehicleRow").addClass("hide");
        });
        $("#vehicleRadio").click(function(){ 
            $("#vehicleForm").removeClass("hide");
            $("#passengerForm").addClass("hide");
            $("#PassengerRow").addClass("hide");
            $("#vehicleForm").find("input").val("");
        }); 
        $("#travel_date").datepicker({
             autoclose : true
            ,endDate: new Date() 
        }).datepicker("setDate", "-1d");  
         
        $("#V_toDate").attr("disabled",true);
        $("#V_fromDate").datepicker({
             autoclose : true 
             ,endDate: new Date()
            ,todayHighlight: false 
        }).datepicker("setDate",'-1d').on("changeDate",function(e){ 
            if($(this).val() ===""){ $("#V_toDate").attr("disabled",true); $("#V_toDate").val(""); }
            else{ $("#V_toDate").removeAttr("disabled"); } 
            $("#V_toDate").removeAttr("disabled",true);  
            $("#V_toDate").datepicker('setStartDate', e.date); 
        });
         
        $("#V_toDate").datepicker({
             autoclose : true
            ,todayHighlight: false 
            ,endDate: new Date()
        }).datepicker("setDate",'-1d');   
        
    }
    function displayPassengerHistory(Lname,Fname,Tdate){
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridPassengerHistory").dataBind({
             sqlCode        : "P1295" 
             ,parameters     : {
                                 last_name      :  (Lname ? Lname : '')
                                ,first_name     :  (Fname ? Fname : '')
                                ,travel_date     : (Tdate ? Tdate : '') 
            }
    	    ,height         : $(window).height() - 300  
            ,dataRows       : [
                {text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"}
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"}
                ,{text  : "<div id='Transactions'>Transactions</div>"        , width : 150           , style : "text-align:center;"   
                    ,onRender : function(d){
                            var _link = "<a href='javascript:void(0)' ' title='View Transactions'onclick='th.showModalTransaction(this,"+ app.svn (d,"consumer_id") +", \""+ app.svn (d,"vehicle_plate_no") +"\",\""+ app.svn (d,"vehicle_img_filename") +"\",\""+ app.svn (d,"last_name") +","+app.svn (d,"first_name") +"\",\""+ app.svn (d,"payment_date") +"\")'><i class='fas fa-eye'></i></a>";
                            return (d !== null ? _link : "");
                    }
                } 
            ] 
            ,onComplete: function(o){
                gUsersData = o.data.rows;
                $('.has-tooltip').tooltip();  
            }
        });
        
    }   
    function displayVehicleHistory(Lname,Fname,Fdate,ToDate){  
        var cb = app.bs({name:"cbFilter1",type:"checkbox"}); 
        $("#gridVehicleHistory").dataBind({
             sqlCode        : "V1296"
             ,parameters    : {
                                 last_name      :  (Lname  ? Lname  : '')
                                ,first_name     :  (Fname  ? Fname  : '')
                                ,time_start     :  (Fdate  ? Fdate  : '')
                                ,time_end       :  (ToDate ? ToDate : '')
            }
    	    ,height         : $(window).height() - 300  
            ,dataRows       : [
                 {text  : "Last Name"           , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"last_name"}
                ,{text  : "First Name"          , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"first_name"}
                ,{text  : "Date & Time"         , width : 150           , style : "text-align:left;"            ,type:"input"       ,name:"payment_date"}
                 
            ] 
            ,onComplete: function(o){
                gUsersData = o.data.rows; 
            }
        }); 
    }
     
    $("#btnPassenger").click( function() {
       var _$PLName = $.trim($("#P_last_name").val()) 
           ,_$PfName = $.trim($("#P_first_name").val()) 
           ,_$TravelDate = $.trim($("#travel_date").val());  
        $("#PassengerRow").removeClass("hide"); 
        displayPassengerHistory(_$PLName,_$PfName,_$TravelDate); 
       
    });
    $("#btnClearPassenger").click( function() {
        $("#P_last_name").val("") ;
        $("#P_first_name").val("");   
        displayPassengerHistory(""); 
    });
     
    $("#btnClearVehicle").click( function() {
        $("#V_last_name").val("");
        $("#V_first_name").val("");
        $("#V_fromDate").val("");
        $("#V_toDate").val("");
        displayVehicleHistory("");
         
    });   
    $("#btnSearchVehicle").click( function() {  
       var _$VLName = $.trim($("#V_last_name").val()) 
            ,_$VfName = $.trim($("#V_first_name").val()) 
            ,_$FDate = $.trim($("#V_fromDate").val())
            ,_$ToDate = $.trim($("#V_toDate").val()); 
           displayVehicleHistory(_$VLName,_$VfName,_$FDate,_$ToDate);
        $("#VehicleRow").removeClass("hide"); 
    }); 
    return _pub;
})();               










   