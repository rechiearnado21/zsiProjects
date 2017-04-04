var bs          = zsi.bs.ctrl
   ,svn         = zsi.setValIfNull
   ,tblPhysicalInvDetail  ="tblModalPhysicalInventoryDetails"
   ,dataPhysicalInv
   ,dataPhysicalInvIndex =-1
   ,g_warehouse_id = null
   ,g_organization_id = null
   ,g_organization_name = ""
   ,g_location_name = ""
   ,g_today_date = new Date()
;



zsi.ready(function(){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_organization_id = d.rows[0].organization_id;
            g_organization_name = d.rows[0].organizationName;
            g_location_name = d.rows[0].warehouse_location;
            g_location_name = (g_location_name? " » " + g_location_name:"");
            g_warehouse_id =  d.rows[0].warehouse_id;
            $(".pageTitle").append(' for ' + g_organization_name + g_location_name);
        }
    });
    displayRecords();
    getTemplate();
    
    
});

var contextModalWindow = { 
                  id    :"ctxMW"
                , sizeAttr : "fullWidth"
                , title : "New"
                , footer: '<div id="physicalInv-footer" class="pull-left">'
                , body  : '<div id="frmPhysicalInv" class="form-horizontal" style="padding:5px">'
 
                        +'    <div class="form-group  "> ' 
                        +'        <label class=" col-xs-2 control-label">Physical Inv Date</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <input type="hidden" name="physical_inv_id" id="issuance_directive_id" >'
                        +'             <input type="hidden" name="is_edited" id="is_edited">'
                        +'             <input type="text" name="physical_inv_date" id="physical_inv_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">'
                        +'             <input type="hidden" name="warehouse_id" id="warehouse_id" class="form-control input-sm">'
                        +'        </div> ' 
                        +'        <label class=" col-xs-2 control-label">Done By</label>'
                        +'        <div class=" col-xs-4">'
                        +'             <select type="text" name="done_by" id="done_by" class="form-control input-sm" ></select>'
                        +'        </div>'  
                        +'    </div>'
                        +'    <div class="form-group  ">  '
                        +'        <label class=" col-xs-2 control-label">Status</label>'
                        +'        <div class=" col-xs-4">'
                        +'          <label class=" col-xs-1 control-label" name="status_name" id="status_name">&nbsp;</label>' 
                        +'          <input type="hidden" name="status_id" id="status_id" class="form-control input-sm" readonly="readonly">' 
                        +'        </div>'
                        +'        <label class=" col-xs-2 control-label">Remarks</label>'
                        +'        <div class=" col-xs-4">'
                        +'          <textarea type="text" name="status_remarks" id="status_remarks" class="form-control input-sm" ></textarea>'
                        +'         </div>'
                        +'      </div>'
                        +'</div>'
                        +'<div class="modalGrid zPanel"><h4> Inventory Details </h4><div id="'+ tblPhysicalInvDetail +'" class="zGrid Detail" ></div></div>'
                        
            };
            
var contextFileUpload = { 
      id:"modalWindowFileUpload"
    , title: "File Upload"
    , sizeAttr: "modal-xs"
    , footer: ''
    , body: '<div class="form-horizontal">'+
                    '<div class="form-group"> '+ 
                        '<label class="col-xs-3  control-label">Select File</label>'+
                        '<div class=" col-xs-3">'+
                            '<input type="hidden" id="tmpData" name="tmpData" class="form-control input-sm">'+
                            '<input type="file" class="browse btn btn-primary" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" name="file">'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-group">'+ 
                        '<div class="col-xs-offset-3">'+
                            '<button type="button" onclick="excelFileUpload();" class="btn btn-primary" id="btnUploadFile" style="margin-left: 5px">'+
                                '<span class="glyphicon glyphicon-upload"></span> Upload'+
                            '</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'
};

var contextSerialNos = { 
      id:"modalWindowSerialNos"
    , title: "File Upload"
    , sizeAttr: "modal-lg"
    , footer: '<buttontype="button" onclick="SaveSerialNo();" class="btn btn-primary pull-left">'
                + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>'
    , body: '<div id="tblSerialNos" class="zGrid"></div>'
};

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));
        $("body").append(template(contextFileUpload));
        $("body").append(template(contextSerialNos));
    });    
}

