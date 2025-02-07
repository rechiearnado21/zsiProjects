var bs  = zsi.bs.ctrl
   ,svn = zsi.setValIfNull
   ,g_procurement_id = null
   ,g_organization_id = null
   ,g_organization_name = ''
   ,g_today_date = new Date() + ""
   ,g_tab_name = "Purchase"
   ,procMode = [
        {text:"Shopping",value:"Shopping"}
        ,{text:"Bidding",value:"Bidding"}
       ]
    ,g_statuses = []
;
const ProcType = {
        Purchase: 'Purchase',
        Repair  : 'Repair',
};

var contextModalWindow = { 
      id    : "mdlProcurement"
    , sizeAttr : "modal-lg fullWidth"
    , title : "New"
    , footer: '<div id="procurement-footer" class="pull-left"></div>' 
    , body  : '<div id="tblProcurement" class="zContainer1 form-horizontal zForm" style="padding:5px">'
            +'<div class="col-sm-12">'
            +'      <div class="form-group  "> ' 
            +'          <label class=" col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">PR #</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'               <input type="hidden" name="procurement_id" id="procurement_id" >'
            +'               <input type="hidden" name="procurement_type" id="procurement_type" class="form-control input-sm" >'
            +'               <input type="text" name="procurement_code" id="procurement_code" class="form-control input-sm" >'
            +'          </div> ' 
            +'          <label class=" col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">PR Date</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'               <input type="text" name="procurement_date" id="procurement_date" class="form-control input-sm" value="' + g_today_date.toShortDate() + '">'
            +'          </div>'
            +'      </div>'
            +'      <div class="form-group"> ' 
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">PO #</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'               <input type="text" name="po_code" id="po_code" class="form-control input-sm" >'
            +'          </div> ' 
            +'          <label class=" col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">PO Date</label>'
            +'          <div class=" col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'               <input type="text" name="po_date" id="po_date" class="form-control input-sm" value="' + g_today_date.toShortDate() + '">'
            +'          </div>'
            +'      </div>'
            +'      <div class="form-group  "> ' 
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">BAC #</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'               <input type="text" name="bac_code" id="bac_code" class="form-control input-sm" >'
            +'          </div> ' 
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">BAC Date</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'               <input type="text" name="bac_date" id="bac_date" class="form-control input-sm" value="' + g_today_date.toShortDate() + '">'
            +'          </div>'
            +'      </div>'
            +'      <div class="form-group  ">  '
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Procurement Desc</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-9 ">'
            +'               <input type="text" name="procurement_name" id="procurement_name" class="form-control input-sm"  >'
            +'          </div>'
            +'      </div>'
            +'      <div class="form-group  ">  '
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Procurement Mode</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'               <select name="procurement_mode" id="procurement_mode" class="form-control input-sm" ></select>'
            +'          </div>' 
            +'          <div class="hide" id="supplier_filter">'
            +'             <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Dealer</label>'
            +'             <div class="col-xs-7 col-sm-6 col-md-8 col-lg-3 ">'
            +'                  <select name="supplier_id" id="supplier_id" class="form-control input-sm" ></select>'
            +'             </div>' 
            +'          </div>'
            +'          <div class="hide" id="warehouse_filter">'
            +'             <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Warehouse</label>'
            +'             <div class="col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'                  <select name="dd_warehouse" id="dd_warehouse" class="form-control input-sm" ></select>'
            +'             </div>'  
            +'          </div>'             
            +'       </div>'
            +'       <div class="form-group  ">  '
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Promised Delivery Date</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'             <input type="text" name="promised_delivery_date" id="promised_delivery_date" class="form-control input-sm" value="'+ g_today_date.toShortDate() +'">'
            +'             <input type="hidden" name="warehouse_id" id="warehouse_id" class="form-control input-sm">' 
            +'           </div>'
            +'          <label class="col-xs-5 col-sm-6 col-md-4 col-lg-3 control-label">Status</label>'
            +'          <div class="col-xs-7 col-sm-6 col-md-8 col-lg-3">'
            +'             <label class="control-label" id="status_name">Open</label>'
            +'             <input type="hidden" name="status_id" id="status_id" class="form-control input-sm" >'
            +'             <input type="hidden" name="is_edited" id="is_edited" class="form-control input-sm" >'
            +'             <input type="hidden" name="page_process_action_id" id="page_process_action_id">'
            +'          </div>'
            +'      </div>'
            +'    </div>'
            +'</div>'
            +'</div>'
            
            +'<div class="modalGrid zContainer1"><div class="zHeaderTitle1"><label>Procurement Details</label></div><div id="tblProcurementDetails" class="zGrid Detail" ></div></div>'
};

