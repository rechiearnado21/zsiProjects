var printQR = (function(){
    var  _pub     = {}
        ,gSqlCode = 'G1333' //generated_qrs_prepaid_sel
    ;
    
    zsi.ready = function(){
        $(".page-title").html("Print QR");
        zsi.initInputTypesAndFormats();
    };
    
    function printQR(){
        setTimeout(function(){ 
            var _win = window.open('/');
            var _objDoc = _win.document;
            _objDoc.write('<html><body style="text-align:center;"><head><style>tbody tr > td:last-child{padding-right:0 !important;}</style></head>');
            _objDoc.write('<div style="justify-content:center;display:flex;">');
            _objDoc.write( document.getElementById("printThis").innerHTML ); 
            _objDoc.write('</div>');
            _objDoc.write('</body></html>');
            _objDoc.close();
            _win.focus();
            _win.print();
            _win.close(); 
            
            return true;
        }, 500);
    }
    
    function printQRTable(batch_no){
        var _$tbody = $("#qrTable > tbody");
        var _style = "width:160px;text-align:left;padding:0 95px 95px 0;";
        var _createQR = function(text){
            new QRCode(document.getElementById(text), {width:95, height:95}).makeCode(text);  
        };
        var _getData = function(cb){
            zsi.getData({ 
                 sqlCode     : gSqlCode
                ,parameters  : {batch_no: (batch_no ? batch_no : "")}
                ,onComplete  : function(d) {
                    var _rows = d.rows,
                        _arr = [],
                        _obj= {},
                        _ctr = 0,
                        _ctr2 = 0,
                        _h = "";
                        
                    for(var i=0; i < _rows.length; i++ ){
                        _ctr++;
                        _ctr2++;
                        var _o = _rows[i];
                        var _topIn = _o.hash_key;
                        var _topOut = _o.hash_key2;
                        
                        _h += "<td style='"+ _style +"'>"+ _o.ref_trans +"<div id='"+ _topIn +"'></div></td>"
                            + "<td style='"+ _style +"'><div id='"+ _topOut +"'></div></td>";

                        _obj["tIn" +_ctr] = _topIn;
                        _obj["tOut" +_ctr] = _topOut;
                        
                        if ((_ctr && (_ctr % 3 === 0)) || (_rows.length === _ctr2)) {
                            _h = "<tr>"+ _h +"</tr>";
                            _$tbody.append(_h);
                            _arr.push(_obj);
                            _obj = {};
                            _ctr = 0;
                            _h = "";
                        }
                    }
                    cb(_arr);
                }  
            });
        };
        
        _$tbody.html("");
        _getData(function(data){
            for(var i=0; i < data.length; i++){
                var _o = data[i];
                var _tIn1  = _o.tIn1,
                    _tOut1 = _o.tOut1,
                    _tIn2  = (isUD(_o.tIn2)? "":_o.tIn2),
                    _tOut2 = (isUD(_o.tOut2)? "":_o.tOut2),
                    _tIn3  = (isUD(_o.tIn3)? "":_o.tIn3),
                    _tOut3 = (isUD(_o.tOut3)? "":_o.tOut3);
                
                _createQR(_tIn1); 
                _createQR(_tOut1); 
                if(_tIn2) _createQR(_tIn2); 
                if(_tOut2) _createQR(_tOut2); 
                if(_tIn3) _createQR(_tIn3); 
                if(_tOut3) _createQR(_tOut3); 
            }
            
            printQR(); 
            $("#batchNo").html(batch_no); 
            
            // $("#qrTable").dataBind({
            //     rows        : data 
            //     ,height     : 0
            //     ,width      : "100%"
            //     ,dataRows   : [
            //          {text:"TOP-IN"               ,width:160        ,style:"text-align:left;padding: 0 96px 96px 0;"  
            //             ,onRender : function(d){
            //                 return app.svn(d, "refNo1") + "<div>" + app.svn(d, "tIn1") + "</div>";
            //             }
            //          }
            //         ,{text:"TOP-OUT"              ,width:160        ,style:"text-align:left;padding: 0 96px 96px 0;"  
            //             ,onRender : function(d){
            //                 return "<div>" + app.svn(d, "tOut1") + "</div>";
            //             }
            //         }
            //         ,{text:"TOP-IN"               ,width:160        ,style:"text-align:left;padding: 0 96px 96px 0;"  
            //             ,onRender : function(d){
            //                 return app.svn(d, "refNo2") + "<div>" + app.svn(d, "tIn2") + "</div>";
            //             }
            //          }
            //         ,{text:"TOP-OUT"              ,width:160        ,style:"text-align:left;padding: 0 96px 96px 0;"  
            //             ,onRender : function(d){
            //                 return "<div>" + app.svn(d, "tOut2") + "</div>";
            //             }
            //         }
            //         ,{text:"TOP-IN"               ,width:160        ,style:"text-align:left;padding: 0 96px 96px 0;"  
            //             ,onRender : function(d){
            //                 return app.svn(d, "refNo3") + "<div>" + app.svn(d, "tIn3") + "</div>";
            //             }
            //          }
            //         ,{text:"TOP-OUT"              ,width:160        ,style:"text-align:left;padding: 0 96px 96px 0;"  
            //             ,onRender : function(d){
            //                 return "<div>" + app.svn(d, "tOut3") + "</div>";
            //             }
            //         }
            //     ]
            //     ,onComplete  : function(o) {
            //         $.each(this.find("tbody tr"), function(i, v){
            //             $.each($("td > div", this), function(ii, vv){
            //                 var _$div = $(this);
            //                 var _val = $.trim(_$div.text());
            //                 _$div.text("");
            //                 if(_val) _createQR(_$div, _val);
            //             });
            //         });
            //         printQR(); 
            //         $("#batchNo").html(batch_no); 
            //     }
            // });
        });
    }
    
    $("#btnFilterVal").click(function(){
        var _batchNo = $("#batch_no").val().trim();
        
        if(_batchNo) printQRTable(_batchNo);
    });
    
    return _pub;
})();                                                                     