$("#btnNew").click(function () {
    $("#ctxMW .modal-title").html('Physical Inventory' + ' » ' +  g_organization_name + g_location_name +" <span id='inventoryNo'></span>");
    $("#ctxMW").modal({ show: true, keyboard: false, backdrop: 'static' });

    clearForm();
    displayPhysicalInvDetails(0);
    buildPhysicalInvButtons();
    
    $("select, input").on("keyup change", function(){
        $("#frmPhysicalInv").find("#is_edited").val("Y");
    }); 

    $("select[name='done_by']").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id
            , text: "userFullName"
            , value: "user_id"
    });
});

function Save(page_process_action_id){   
    $("#status_id").val(page_process_action_id);
         $("#frmPhysicalInv").jsonSubmit({
             procedure : "physical_inv_upd"
            ,optionalItems : ["physical_inv_id"]
            ,onComplete: function (data) {
             if(data.isSuccess===true){ 
                 
                var $tbl = $("#" + tblPhysicalInvDetail);
                $tbl.find("[name='physical_inv_id']").val( data.returnValue);
                $tbl.jsonSubmit({
                     procedure : "physical_inv_details_upd"
                    ,optionalItems : ["physical_inv_id"]
                    , notInclude: "#part_no,#national_stock_no,#item_name"
                    ,onComplete: function (data) {
                        if(data.isSuccess===true){  
                            clearForm();
                            zsi.form.showAlert("alert");
                            setStatusName(page_process_action_id);
                            $("#grid").trigger("refresh");
                            $('#ctxMW').modal('hide');
                        }
                        else {
                            console.log(data.errMsg);
                        }
                    }

                });
             }
             else {
                    console.log(data.errMsg);
                }
            }
            
        });
}

function showModalEditPhysicalInv(index, physical_inv_no) {
   var _info = dataPhysicalInv[index];
  
    $("#ctxMW .modal-title").text("Physical Inventory » " + physical_inv_no);
 
    $("#ctxMW").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#ctxMW #physical_inv_id").val(_info.physical_inv_id);
    $("select, input").on("keyup change", function(){
        $("#frmPhysicalInv").find("#is_edited").val("Y");
    });     
    $("select[name='done_by']").dataBind({
        url: execURL + "dd_warehouse_emp_sel @warehouse_id=" + g_warehouse_id
            , text: "userFullName"
            , value: "user_id"
    });
    zsi.initDatePicker();
    displayPhysicalInv(_info);
    displayPhysicalInvDetails(_info.physical_inv_id);
    buildPhysicalInvButtons();
}

function showUploadFile(){
    $("#modalWindowFileUpload .modal-title").text("Upload File");
    $('#modalWindowFileUpload').modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#frm_modalWindowFileUpload").attr("enctype","multipart/form-data");
    
    $.get(execURL + "excel_upload_sel @load_name='Physical Count'", function(data){
        $("#tmpData").val('');
        if(data.rows.length > 0){
            $("#tmpData").val(data.rows[0].value);
        } 
    });
}

// Set the label for the status name.
function setStatusName(page_process_action_id) {
    $.get(execURL + "select dbo.getStatusByPageProcessActionId(" + page_process_action_id + ") AS status_name", function(d) {
        if (d.rows !== null) {
            $("#status_name").html(d.rows[0].status_name);
        }
    });
}

function buildPhysicalInvButtons() {
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=70,@doc_id=" + $("#physical_inv_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });
            html += '<button type="button" onclick="showUploadFile();" class="btn btn-primary"><span class="glyphicon glyphicon-upload"></span>&nbsp;Upload File</button>';
            
            $("#status_name").text(d.rows[0].status_name);
            $(".added-button").remove();
            $("#physicalInv-footer").append(html);
        }
    });
}

function displayPhysicalInv(d){
  var $f = $("#frmPhysicalInv");
   $f.find("#physical_inv_id").val( d.physical_inv_id );
   $f.find("#physical_inv_date").val(  d.physical_inv_date.toDateFormat() );
   $f.find("#organization_id").attr("selectedvalue",  d.organization_id );
   $f.find("#warehouse_id").attr("selectedvalue",  d.warehouse_id );
   $f.find("#done_by").attr("selectedvalue",  d.done_by ); 
   $f.find("#status_id").val( d.status_id );
   $f.find("#status_name").text( d.status_name );
   $f.find("#status_remarks").val( d.status_remarks );
}

function clearForm(){ 
    $('input[type=text], input[type=hidden]').val('');
    $('select[type="text"]').attr('selectedvalue','').val('');    
    dataPhysicalInvIndex=-1;
    zsi.initDatePicker();
}