var contextUploadFile = { 
      id    : "modalUploadFile"
    , title : "Upload File"
    , footer: '<div class="pull-left"><button type="button" onclick="uploadFile();" class="btn btn-primary"><span class="glyphicon glyphicon-upload"></span> Upload</button>'
                   + '</div>' 
};

zsi.ready(function(){
    getTemplate();
    setCurrentTab();
    displayPurchase(g_tab_name);
    
    getUserInfo(function(){
        $("#purchase-tab").click(function () { 
            g_tab_name = $(this).html();
            displayPurchase($(this).html());    
        });
        $("#repair-tab").click(function () {
            g_tab_name = $(this).html();
            displayRepair($(this).html());    
        });   
    });
});

$("#btnAddPurchase").click(function () {
    g_procurement_id = null;
    $("#mdlProcurement .modal-title").text("Purchase Procurement for " + g_organization_name);
    $('#mdlProcurement').modal({ show: true, keyboard: false, backdrop: 'static' });
    clearForm();
    $("#supplier_filter").removeClass("hide");
    $("#warehouse_filter").addClass("hide");
    $("#procurement_type").val(g_tab_name);
    $("#procurement_date").val( g_today_date.toShortDate());
    $("#promised_delivery_date").val( g_today_date.toShortDate());
    
    zsi.initDatePicker();
    buildButtons(function(){
        getStatuses("NEW", function(){
            displayProcurementDetails();
        });
    });
});

$("#btnAddRepair").click(function () {
    g_procurement_id = null;
    $("#mdlProcurement .modal-title").text("Repair Procrement for " + g_organization_name);
    $('#mdlProcurement').modal({ show: true, keyboard: false, backdrop: 'static' });
    clearForm();
    $("#warehouse_filter").removeClass("hide");
    $("#supplier_filter").addClass("hide");
    $("#procurement_type").val(g_tab_name);
    $("#procurement_date").val( g_today_date.toShortDate());
    $("#promised_delivery_date").val( g_today_date.toShortDate());
    
    $("select[name='dd_warehouse']").dataBind({ 
         url : procURL + "dd_warehouses_sel"
        ,text: "warehouse"
        ,value: "warehouse_id"
        ,onComplete: function(){
            $("select[name='dd_warehouse']").change(function(){
                $("#warehouse_id").val(this.value);
            });  
        }
    });
    
    zsi.initDatePicker();
    buildButtons(function(){
        getStatuses("NEW", function(){
            displayProcurementDetails();
        });
    });
});

function getUserInfo(callBack){
    $.get(procURL + "user_info_sel", function(d) {
        if (d.rows !== null && d.rows.length > 0) {
            g_organization_id =  d.rows[0].organization_id;
            g_organization_name =  d.rows[0].organizationName;
            
            getStatusRoles(d.rows[0].role_id);
        }
        if(callBack) callBack();
    });
}

function getStatusRoles(role_id){
    $.get(procURL + "roles_sel @role_id=" + role_id, function(d) {
       if(d.rows.length > 0){
            if(d.rows[0].is_add==="N"){
                $("#btnAddPurchase, #btnAddRepair").addClass("hide");
            }
           
            if(d.rows[0].is_delete==="N"){
                $("#btnDelPurchase, #btnDelRepair").addClass("hide");
            }
       }
    });   
}

function getStatuses(status_name, callBack){
    $.get(execURL + "statuses_sel @status_name='" + status_name + "'", function(d) {
        g_statuses = [];
        if (d.rows.length > 0) {
            g_statuses = d.rows[0];
        }
        
        var statusClass = "";
        if(g_statuses.is_edit==="N"){
            statusClass = "not-editable";
        }
        $("#tblProcurementDetails").find("#table").addClass(statusClass);
        
        if(g_statuses.is_delete==="Y"){
            $("#procurement-footer").append('<button type="button" onclick="javascript:void(0); return Delete();" class="btn btn-primary added-button"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete</button>');
        }
        if(callBack) callBack();
    });
}

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);
        $("body").append(template(contextModalWindow));
        $("body").append(template(contextUploadFile));
    });    
}

// Set the current tab when the page loads.
function setCurrentTab(){
    var $tabs = $("#tabPanel > div");
    var $navTabs = $("ul.nav-tabs > li");
    $tabs.removeClass("active");
    $navTabs.removeClass("active");
    // Set purchase delivery tab as current tab.
    $($tabs.get(0)).addClass("active"); 
    $($navTabs.get(0)).addClass("active");
}

