var bs = zsi.bs.ctrl;
var svn =  zsi.setValIfNull;

zsi.ready(function(){
    displayRecords();
    getTemplate();
});

function getTemplate(){
    $.get(base_url + "templates/bsDialogBox.txt",function(d){
        var template = Handlebars.compile(d);     

        var context = { id:"modalWindow"
                        , sizeAttr: "modal-lg"
                        , title: "Unit of Measure"
                        , footer:  ' <div class="pull-left"><button type="button" onclick="submitData();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>'
                                +  ' <button type="button" onclick="deleteData();" class="btn btn-primary"><span class="glyphicon glyphicon-trash"></span> Delete</button></div>'
                        , body: '<div id="inActiveRecords" class="zGrid" ></div>'
                      };
        var html    = template(context);     
        $("body").append(html);
    });    
}

function deleteData(){
    zsi.form.deleteData({
         code       : "ref-0011"
        ,onComplete : function(data){
                $("#grid").trigger('refresh');
                displayInactive();
        }
    }); 
} 

function submitData(){    
  $("#frm_modalWindow").jsonSubmit({
            procedure  : "unit_of_measure_upd"
            ,optionalItems: ["is_active"]
            //,notInclude: "#employee_name"
            ,onComplete : function (data) {
                 if(data.isSuccess===true) zsi.form.showAlert("alert");
                 $("#grid").trigger('refresh');
                 displayInactive();
            }
    });        
}

$("#btnInactive").click(function () {
    $(".modal-title").text("Inactive Unit of Measure");
    $('#modalWindow').modal({ show: true, keyboard: false, backdrop: 'static' });
    //$('#modalWindow').setCloseModalConfirm(); 
    displayInactive();
}); 


$("#btnSave").click(function () {
  //  console.log("test");
   $("#grid").jsonSubmit({
             procedure: "unit_of_measure_upd"
            , optionalItems: ["is_active"]
            , onComplete: function (data) {
                $("#grid").clearGrid();
                if(data.isSuccess===true) zsi.form.showAlert("alert");
                displayRecords();
            }
    });
});
    
function displayRecords(){
     var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : execURL + "unit_of_measure_sel"
	    ,width          : 600
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        //,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"unit_of_measure_id",type:"hidden",value: svn (d,"unit_of_measure_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                , name  : "unit_of_measure_code"        , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "unit_of_measure_name"        , type  : "input"         , width : 320       , style : "text-align:left;"}
        		,{text  :"Active?"              , name  : "is_active"                   , type  : "yesno"         , width:75          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter1").setCheckEvent("#grid input[name='cb']");
        }  
    });    
}

function displayInactive(){
     var cb = bs({name:"cbFilter2",type:"checkbox"});
     $("#inActiveRecords").dataBind({
	     url            : execURL + "unit_of_measure_sel @is_active='N'"
	    ,width          : 600
	    ,height         : 400
	    ,selectorType   : "checkbox"
        ,blankRowsLimit:5
        //,isPaging : false
        ,dataRows : [
                 {text  : cb                                                           , width : 25        , style : "text-align:left;"       
        		    , onRender      :  function(d){ 
                		                    return     bs({name:"unit_of_measure_id",type:"hidden",value: svn (d,"unit_of_measure_id")})
                                                      +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                            }
            }	 
        		,{text  : "Code"                , name  : "unit_of_measure_code"        , type  : "input"         , width : 150       , style : "text-align:left;"}
        		,{text  : "Name"                , name  : "unit_of_measure_name"        , type  : "input"         , width : 320       , style : "text-align:left;"}
        		,{text  :"Active?"              , name  : "is_active"                   , type  : "yesno"         , width:75          , style : "text-align:left;"   ,defaultValue:"Y"                 }
	    ] 
    	     ,onComplete: function(){
                $("#cbFilter2").setCheckEvent("#inActiveRecords input[name='cb']");
        }  
    });    
}
    

    
                                            