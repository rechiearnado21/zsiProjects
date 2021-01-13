   var gps = (function(){
    var  _pub               = {
                 userInfo   : {userName:"admin_lamadotrasco",password:"223344",timeDifference:400,language:"EN"}
                ,loginUser  : {}
        }  
        ,gTabName           = ""
        ,gpsAPIUrl          = "http://111.125.82.153:5567/APP/" 
        ,login              = function(){
            callGPSData({
                     apiName: "appLogin"
                    ,parameters:{
                         UserName: _pub.userInfo.userName
                        ,Password: _pub.userInfo.password
                    }
                    ,onComplete: function(data){
                        _pub.loginUser = data.Content.LoginUser;
                        $("#user_id").val(_pub.loginUser.UserID);
                        $("#user_name").val(_pub.userInfo.userName);
                        console.log("appLogin,response:",data);
                    }
            });
    
        }
        ,callGPSData        = function(o){
            var p = {
                 type: 'POST'  
                ,headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
              , url:  gpsAPIUrl + o.apiName
              , data: o.parameters
              , contentType: 'application/json'
              , success:o.onComplete
              , error : function(data){
                    console.log("Error on GPS API",data);
                }      
            };
        
            $.ajax(p);
        }
        ,getUserParameters  = function(){
            return {
                   TimeDifference   : _pub.userInfo.timeDifference
                  ,Language         : _pub.userInfo.language
                  ,LoginToken       : _pub.loginUser.LoginToken
                  ,UserID           : _pub.loginUser.UserID
                
            };
        }         
        
    ;
    
    zsi.ready = function(){ 
        $(".page-title").html("Global Positioning System (GPS) - Web Console");
        $(".panel-container").css("min-height", $(window).height() - 200);
        $('[data-toggle="tooltip"]').tooltip();  
        gTabName = $.trim($(".main-nav-tabs").find(".nav-link.active").text()); 
        $(".main-nav-tabs").find('a[data-toggle="tab"]').unbind().on('shown.bs.tab', function(e){
            gTabName = $.trim($(e.target).text()); 
            $(".sub-nav-tabs").find(".nav-link").removeClass("active");
            $(".sub-nav-tabs").find(".nav-item:first-child()").find(".nav-link").addClass("active");  
        });  
        login();
    }; 

    _pub.getVehicleInfoByUserID         =  function(){
         callGPSData({
             apiName: "getVehicleInfoByUserID"
            ,parameters: getUserParameters()
            ,onComplete: function(data){
                console.log(data);
            }
        });
    };
    
    _pub.getRealTimeGPSInfoByUser       =  function(){
         callGPSData({
             apiName: "getRealTimeGPSInfoByUserID"
            ,parameters: getUserParameters()
            ,onComplete: function(data){
                $("#result1").dataBindGrid({
                     rows:data.Content
                    ,onComplete:function(data){
                        console.log("getRealTimeGPSInfoByUserID:",data);
                    }
                    
                });
                
            }
        });
    };
    
    _pub.getRealTimeAlarmInfoByUser     =  function(){
        var _params = getUserParameters();
            _$maxAlarmIndex = $("#max_alarm_index");
            _params.MaxAlarmIndex =  _$maxAlarmIndex.val() || 0; 
        
         callGPSData({
             apiName: "getRealTimeAlarmInfoByUserID"
            ,parameters: _params
            ,onComplete: function(data){
                 _$maxAlarmIndex.val(data.Content.MaxAlarmIndex);
                
            }
        });        
    };
    
    _pub.getRealTimeGPSInfoByTrackID    =  function(){
        var _params = getUserParameters();
        _track_id = $("#track_id").val();
        
        if(_track_id.trim() === ""){ 
            alert("Enter trackId");
            return;
        }
        _params.TrackID=_track_id;
        
        callGPSData({
             apiName: "getRealTimeGPSInfoByTrackID"
            ,parameters: _params
            ,onComplete: function(data){ 
                $("#result1").dataBindGrid({
                     rows:data.Content
                });
            }
        });        
    };

    _pub.getOnlineStatus                =  function(){
        var _params = getUserParameters();
        callGPSData({
             apiName: "getOnlineStatus"
            ,parameters: _params
            ,onComplete: function(data){
                $("#result1").dataBindGrid({
                     rows:[data.Content]
                });
            }
        });        
    };    
    
    _pub.getLastGPSInfoByTrackID        =  function(){
        var _params = getUserParameters();
        _track_id = $("#track_id").val();
        
        if(_track_id.trim() === ""){ 
            alert("Enter trackId");
            return;
        }
        _params.TrackID=_track_id;
        
        callGPSData({
             apiName: "getLastGPSInfoByTrackID"
            ,parameters: _params
            ,onComplete: function(data){
                  
                $("#result1").dataBindGrid({
                     rows:data.Content
                });
            }
        });        
    };    

    _pub.getAD                          =  function(){
        var _params = getUserParameters();
        callGPSData({
             apiName: "getAD"
            ,parameters: _params
            ,onComplete: function(data){
                if(data.Content.AD.length > 0)
                    $("#result1").dataBindGrid({
                         rows:data.Content.AD
                    });
            }
        });        
    };        

    _pub.getBasicInfoByUserId           =  function(){
        var _params = getUserParameters();
        callGPSData({
             apiName: "getBasicInfoByUserId"
            ,parameters: _params
            ,onComplete: function(data){
                console.log("getBasicInfoByUserId",data);  
            }
        });        
    }; 

    return _pub;
    
})();     


                                                         