// Add a click event for the li elements.
$("ul.nav-tabs >li").click(function(){
    var i = $(this).index();
    createCookie("receiving_tab_index",i,1);
    $("#tabPanel > div").each(function(){
        var obj =  $(this);
        var cur_div_index = obj.index();
        obj.removeClass("active");
        if(i===cur_div_index)
           obj.addClass("active");
    });
});

function buildButtons(callBack){
    
    $("select[name='supplier_id']").dataBind({url: base_url + "selectoption/code/dealer"});
    $("select[name='procurement_mode']").fillSelect({data: procMode});
    var html = '';
    $.get(procURL + "current_process_actions_sel @page_id=1107,@doc_id=" + $("#procurement_id").val(), function(d) {
        if (d.rows.length > 0) {
            $.each(d.rows, function(k, v) {
                html = html + '<button id="' + v.page_process_action_id + '" type="button" onclick="javascript: void(0); return Save(' 
                    + v.status_id + ','+ v.page_process_action_id +');" class="btn btn-primary added-button">'
                    + '<span class="glyphicon glyphicon-floppy-disk"></span>&nbsp;' + v.action_desc + '</button>';
            });

            if(!g_procurement_id || g_procurement_id===null){
                $("#status_name").text(d.rows[0].status_name);   
            }
            
            $(".added-button").remove();
            $("#procurement-footer").html(html);
        }
        if(callBack) callBack();
    });
}

function displayPurchase(tab_name){
    var cb = bs({name:"cbFilter1",type:"checkbox"}); 
    $("#purchase").dataBind({
	     url            : procURL + "procurement_sel @tab_name='" + tab_name + "'"
	    ,width          : $(document).width() -40
	    ,height         : $(document).height() -450 
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
            {text  : cb                         , width : 25        , style : "text-align:left;"       
		        ,onRender : function(d){ 
                    return bs({name:"procurement_id",type:"hidden",value: svn(d,"procurement_id")})
                         + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }
            /*,{ text : "File"             , width:45      , style:"text-align:center;"
                ,onRender : function(d){ 
                    var mouseMoveEvent= "onmouseover='mouseover(\"" +  svn(d,"img_filename") + "\");' onmouseout='mouseout();'";
                    var html = "<a href='javascript:void(0);' " + mouseMoveEvent + " class='btn btn-sm'  onclick='showModalUploadImage(\""+ svn(d,"img_filename") 
                                    +"\");'  ><span class='glyphicon glyphicon-picture'></span> </a>";
                    return (d!==null ? html : "");
                }
            }*/
            ,{text  : "PR #"                   , width : 100       , style : "text-align:left;"
    		    ,onRender : function(d){ 
    		        return "<a href='javascript:showModalProcurement(\""
    		            + ProcType.Purchase + "\",\"" 
    		            + svn(d,"procurement_id") +"\");'>"
    		            //+ svn(d,"procurement_name") + "\" 
    		            + svn(d,"procurement_code") + " </a>";
    		    }
    		}
    		,{text  : "PO No."                   , type  : "label"         , width : 100       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"po_code");
    		    }
    		}
    		,{text  : "PAF BAC"                   , type  : "label"         , width : 120       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"bac_no");
    		    }
    		}
    	    ,{text  : "Procurement Desc"            , type  : "label"       , width : 320       , style : "text-align:left;"
    	        ,onRender : function(d){ return svn(d,"procurement_name")}
    	    }
    	    ,{text  : "Procurement Mode"            , type  : "label"       , width : 220       , style : "text-align:left;"
    	        ,onRender : function(d){ return svn(d,"procurement_mode")}
    	    }    	    
    	    ,{text  : "Date"            , type  : "label"       , width : 120       , style : "text-align:left;"
    		     ,onRender : function(d){ return svn(d,"procurement_date").toDateFormat()}
    		}
    		,{text  : "Supplier"        , type  : "label"       , width : 220       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"supplier_name")}
    		}
    		,{text  : "Promised Date"         , type  : "label"   , width : 120   , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"promised_delivery_date").toDateFormat()}
    		}
    		,{text  : "Total Amount"         , type  : "label"   , width : 100   , style : "text-align:right;"
    		    ,onRender : function(d){ return svn(d,"total_amount").toLocaleString('en-PH', {minimumFractionDigits: 2})}
    		}
    		,{text  : "Status"          , type  : "label"       , width : 100       , style : "text-align:center;"
    		    ,onRender : function(d){ return  svn(d,"status_name")}  
    		}
    		/*, {text  : "Upload File"       , width : 100                   , style:"text-align:center;" 
    		    , onRender : function(d){ 
    		        var h = "<a href='javascript:void(0);' onclick='showUploadFile(" + svn(d,"procurement_id") +");'><span class='glyphicon glyphicon-upload' style='font-size:12pt;'></span></a>";
    		        return (d!==null ? h : "");
        		}
            }*/
	    ]  
        ,onComplete: function(data){
            $("#cbFilter1").setCheckEvent("#purchase input[name='cb']");
        }  
    });    
}

