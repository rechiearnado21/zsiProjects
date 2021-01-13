 var bs = zsi.bs.ctrl
     svn =  zsi.setValIfNull
,genderTypes = [ 
            {text:"Male",value:"M"}
            ,{text:"Female",value:"F"}
        ]
,maritalStatusTypes= [
             {text:"Single",value:"S"}
            ,{text:"Married",value:"M"}
            ,{text:"Widow",value:"W"}
        ]        
;

zsi.ready(function(){
  
   /* $(".zPanel").css({
            height:$(window).height()-179
        });*/
     
    displayRecords();
  
});


/*$("#btnDelete").click(function(){
    zsi.form.deleteData({
         code       : "ref-0003"
        ,onComplete : function(data){
                        displayRecords();
                      }
    });   

});    
*/


$("#btnSave").click(function () {
    $("#grid").jsonSubmit({
              procedure  : "zsi_employees_upd"
             ,optionalItems : ["is_active"]
             ,onComplete : function (data) {
                  $("#grid").clearGrid();
                  if(data.isSuccess===true) zsi.form.showAlert("alert");
                  displayRecords();
             }
        });    
});



 function displayRecords(){   
     // var cb = bs({name:"cbFilter1",type:"checkbox"});
     $("#grid").dataBind({
	     url            : procURL + "zsi_employees_sel"
	    ,width          : 1200
	    ,height         : 506
	    //,selectorType   : "checkbox"
        ,blankRowsLimit:5
       // ,isPaging : false
        ,dataRows : [
    	
    		   {text  : " "                                 , width : 25        , style : "text-align:left;"       
            		    , onRender      :  function(d){ 
                		              return bs({name:"employee_id"   ,value: svn (d,"employee_id")    ,type:"hidden"});
                		                // +  (d !==null ? bs({name:"cb",type:"checkbox"}) : "" );
                    }
                }	 
            	,{ text:"First Name"                        , width:120       , style:"text-align:center;"        , type:"input"          ,name:"first_name"}
            	,{ text:"Middle Name"                       , width:120       , style:"text-align:center;"        , type:"input"          ,name:"middle_name"}
            	,{ text:"Last Name"                         , width:120       , style:"text-align:center;"        , type:"input"          ,name:"last_name"}
            	,{ text:"Suffix Name"                       , width:50       , style:"text-align:center;"         , type:"input"          ,name:"name_suffix"}
            	,{ text:"Birth Date"                        , width:120       , style:"text-align:center;"        , type:"input"          ,name:"birth_date"
            	                	     ,onRender:function(d){
            	                	           return  bs({name:"birth_date"   ,value: svn (d,"birth_date").toDateFormat()   });
                                    	      
                    	     }
            	        }
            	,{ text:"Gender"                            , width:80        , style:"text-align:center;"        , type:"select"         ,name:"gender"}
            	,{ text:"Marital Status"                    , width:80        , style:"text-align:center;"        , type:"select"         ,name:"marital_status"}
            	,{ text:"User Name"                         , width:80        , style:"text-align:center;"        , type:"select"         ,name:"user_id"}
            	,{ text:"Position"                          , width:120       , style:"text-align:center;"        , type:"select"         ,name:"position_id"}
            	,{ text:"Present Address"                   , width:120       , style:"text-align:center;"        , type:"input"          ,name:"present_address"}
            	,{ text:"Provincial Address"                , width:120       , style:"text-align:center;"        , type:"input"          ,name:"provincial_address"}
            	,{ text:"Contact No."                       , width:120       , style:"text-align:center;"        , type:"input"          ,name:"contact_no"}
            	,{ text:"Email Address"                     , width:120       , style:"text-align:center;"        , type:"input"          ,name:"email_address"}
            	,{ text:"Emergency Contact Person"          , width:120       , style:"text-align:center;"        , type:"input"          ,name:"emergency_contact_person"}
            	,{ text:"Emergecny Contact No."             , width:120       , style:"text-align:center;"        , type:"input"          ,name:"emergency_contact_no"}
            	,{ text:"Active?"                           , width:80        , style:"text-align:center;"        , type:"yesno"          ,name:"is_active"}
            	
            	
	    ]
	    ,onComplete:function(){
	          $("#grid").find("select[name='gender']").fillSelect({data: genderTypes});
	          $("#grid").find("select[name='marital_status']").fillSelect({data: maritalStatusTypes});
	          $("select[name='position_id']").dataBind("position");
	          $("select[name='user_id']").dataBind("users");
	    }
    });    
}

                 