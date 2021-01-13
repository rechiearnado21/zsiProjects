 var payPartner = (function(){
    var _pub            = {}
        ,gCompanyCode          = ""
        ,mdl1           = "modalTmpFileUploadDb"
        
    ;
    zsi.ready = function(){
        $(".page-title").html("Pay Partner");

        getTemplates(function(){
            //displayRecords();
            
        });
            
   
    };
    

    function getTemplates(callback){
        new zsi.easyJsTemplateWriter("body")
        .bsModalBox({
              id        : mdl1
            //, sizeAttr  : "modal-md"
            , title     : "File Upload"
            , footer    : '<div class="col-11 ml-auto"><button type="button" onclick="payPartner.uploadTmpFileDb(this);" class="btn btn-primary"><span class="fas fa-file-upload"></span> Upload</button>'
        });
       
        if(callback) callback();
        
    }    
     
    
    $("#btnShopUploadModal").click(function () {
        
           var m=$('#' + mdl1);
            m.find(".modal-title").text('Upload File.');
            m.modal("show");
            $.get(base_url + 'page/name/tmplFileDbUpload'
                ,function(data){
                   m.find('.modal-body').html(data);
                   m.find("form").attr("enctype","multipart/form-data");
                }
            ); 
    
    });
    
    
   _pub.uploadTmpFileDb = function(obj){
        var _frm = $(obj).closest(".modal-content").find("form");
        var _file= _frm.find("#file").get(0);

        if( _file.files.length<1 ) { 
             alert("Please select file.");
            return;
        }
        var formData = new FormData( _frm.get(0));
        $.ajax({
            url: base_url + 'file/uploadTmpDbFile',   
            type: 'POST',
            success: completeHandler = function(data) {
                if(data.isSuccess){
                    
                    console.log("data",data);
                    console.log("tmp_file_id",data.tmp_file_id);
                    /*console.log("data",data); 
                    $.get(base_url  + "sql/exec?p=dbo.employee_image_file_upd @tmp_file_id=" + data.returnValue +  ",@user_id=" + app.userInfo.user_id
                    ,function(data){
                        
                        zsi.form.showAlert("alert");
                        $('#' + modalImageUploadE).modal('toggle');
                        $("#grid").trigger('refesh');
                        gTimeStamp = new Date().getTime();
                        

                        
                    }); */
                    
    
                        
                }else
                    alert(data.errMsg);
                
            },
            error: errorHandler = function() {
                console.log("error");
            },
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        }, 'json');
    
        
    };
    
    return _pub;
})();                         