function displayRepair(tab_name){
    var cb = bs({name:"cbFilter2",type:"checkbox"}); 
    $("#repair").dataBind({
	     url            : procURL + "procurement_sel @tab_name='" + tab_name + "'"
	   // ,width          : $(document).width() -80
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit :5
        ,isPaging       : false
        ,dataRows       : [
            {text  : cb                         , width : 25        , style : "text-align:left;"       
		        ,onRender : function(d){ 
                    return bs({name:"procurement_id",type:"hidden",value: svn(d,"procurement_id")})
                         + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                }
            }
            /*,{ text : "File"             , width:45      , style:"text-align:center;"
                ,onRender : function(d){ 
                    var mouseMoveEvent= "onmouseover='mouseover(\"" +  svn(d,"img_filename") + "\");' onmouseout='mouseout();'";
                    var html = "<a href='javascript:void(0);' " + mouseMoveEvent + " class='btn btn-sm'  onclick='showModalUploadImage(\""+ svn(d,"img_filename") 
                                    +"\");'  ><span class='glyphicon glyphicon-picture'></span> </a>";
                    return (d!==null ? html : "");
                }
            }*/
            ,{text  : "PR #"                   , width : 120       , style : "text-align:left;"
    		    ,onRender : function(d){ 
    		        return "<a href='javascript:showModalProcurement(\""
    		             + ProcType.Repair + "\",\"" 
    		             + svn(d,"procurement_id") +"\");'>"
    		             + svn(d,"procurement_code") + " </a>";
    		    }
    		}
    		,{text  : "PO No."                   , type  : "label"         , width : 120       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"po_code");
    		    }
    		}
    		,{text  : "PAF BAC"                   , type  : "label"         , width : 120       , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"bac_no");
    		    }
    		}
    	    ,{text  : "Procurement Desc"            , type  : "label"       , width : 350       , style : "text-align:left;"
    	        ,onRender : function(d){ return svn(d,"procurement_name")}
    	    }
    	    ,{text  : "Procurement Mode"            , type  : "label"       , width : 250       , style : "text-align:left;"
    	        ,onRender : function(d){ return svn(d,"procurement_mode")}
    	    }    	    
    	    ,{text  : "Date"            , type  : "label"       , width : 200       , style : "text-align:left;"
    		     ,onRender : function(d){ return svn(d,"procurement_date").toDateFormat()}
    		}
    		,{text  : "Warehouse"          , type  : "label"       , width : 100       , style : "text-align:center;"
    		    ,onRender : function(d){ return  svn(d,"warehouse")}  
    		}
    		,{text  : "Promised Delivery Date"         , type  : "label"   , width : 200   , style : "text-align:left;"
    		    ,onRender : function(d){ return svn(d,"promised_delivery_date").toDateFormat()}
    		}
    		,{text  : "Status"          , type  : "label"       , width : 100       , style : "text-align:center;"
    		    ,onRender : function(d){ return  svn(d,"status_name")}  
    		}
    		/*, {text  : "Upload File"       , width : 100                   , style:"text-align:center;" 
    		    , onRender : function(d){ 
    		        var h = "<a href='javascript:void(0);' onclick='showUploadFile(" + svn(d,"procurement_id") +");'><span class='glyphicon glyphicon-upload' style='font-size:12pt;'></span></a>";
    		        return (d!==null ? h : "");
        		}
            }*/
	    ]  
        ,onComplete: function(data){
            $("#cbFilter2").setCheckEvent("#repair input[name='cb']");
        }  
    });    
}

function showModalProcurement(procurement_type, id, title) {
    g_procurement_id = id;
    if (procurement_type == ProcType.Purchase){
        $("#supplier_filter").removeClass("hide");
        $("#warehouse_filter").addClass("hide");
        $("#procurement_type").val(g_tab_name);
    }
    else{
        $("#warehouse_filter").removeClass("hide");
        $("#supplier_filter").addClass("hide");
        $("#procurement_type").val(g_tab_name);
    }
    $("select[name='supplier_id']").attr("selectedvalue", id);
    $("#mdlProcurement .modal-title").text(g_tab_name + " procurement " + " for " + g_organization_name);
    $("#mdlProcurement").modal({ show: true, keyboard: false, backdrop: 'static' });
    $("#mdlProcurement #procurement_id").val(g_procurement_id);
    $("select, input").on("keyup change", function(){
       $("#tblProcurement").find("#is_edited").val("Y");
    });
    
    zsi.initDatePicker();
    displayProcurement();
}