function displayRecords(){
    
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     
     $("#grid").dataBind({
	     url            : procURL + "physical_inv_sel"
	    ,width          : $(document).width() -50
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"physical_inv_id",type:"hidden",value: svn (d,"physical_inv_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                                                      
                            }
                }	 
                ,{text  : "Physical Inv No."       , type  : "input"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ 
        		        dataPhysicalInvIndex++;
        		        return "<a href='javascript:showModalEditPhysicalInv(\"" + dataPhysicalInvIndex + "\","+ svn(d,"physical_inv_no") +");'>" 
        		        + svn(d,"physical_inv_no") + " </a>";
        		    }
        		}
                ,{text  : "Physical Inv Date"       , type  : "input"       , width : 150       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"physical_inv_date").toDateFormat(); }
        		}
        		,{text  : "Warehouse"               , type  : "label"       , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"warehouse")}
        		}
        		,{text  : "Done By"                 , type  : "label"       , width : 200       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"emp_done_by")}
        		}
        		,{text  : "Status"                  , type  : "label"       , width : 100       , style : "text-align:left;"
        		    ,onRender : function(d){ return  svn(d,"status_name")}  
        		}
        		,{text  : "Remarks"                 , type  : "label"       , width : 350       , style : "text-align:left;"
        		    ,onRender : function(d){ return svn(d,"status_remarks")}
        		}
	    ]  
    	     ,onComplete: function(data){
    	         dataPhysicalInv = data.rows;
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayPhysicalInvDetails(physical_inv_id){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#" + tblPhysicalInvDetail).dataBind({
	     url            : procURL + "physical_inv_details_sel @physical_inv_id=" + physical_inv_id
	    ,width          : $(document).width() -75
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,dataRows       : [
                 {text  : cb                                                            , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"physical_inv_detail_id",type:"hidden",value: svn (d,"physical_inv_detail_id")})
                		                             + bs({name:"is_edited",type:"hidden"})
                		                             + bs({name:"physical_inv_id",type:"hidden",value: (physical_inv_id===0 ? "":physical_inv_id) })
                		                             + bs({name:"item_code_id",type:"hidden", value: svn (d,"item_code_id")})
                                                     + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
                }	 
                ,{text  : "Part No."            , name  : "part_no"                  , type  : "input"       , width : 150       , style : "text-align:left;"}
                ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"        , type  : "input"       , width : 150       , style : "text-align:left;"}
                ,{text  : "Nomenclature"        , name  : "item_name"                , type  : "input"       , width : 150       , style : "text-align:left;"}
        	   // ,{text  : "Serial"              , name  : "serial_no"                , type  : "input"       , width : 200       , style : "text-align:left;"}
        	    ,{text  : "Quantity"            , name  : "quantity"                 , type  : "input"       , width : 120       , style : "text-align:left;"}
        	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure"          , width : 120          , style : "text-align:left;"}
        	    ,{text  : "Bin"                 , name  : "bin"                      , type  : "input"       , width : 120       , style : "text-align:left;"}
        	    ,{text  : "Remarks"             , name  : "remarks"                  , type  : "input"       , width : 300       , style : "text-align:left;"}
        	    ,{text  : "Serial Nos."         , width : 90       , style : "text-align:center;"
        	        , onRender      :  function(d){ 
        	            return (d ? "<a href='javascript:showModalSerialNos(" + physical_inv_id + ","+ svn(d,"item_code_id") +",\""+ svn(d,"part_no") +"\");'><span class='glyphicon glyphicon-list'></span></a>" : "");
        	        }
        	    }

	    ]  
    	     ,onComplete: function(data){
                $("#cbFilter2").setCheckEvent("#" + tblPhysicalInvDetail + " input[name='cb']");
                $("select, input").on("keyup change", function(){
                    var $zRow = $(this).closest(".zRow");
                    if($zRow.length){
                        $zRow.find("#is_edited").val("Y");
                    }
                    else
                        $("#tblModalReceivingHeader").find("#is_edited").val("Y");
                });
                $("[name='serial_no']").keyup(function(){
                    var $zRow = $(this).closest(".zRow");
                    $zRow.find("#quantity").val("1");
                });  
                setMultipleSearch();
        }  
    });    
}

