 
var consumer = (function(){
    var  _pub = {} 
        ,gWidth = 280  
        ,gHeight = 0  
        ,gStreaming = false  
        ,gVideo = null
        ,gCanvas = null
        ,gPhoto = null
        ,gStartButton = null
        ,gFile = null
        ,gScanned = false
        ,gFilename = ""
    ; 
    
    zsi.ready = function(){ 
        $(".page-title").html("Consumers Registration");
        $(":input").inputmask();  
        $("#country_id").dataBind({
            sqlCode     : "D1274"
            ,text       : "country_name"
            ,value      : "country_id" 
            ,onComplete : function(){
                this.val(1).trigger("change");
            }
            ,onChange   : function(d){
                var _info = d.data[d.index - 1]
                    ,country_id = isUD(_info) ? 1 : _info.country_id; 
                $("#state_id").dataBind({
                     sqlCode    : "D1275"
                    ,parameters : {country_id:country_id}
                    ,text       : "state_name"
                    ,value      : "state_id" 
                    ,onChange : function(d){
                        var _info = d.data[d.index - 1]
                            ,state_id = isUD(_info) ? 1 : _info.state_id; 
                        $("#city_id").dataBind({
                             sqlCode      : "D1273"
                            ,parameters   : {state_id:state_id}
                            ,text         : "city_name"
                            ,value        : "city_id" 
                        });
                    }
                });
            }
        });   
        if(navigator.mediaDevices){  
            if(zsi.isMobileDevice){ 
                $("#image_file2").removeClass('hide');
                $("#desktop-camera,#takePicture").addClass('hide'); 
            } 
         }
        else alert("Camera is disabled for non-https connection");
        $(document).on('click', '.toggle-password', function() { 
            $(this).toggleClass("fa-eye fa-eye-slash"); 
            var input = $("#password");
            input.attr('type') === 'password' ? input.attr('type','text') : input.attr('type','password')
        });
        $("#image_file2").change(function() {
            gFilename = $(this).val().replace(/C:\\fakepath\\/, '');
            $("#image_file").val(filename);
        });
    };  
    function startup(){
        gVideo = document.getElementById('video');
        gCanvas = document.getElementById('canvas');
        gPhoto = document.getElementById('photo');
        gStartButton = document.getElementById('startbutton');
        gFile = document.getElementById('image_file');
    
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'environment'
            }
        })
        .then(function(stream) {
          gVideo.srcObject = stream;
          gVideo.play();
        })
        .catch(function(err) {
          console.log("An error occurred: " + err);
        });
    
        gVideo.addEventListener('canplay', function(ev){
          if (!gStreaming) {
            gHeight = gVideo.videoHeight / (gVideo.videoWidth/gWidth);
          
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
          
            if (isNaN(gHeight)) {
              gHeight = gWidth / (4/3);
            }
          
            gVideo.setAttribute('width', gWidth);
            gVideo.setAttribute('height', gHeight);
            gCanvas.setAttribute('width', gWidth);
            gCanvas.setAttribute('height', gHeight);
            gStreaming = true;
          }
        }, false);
    
        startbutton.addEventListener('click', function(ev){
          takepicture();
          ev.preventDefault();
        }, false);
        
        clearphoto();
      }  
    function clearphoto(){
        var context = gCanvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, gCanvas.width, gCanvas.height); 
        var _data = canvas.toDataURL('image/png');
        gPhoto.setAttribute('src', _data);
        gFile.value = _data;
         
    } 
    function takepicture(){ 
        var context = canvas.getContext('2d');
        if (gWidth && gHeight) {
            gCanvas.width = gWidth;
            gCanvas.height = gHeight;
            context.drawImage(video, 0, 0, gWidth, gHeight); 
            var data = canvas.toDataURL();
            gPhoto.setAttribute('src', data);
            gFile.value = data.replace(/^data:image\/(png|jpg);base64,/, '') ;  
    
        } else {
          clearphoto();
        }
    }
    function accessMediaScanner(){ 
        var _$mdl = $('#scanQRModal');  
        let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
        scanner.addListener('scan', function (content) {  
            zsi.getData({
                 sqlCode    : "G1419" 
                ,parameters :  {hash_key:content}
                ,onComplete : function(d) { 
                    if(d.rows.length===0){ 
                        alert("Invalid QR Code. please scan again.");
                        scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
                    }else{ 
                        gScanned=true;
                        var _qrId   = d.rows[0].id; 
                        $("#qr_id").val(_qrId);  
                        $("#scanModalClose").click(); 
                        if(! zsi.isMobileDevice){ 
                            Instascan.Camera.getCameras().then(function (cameras) { 
                                if (cameras.length > 0) {
                                    scanner.stop(cameras[0]); 
                                }  
                            }); 
                        }
                    }
                }
            }); 
        });
        Instascan.Camera.getCameras().then(function (cameras) {
            if (cameras.length > 0) {
                _$mdl.modal({ show: true, keyboard: false, backdrop: 'static' }); 
                var selectedCam = cameras[0];
                $.each(cameras, (i, c) => {
                    if (c.name.indexOf('back') !== -1) {
                        selectedCam = c;
                        return false;
                    }
                });
        
                scanner.start(selectedCam);
            } else { 
                alert('No cameras found.');
            }
        }).catch(function (e) {
            alert(e + " please reload page");
            console.error(e);
        });  
    }
    
    $("#btnSave").click(  function (){ 
        var _$frm = $("#formConsumer");  
        zsi.executeCmd({ 
                 sqlCode : "Z1406"
                ,parameters: {
                 address     : $('#address').val()
                ,birthdate   : $('#birthdate').val()
                ,city_id     : $('#city_id').val()
                ,country_id  : $('#country_id').val()
                ,email       : $('#email').val()
                ,first_name  : $('#first_name').val()
                ,last_name   : $('#last_name').val()
                ,middle_name : $('#middle_name').val()
                ,mobile_no   : $('#mobile_no').val()
                ,qr_id       : $("#qr_id").val()
                ,password    : $('#password').val()
                ,state_id    : $('#state_id').val()
                ,image_file  : $('#image_file').val()
              }
            ,onComplete: function(data){
                if(data.isSuccess){ 
                    setTimeout(function(){
                        _$frm.find("input,select").val("");  
                        $('#image_file2').val(""); 
                        if(gPhoto && gFile){
                            gPhoto.setAttribute('src', "");
                            gFile.value=null;
                        }
                        _$frm.removeClass('was-validated'); 
                        $("#myModal").find("#msg").text("Data successfully saved.");
                        $("#myModal").find("#msg").css("color","green");
                        setTimeout(function(){ 
                            $('#myModal').modal('hide');
                            if(zsi.isMobileDevice){  
                                location.reload();
                            }
                        },1000);
                    },1000);
                }
            } 
        }); 
    }); 
    $("#btnSubmit").click(  function(){
        var _$frm = $("#formConsumer"); 
        var _frmStep1 = _$frm[0];    
        if( ! _frmStep1.checkValidity()){
            _$frm.addClass('was-validated'); 
        }else{   
            $("#myModal").find("#msg").css("color","black"); 
            if(gScanned===true){
               $("#myModal").find("#msg").text("Are you sure you want to continue?"); 
            }else if(gScanned===false){
               $("#myModal").find("#msg").text("You have not scan a pre generated QR the system will automatically assigned. Are you sure you want to continue?"); 
            } 
            $('#myModal').modal('show');
        }
    }); 
    $("#btnScanQR").click( function(){
        if(navigator.mediaDevices){  
            if(zsi.isMobileDevice){  
                if(gFilename==="")
                    alert("Please choose file");
                else 
                    accessMediaScanner();  
            }
            else 
                accessMediaScanner();  
         }
        else
            alert("Camera is disabled for non-https connection");
        
    });   
    $("#takePicture").click( function(){ 
        if(navigator.mediaDevices){  
            $("#desktop-camera").removeClass('hide');
            $("#image_file2").addClass('hide');  
            startup(); 
         }
        else
            alert("Camera is disabled for non-https connection");
    });  
    
    return _pub;
})();                                                               






















   