function displayProcurement(callBack){
    $.get(procURL + "procurement_sel @procurement_id=" + g_procurement_id + "&@tab_name=" + g_tab_name, function(data){

        if(data.rows.length > 0){
            var d = data.rows[0];
            var $tbl = $("#tblProcurement");
            $tbl.find("#procurement_id").val(d.procurement_id);
            $tbl.find("#procurement_date").val(d.procurement_date.toDateFormat());
            $tbl.find("#po_code").val(d.po_code);
            $tbl.find("#po_date").val(d.po_date.toDateFormat());
            $tbl.find("#bac_code").val(d.bac_code);
            $tbl.find("#bac_date").val(d.bac_date.toDateFormat());
            $tbl.find("#procurement_code").val(d.procurement_code);
            $tbl.find("#procurement_name").val(d.procurement_name);
            $tbl.find("#procurement_mode").attr("selectedvalue", d.procurement_mode);
            $tbl.find("#supplier_id").attr("selectedvalue", d.supplier_id);
            $tbl.find("#dd_warehouse").attr("selectedvalue", d.warehouse_id);
            $tbl.find("#promised_delivery_date").val(d.promised_delivery_date.toDateFormat());
            $tbl.find("#status_name").text(d.status_name);
            
            buildButtons(function(){
                getStatuses(d.status_name, function(){
                    displayProcurementDetails();
                });
            });
        }
        if(callBack) callBack();
    });
}