function setMultipleSearch(){
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["part_no","item_code_id","item_name","national_stock_no"] 
        , displayNames: ["Part No."]
        , searchColumn:"part_no"
        , input: "input[name=part_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.part_no;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_code_id").val(data.item_code_id);
                $zRow.find("#national_stock_no").val(data.national_stock_no);
                $zRow.find("#item_name").val(data.item_name);
               // setSearchSerial(data.item_code_id, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["national_stock_no","item_code_id","item_name","part_no"] 
        , displayNames: ["Nat'l Stock No."]
        , searchColumn:"national_stock_no"
        , input: "input[name=national_stock_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.national_stock_no;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_code_id").val(data.item_code_id);
                $zRow.find("#part_no").val(data.part_no);
                $zRow.find("#item_name").val(data.item_name);
               // setSearchSerial(data.item_code_id, $zRow);
        }
    });
    
    new zsi.search({
        tableCode: "ref-0023"
        , colNames: ["item_name","item_code_id","part_no","national_stock_no"] 
        , displayNames: ["Description"]
        , searchColumn:"item_name"
        , input: "input[name=item_name]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.item_name;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_code_id").val(data.item_code_id);
                $zRow.find("#part_no").val(data.part_no);
                $zRow.find("#national_stock_no").val(data.national_stock_no);
        }
    });
}


$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0020"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });       
});
        
function excelFileUpload(){
    var frm      = $("#frm_modalWindowFileUpload");
    var formData = new FormData(frm.get(0));
    var files    = frm.find("input[name='file']").get(0).files;

    if(files.length===0){
        alert("Please select excel file.");
        return;    
    }
    
    //disable button and file upload.
    frm.find("input[name='file']").attr("disabled","disabled");
    $("btnUploadFile").hide();
    $("#loadingStatus").html("<div class='loadingImg'></div> Uploading...");

    $.ajax({
        url: base_url + 'file/templateUpload',  //server script to process data
        type: 'POST',
        //Ajax events
        success: completeHandler = function(data) {
            if(data.isSuccess){
                alert("Data has been successfully uploaded.");
                frm.find("input[name='file']").attr("disabled",false);
            }
            else
                alert(data.errMsg);
        },
        error: errorHandler = function() {
            console.log("error");
        },
        // Form data
        data: formData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    }, 'json');        
}               

function showModalSerialNos(physical_inv_id, item_code_id, part_no){
    $("#modalWindowSerialNos .modal-title").text("Serial Number(s) for » "+ part_no);
    $('#modalWindowSerialNos').modal({ show: true, keyboard: false, backdrop: 'static' });
    
    $("#tblSerialNos").dataBind({
	     url            : procURL + "physical_inv_sn_sel @physical_inv_id=" + physical_inv_id +",@item_code_id="+ item_code_id
	    ,width          : $(document).width() -510
	    ,height         : $(document).height() -450
        ,blankRowsLimit :5
        ,dataRows       : [
            {
                  text  : "Serial No."       
                , width : 120
                , style : "text-align:left;"       
    		    , onRender  :  function(d){ 
                    return bs({name:"physical_inv_sn_id",type:"hidden",value: svn (d,"physical_inv_sn_id")})
                         + bs({name:"is_edited",type:"hidden"})
                         + bs({name:"physical_inv_id",type:"hidden", value: physical_inv_id})
                         + bs({name:"item_code_id",type:"hidden", value: item_code_id})
                         + bs({name:"serial_no",type:"input", value: svn (d,"serial_no")});
                }
            }	
            ,{
                  text  : "Status"   
                , name  : "status_id"
                , type  : "select"   
                , width : 120
                , style : "text-align:left;"
            }	
            ,{
                  text  : "Remaining Time"   
                , name  : "remaining_time"
                , type  : "input"   
                , width : 120
                , style : "text-align:left;"
            }	
            ,{
                  text  : "No. of Repaird"   
                , name  : "no_repairs"
                , type  : "input"   
                , width : 120
                , style : "text-align:left;"
            }
            ,{
                  text  : "No. of Overhauls"   
                , name  : "no_overhauls"
                , type  : "input"   
                , width : 120
                , style : "text-align:left;"
            }
            ,{
                  text  : "Remarks"   
                , name  : "remarks"
                , type  : "input"   
                , width : 250
                , style : "text-align:left;"
            }
	    ]  
        ,onComplete: function(){
            $("select[name='status_id']").dataBind("inv_serial_status");
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                }
            });
        }  
    });    
}
   
function SaveSerialNo(){
    $("#tblSerialNos").jsonSubmit({
         procedure : "physical_inv_sn_upd"
        ,optionalItems : ["physical_inv_id","item_code_id"]
        ,onComplete: function (data) {
            if(data.isSuccess===true){  
                zsi.form.showAlert("alert");
                $("#tblSerialNos").trigger("refresh");
                $('#modalWindowSerialNos').modal('hide');
            }
            else {
                console.log(data.errMsg);
            }
        }

    });
}  
  