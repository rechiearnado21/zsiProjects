var buyLoad = (function(){
    var _pub = {};
    
    zsi.ready = function(){
        $(".page-title").html("Buy Load");
        $(".panel-container").css("min-height", $(window).height() - 160);
        $("#buyLoadForm").find("#amount").val("0");
        $("#qrId").dataBind({
            sqlCode    : "G218" //generated_qrs_sel
           ,text       : "hash_key"
           ,value      : "id"
       });
    };
    
    _pub.myFunction = function(button) {
        var x = button.value;
        $("#buyLoadForm").find("#amount").val(x);
    };
    
    function printDiv(qrcode) {
        setTimeout(function(){
            var mywindow = window.open('', '');
            mywindow.document.write('<html><body style="text-align:center;">');
            mywindow.document.write('<h1 style="margin-top:20px;">Your Generated QR!</h1>');
            mywindow.document.write('<div style="align-items:center;display: flex;justify-content: center;">');
            mywindow.document.write(document.getElementById(qrcode).innerHTML);
            mywindow.document.write('</div><footer style="margin-top:30px;">Powered by: @zettasolutions.net</footer>');
            mywindow.document.write('</body></html>');
            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
            return true;
        }, 500);
     
    }
    
    $("#btnClearAll").on('click',function(){
        $("#buyLoadForm").find("#amount").val("0");
    });
    
    $("#btnPrintQr").click(function () {
        $.get(app.procURL + "get_qr_sel ", function(data){
            var index   = data.rows[0];
            var _hash_key = index.hash_key;
            $("#buyLoadForm").find("#hash_key").val(_hash_key);
        });
        $("#buyLoadForm").jsonSubmit({
             procedure: "generated_qr_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                var _qrId = data.returnValue;
                var _hash_key = $('#qrId option[value="'+_qrId+'"]').text();
                
                console.log("_hash_key",_hash_key);
                if(data.isSuccess){
                   $("#qrcode").text("");
                   var qrcode = new QRCode($("#qrcode").get(0),{width:200,height:200,text:"center"}).makeCode(_hash_key);
                   if(data.isSuccess===true) zsi.form.showAlert("alert");
                   printDiv("qrcode");
                }
            }
        }); 
    });
    
    $("#btnScanQr").click(function() {
         
        let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        scanner.addListener('scan', function (content) {
            console.log(content);
            $("#buyLoadForm").find("#hash_key").val(content);
        });
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
            scanner.start(cameras[0]);
            } else {
                console.error('No cameras found.');
            }
        }).catch(function (e) {
            console.error(e);
        });
         
        $("#buyLoadForm").jsonSubmit({
             procedure: "generated_qr_upd"
            ,isSingleEntry: true
            ,onComplete: function (data) {
                if(data.isSuccess){
                   if(data.isSuccess===true) zsi.form.showAlert("alert");
                }
            }
        });
    });
    
    /*$("#btnScanQr").click(function() {
        $("#vidContainer").removeClass("d-none");
        $("#videoElement").attr("autoplay", true);
        var video = document.querySelector("#videoElement");

    	if (navigator.mediaDevices.getUserMedia) {
    	  navigator.mediaDevices.getUserMedia({ video: true })
    	    .then(function (stream) {
    	      video.srcObject = stream;
    	    })
    	    .catch(function (err0r) {
    	      console.log("Something went wrong!");
    	    });
    	}
    });*/
    
    return _pub;
})();               