function displayProcurementDetails(){
    var cb = bs({name:"cbFilter3",type:"checkbox"});
    var counter = 0;
    var _dataRows = [];
    var widthFooter = "";
    var total = 0;
	         _dataRows.push(
                 {text  : cb                     , width : 25                    , style : "text-align:left;"       
        		    ,onRender : function(d){ 
                        return  bs({name:"procurement_detail_id",type:"hidden",value: svn (d,"procurement_detail_id")})
                              + bs({name:"is_edited", type:"hidden"})
                              + bs({name:"procurement_id",type:"hidden",value: (g_procurement_id ? g_procurement_id : "")})
                              + (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
           ); 

	    if(g_tab_name==="Purchase"){
	        widthFooter = "1205px";
	         _dataRows.push(
        	    {text  : "Item #"           , width : 70                    , style : "text-align:left;"
        	        ,onRender : function(d){ 
        	            counter++;
                        return '<input class="form-control" type="text" name="item_no" id="item_no" value="' + counter + '" readonly>' 
                              + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")})
                              + bs({name:"serial_no",type:"hidden",value: svn (d,"serial_no")});
                    }
        	    }        	     
        	    ,{text  : "Nomenclature"        , name  : "item_name"           , type  : "input"       , width : 450       , style : "text-align:left;"}
        	    ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"   , type  : "input"       , width : 160       , style : "text-align:left;"}
        	    ,{text  : "Part No."            , name  : "part_no"             , type  : "input"       , width : 160       , style : "text-align:left;"}
        	    ,{text  : "Unit of Measure"     , name  : "unit_of_measure_id"  , type  : "select"      , width : 150       , style : "text-align:left;"}
        	    
        	    ,{text  : "Quantity"            , width : 90                    , style : "text-align:right;"
        	        ,onRender: function(d){
        	             return bs({ name  : "quantity" ,style : "text-align:right;" ,value : svn(d,"quantity") ,class : "numeric" });
        	        } 
        	    }
        	    ,{text  : "Unit Price"          , width : 100                   , style : "text-align:right;"
        	        ,onRender : function(d){
        	            var _uprice = (svn(d,"unit_price")!=="" ? toCurrencyFormat(parseFloat(svn(d,"unit_price")).toFixed(2))   : "");
        	            return "<input id='unit_price' type='text' class= 'form-control  numeric' name='unit_price' value='" + _uprice + "' style='text-align:right'>" ; 
        	        }
        	    }
        	    ,{text  : "Amount"              , width : 130       , style : "text-align:right;"
        	        ,onRender : function(d){
        	            var _val = (svn(d,"amount")!=="" ? toCurrencyFormat(parseFloat(svn(d,"amount")).toFixed(2)) : "");
        	            total += svn(d,"amount") ;
        	            return  "<div id='amount' >" + _val + "</div>";
        	        }
        	    }
    	     );
	    }
    	else{
    	     widthFooter = "1116px";
    	     _dataRows.push(
        	    {text  : "Item #"           , width : 70                    , style : "text-align:left;"
        	        ,onRender : function(d){ 
        	            counter++;
                        return '<input class="form-control" type="text" name="item_no" id="item_no" value="' + counter + '" readonly>' 
                              + bs({name:"item_code_id",type:"hidden",value: svn (d,"item_code_id")});
                    }
        	    }                  
        	    ,{text  : "Serial No."          , name  : "serial_no"           , type  : "input"      , width : 150       , style : "text-align:left;"}
        	    ,{text  : "Nomenclature"        , name  : "item_name"           , type  : "text"       , width : 450       , style : "text-align:left;"}
        	    ,{text  : "Nat'l Stock No."     , name  : "national_stock_no"   , type  : "text"       , width : 260       , style : "text-align:left;"}
        	    ,{text  : "Part No."            , width : 160       , style : "text-align:left;"
         	        ,onRender : function(d){
        	            return  bs({name:"part_no",type:"text",value: svn (d,"part_no")})
        	                  + bs({name:"serial_no",type:"hidden",value: svn (d,"serial_no")})
        	                  + bs({name:"unit_of_measure_id",type:"hidden",value: svn (d,"unit_of_measure_id")})
        	                  + bs({name:"quantity",type:"hidden",value:"1"});
        	        }       	        
        	    }
        	    ,{text  : "Amount"              , width : 130       , style : "text-align:right;"
        	        ,onRender : function(d){
        	            var _val = (svn(d,"amount")!=="" ? toCurrencyFormat(parseFloat(svn(d,"amount")).toFixed(2)) : "");
        	            
        	            return  "<div id='amount' >" + _val + "</div>";
        	        }
        	    }
    	    );  
    	}

    
     $("#tblProcurementDetails").dataBind({
	     url            : execURL + "procurement_detail_sel " + (g_procurement_id ? "@procurement_id=" + g_procurement_id : "")
	    ,width          : $(document).width() - 170
	    ,height         : $(document).height() -450
	    ,selectorType   : "checkbox"
        ,blankRowsLimit : (g_statuses.is_add==="Y" ? 20 : 0)
        ,dataRows       : _dataRows 
        ,onComplete: function(data){
            setMultipleSearch();
            searchSerial();
            var totalRow = "";
            totalRow += '<div class="zRow total">'; 
            totalRow +=    '<div class="zCell" style="width:'+ widthFooter +';text-align:right;"><span class="text">Total&nbsp;</span></div>';
            totalRow +=    '<div class="zCell" style="width:130px;text-align:right;"><span class="text">' + toCurrencyFormat(parseFloat(total).toFixed(2)) + '</span></div>';
            totalRow += '</div>'; 
    		$("#tblProcurementDetails").find(".right #table").append(totalRow);            
            
            $(".no-data input[name='part_no']").checkValueExists({
                code:"ref-0023"
                ,isNotExistShow : false 
                ,isCheckOnDb : false 
                ,message : "data already exist"
                ,onHide: function($zRow){
                    //clear values
                    $zRow.find("#item_code_id").val("");
                    $zRow.find("#national_stock_no").val("");
                    $zRow.find("#item_name").val("");
                }
            });
            $("#cbFilter3").setCheckEvent("#tblProcurementDetails input[name='cb']");
            
            $("select[name='unit_of_measure_id']").dataBind("unit_of_measure");
            
            $("select, input").on("keyup change", function(){
                var $zRow = $(this).closest(".zRow");
                if($zRow.length){
                    $zRow.find("#is_edited").val("Y");
                }
                else
                    $("#tblProcurement").find("#is_edited").val("Y");
            });

            /*$("input[name='item_code_id']").each(function(){
                if(this.value){
                    var $row = $(this).closest(".zRow");
                        $row.find("select[id='serial_no']").dataBind({ 
                             url : execURL + "dd_warehouse_items_sel @item_code_id="+ this.value + ",@warehouse_id=" + this.value
                            ,text: "serial_no"
                            ,value: "serial_no"
                        });
                } 
            });*/
            
            $("input[name='quantity']").keyup(function(){
                var quantity  = $.trim(this.value);
                var $zRow     = $(this).closest(".zRow");
                var unitPrice = $.trim($zRow.find("#unit_price").val().replace(/,/g, ''));
                
                if(quantity > 0){
                    $(this).removeClass("required");
                }else{
                     $(this).addClass("required");
                }
                
                if(unitPrice && quantity){
                    var amount = parseFloat(quantity) * parseFloat(unitPrice);
                    $zRow.find("#amount").text(toCurrencyFormat(amount.toFixed(2)));
                }else{
                    $zRow.find("#amount").text("0.00");
                }
            });
            
            $("input[name='unit_price']").keyup(function(){
                var unitPrice = $.trim(this.value.replace(/,/g, ''));
                var $zRow     = $(this).closest(".zRow");
                var quantity  = $.trim($zRow.find("#quantity").val());

                if(unitPrice && quantity){
                    console.log( $zRow.find("#amount"));
                    var amount = parseFloat(quantity) * parseFloat(unitPrice);
                    $zRow.find("#amount").text(toCurrencyFormat(amount.toFixed(2)));
                }else{
                    $zRow.find("#amount").text("0.00");
                }
                $(this).val(toCurrencyFormat(unitPrice));
            });
            
            markMandatory();
            zsi.initInputTypesAndFormats();
        }  
    });    
}

function validateQuantity(){
    var $required = $("input.required");
    if($required.length > 0){
        $required.focus();
        return false;
    }else{
        return true;
    }
}

function Save(status_id, page_process_action_id){
    if( zsi.form.checkMandatory()!==true) return false;
    
    $("#tblProcurement").find("#status_id").val(status_id);
    $("#tblProcurement").find("#page_process_action_id").val(page_process_action_id);
    $("#tblProcurement").jsonSubmit({
         procedure : "procurement_upd"
        ,optionalItems : ["procurement_id"]
        ,notInclude : "#dd_warehouse"
        ,onComplete: function (data) {
         if(data.isSuccess===true){
            
            if(!validateQuantity()){
                alert("Please enter a quantity that is greater than 0");
            }
            else{
                toggleUnitPriceComma("N"); // w/o comma
                var $tbl = $("#tblProcurementDetails");
                $tbl.find("[name='procurement_id']").val((g_procurement_id ? g_procurement_id : data.returnValue));
                $tbl.jsonSubmit({
                     procedure : "procurement_detail_upd"
                    ,optionalItems : ["item_no","procurement_id"]
                    ,notInclude: "#part_no,#national_stock_no,#item_name, #amount, #ordered_qty"
                    ,onComplete: function (data) {
                        toggleUnitPriceComma("Y"); // with comma 
                        if(data.isSuccess===true){  
                            zsi.form.showAlert("alert");
                            clearForm();
                            $("#grid").trigger("refresh");
                            $('#mdlProcurement').modal('hide');
                            if(g_tab_name==="Purchase"){
                                displayPurchase(g_tab_name);   
                            }
                            else{
                                displayRepair(g_tab_name);   
                            }
                        }
                        else {
                            console.log(data.errMsg);
                        }
                    }
                });
            }
        }
        else {
                console.log(data.errMsg);
            }
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
                $zRow.find("#quantity").addClass("required");
                //setSearchSerial(data.item_code_id, $zRow);
                //$(currentObject).change();    
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
                $zRow.find("#quantity").addClass("required");
                //setSearchSerial(data.item_code_id, $zRow);
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
                $zRow.find("#quantity").addClass("required");
        }
    });
}

function setSearchSerial(id, row){
    var $serial_no = row.find("select[id='serial_no']");
    
    $serial_no.dataBind({ 
         url : execURL + "dd_warehouse_items_sel @item_code_id="+ id + ",@warehouse_id=" + id
        ,text: "serial_no"
        ,value: "serial_no"
    });
    
    $serial_no.change(function(){
       if(this.value != ""){
           row.find("input[name='unit_of_measure']").text("EACH");
           row.find("input[name='stock_qty']").text(1);
           row.find("input[name='quantity']").val(1);
       } 
    });
}

function searchSerial(){
    new zsi.search({
        tableCode: "ref-0035"
        , colNames: ["serial_no"] 
        , displayNames: ["Serial No."]
        , searchColumn:"serial_no"
        , input: "input[name=serial_no]"
        , url: execURL + "searchData"
        , onSelectedItem: function(currentObject, data, i){
            currentObject.value = data.serial_no;
            var $zRow = $(currentObject).closest(".zRow");
                $zRow.find("#item_code_id").val(data.item_code_id);
                $zRow.find("#national_stock_no").val(data.national_stock_no);
                $zRow.find("#item_name").val(data.item_name);
                $zRow.find("#serial_no").val(data.serial_no);
               // setSearchSerial(data.item_code_id, $zRow);
        }
    });
}

function clearForm(){ 
    zsi.initDatePicker();
    $('input[type=text], input[type=hidden]').val('');
    $('select').attr('selectedvalue','').val('');    
}

$("#btnDelPurchase").click(function(){
    zsi.form.deleteData({
         code       : "ref-0030"
        ,onComplete : function(data){
                        displayPurchase(g_tab_name);
                      }
    });       
});

$("#btnDelRepair").click(function(){
    zsi.form.deleteData({
         code       : "ref-0030"
        ,onComplete : function(data){
                        displayRepair(g_tab_name);
                      }
    });       
});

function markMandatory(){
    zsi.form.markMandatory({       
      "groupNames":[
            {
                 "names" : ["procurement_code","procurement_mode"]
                ,"type":"S"
            }             
      ]      
      ,"groupTitles":[ 
             {"titles" :["PR #","Procurement mode"]}
      ]
   });
}

function toggleUnitPriceComma(param){
    $("#tblProcurementDetails").find("input[name='unit_price']").each(function(){
        var unitPrice = $.trim(this.value);
        if(unitPrice){
            if(param==="Y"){
                 $(this).val(toCurrencyFormat(unitPrice));
            }
            
            if(param==="N"){
                $(this).val(unitPrice.replace(/,/g, ''));
            }
        }
    });
}

var toCurrencyFormat = function(num){
	var str = num.toString().replace("$", ""), parts = false, output = [], i = 1, formatted = null;
	if(str.indexOf(".") > 0) {
		parts = str.split(".");
		str = parts[0];
	}
	str = str.split("").reverse();
	for(var j = 0, len = str.length; j < len; j++) {
		if(str[j] != ",") {
			output.push(str[j]);
			if(i%3 == 0 && j < (len - 1)) {
				output.push(",");
			}
			i++;
		}
	}
	formatted = output.reverse().join("");
	return(formatted + ((parts) ? "." + parts[1].substr(0, 2) : ""));
};

function showUploadFile(procurement_id){
    $('#modalUploadFile').find(".modal-title").text("Upload File");
    $('#modalUploadFile').modal("show");
    $('#modalUploadFile').find("form").attr("enctype","multipart/form-data");
    
    $.get(base_url + 'page/name/tmplImageUpload'
        ,function(data){
            $('#modalUploadFile').find('.modal-body').html(data);
            $('#modalUploadFile').find('.control-label').html('File');
            $("#frm_modalUploadFile").find("#prefixKey").val("procurement.");
           initChangeEvent();
        }
    ); 
}

function initChangeEvent(){
    $("input[name='file_thumbnail']").change(function(){
        fileNameThumbNail= this.files[0].name;
        var fileSize1 =  this.files[0].size / 1000.00 //to kilobytes
        if(fileSize1 > 100){ 
            alert("Please make sure that file size must not exceed 100 KB.");
            this.value="";
        }
    });
    
    $("input[name='file']").change(function(){
        fileNameOrg=this.files[0].name;
        var fileSize2 =  this.files[0].size / 1000.00 //to kilobytes
        if(fileSize2 > 800){ //1mb
            alert("It is recommended that file size must not exceed 800 KB.");
            this.value="";
        }
    });
}

function uploadFile(){
    var frm = $("#frm_modalUploadFile");
    var fileOrg=frm.find("#file").get(0);

    if( fileOrg.files.length<1 ) { 
         alert("Please select image.");
        return;
    }
    var formData = new FormData( frm.get(0));
    $.ajax({
        url: base_url + 'file/UploadImage',  //server script to process data
        type: 'POST',

        //Ajax events
        success: completeHandler = function(data) {
            if(data.isSuccess) {
                //submit filename to server
                $.get(execURL  + "dbo.image_file_users_upd @user_id=" + user_id
                                + ",@img_filename='procurement." +  fileOrg.files[0].name + "'"
                ,function(data){
                    zsi.form.showAlert("alert");
                    $('#modalUploadFile').modal('toggle');
                    //refresh latest records:
                    displayRecords("");
                });

                    
            } else {
                alert(data.errMsg);
            }
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

function mouseover(fileName){
 $("#user-box").css("display","block");
 var $img = $("#user-box img");
 $img.attr("src",base_url + "file/viewImage?fileName=" +  fileName + "&isThumbNail=n");
 
 if(fileName!=="") 
    $img.attr("style","margin-left:0px;");
else
    $img.attr("style","margin-left:-106px;");
}

function mouseout(){
    $("#user-box").css("display","none");
}                                           
    