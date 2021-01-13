zsi.ready = function(){
    var _$host      = $("#email_host")
        ,_$port     = $("#email_port")
        ,_$add      = $("#email_add")
        ,_$addDesc  = $("#email_add_desc")
        ,_$pwd      = $("#email_pwd")
        ,_ssl       = $("#email_is_ssl")
    ;
    
    zsi.getData({
         sqlCode : "A1249"
        ,onComplete : function(d) {
            var _data = d.rows[0];
            
            _$host.val(_data.email_host).trigger('keyup');
            _$port.val(_data.email_port).trigger('keyup');
            _$add.val(_data.email_add).trigger('keyup');
            _$addDesc.val(_data.email_add_desc).trigger('keyup');
            _$pwd.val(_data.email_pwd).trigger('keyup');
            _ssl.val(_data.email_is_ssl).trigger('keyup');
        }
    });
    
    $("#btnSave").click(function() {
        $("#app-profile-form").jsonSubmit({
             sqlCode : "A1250"
            ,isSingleEntry : true
            ,onComplete : function(d) {
                
            }
        });
    });
   
}; 

   