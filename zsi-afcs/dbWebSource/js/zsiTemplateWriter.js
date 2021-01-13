 
 
 
 
 
 
 
 function displaySmartAdminMenus(data){
    var _tw = new zsi.easyJsTemplateWriter();
    var _parentMenuItems = data.filter(function(x){ return x.pmenu_id === ""; });
    var _h="";
     
     
    $.each(_parentMenuItems,function(){
         var _self      = this;
         var _subItems  = data.filter(function(x){ return x.pmenu_id === _self.menu_id; });
         var _subH      = "";
          
         $.each(_subItems,function(){
            _subH += _tw.new().saSubMenuItem({ title: this.menu_name, icon: this.icon }).html();
             
            // console.log("_subH",_subH);
         });


         _h += _tw.new().saParentMenuItem({ title: this.menu_name,subItems:_subH  }).html();
         
    }); 
     //console.log("_h",_h);
    

   $("#js-nav-menu").html(_h);
   
   
 }  




 
        