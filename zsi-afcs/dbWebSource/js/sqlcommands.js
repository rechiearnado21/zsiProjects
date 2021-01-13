var sc = (function(){
   var _pub = {
         gMdlId         : "modalAdd"
        ,editor         : null
        ,tw             : {}
        ,$modal         : null
        ,$is_procedure  : null
        ,$id            : null
        ,$code          : null
        ,$is_public     : null
        ,data           : {}
       
        ,modalTemplate : function(){
            return     { 
              id    : this.gMdlId
            , title : 'Add SQL Command'
            , body :  this.tw.sqlCmdMdlBody().html()
            , footer: '<button id="btnSave" type="button" class="btn btn-primary">Save</button><button id="btnRun" type="button" class="btn btn-primary">Run</button>' 
        
            };
        } 
        ,getTemplate  : function(callBack) {

                        $("#"+ this.gMdlId).remove();
                        $("body").append( this.tw.bsModalBox( this.modalTemplate() ).html() );
                        $modal = $("#" + this.gMdlId);
                        $is_procedure = $modal.find('#is_procedure');
                        $id = $modal.find('#sqlcmd_id');
                        $code = $modal.find('#sqlcmd_code');
                        $is_public = $modal.find('#is_public');
                        $modal.find("form").append('<pre id="editor"></pre>');
                        if (typeof callBack === "function") callBack();
                    }
        ,initAceEditor      : function(readonly) {
            var options = {
                enableBasicAutocompletion: true,
                enableSnippets: true,
                enableLiveAutocompletion: false,
                maxLines: Infinity,
                fontSize: "10pt"
            };
            editor=null;
            ace.require("ace/ext/language_tools");
            editor = ace.edit("editor");
            editor.setTheme("ace/theme/monokai");
            editor.session.setMode("ace/mode/sql");
            editor.setAutoScrollEditorIntoView(true);
            
            if (readonly) {
                options.readOnly = true;
                options.highlightActiveLine = false;
                options.highlightGutterLine = false;
                editor.renderer.$cursorLayer.element.style.opacity = 0;
            }
        
            editor.setOptions(options);
        }
        ,displaySqlCommands : function(code,text,callBack) {
            $("#grid-SqlCommands").dataBind({
                 sqlCode:"S53"
                ,parameters : {
                     searchCode: code || ""
                    ,searchText: text || ""
                    ,sort_index: 3 
                }
                ,width      : $(".zContainer").width() 
                ,height     : $(window).height() - 240
                ,isPaging   : true
                ,rowsPerPage : 100
                ,dataRows : [
                                { text : "Code" , width : 100 , style : "text-align:center;"
                                    ,onRender: function(d) {
                                        return app.bs({ type : 'hidden' , name : 'sqlcmd_id' })
                                            +  app.bs({ type : 'input' , name : 'sqlcmd_code' , value : app.svn(d,'sqlcmd_code') });
                                    }
                                }
                                ,{ text : "SP/SQL Name"            ,type:"input"       ,width : 300    ,style : "text-align:left;"     ,name : 'sqlcmd_text'  }
                                ,{ text : "Is Proc?"        ,type:"input"       ,width : 80     ,style : "text-align:left;"     ,name : 'is_procedure' }
                                ,{ text : "Is Public?"      ,type:"input"       ,width : 80     ,style : "text-align:left;"     ,name : 'is_public' }
                                ,{ text : "Action" , width : 100 , style : "text-align:center;"
                                    ,onRender : function(d) {
                                        return '<a href="javascript:void(0);" class="edit-sqlcommand" onclick="sc.onClickEdit(this);" ><i class="fas fa-edit"></i></a>';
                                    }
                                }
                            ]
                ,onComplete : function(d) {
                    sc.data=d.data.rows;
                    if(callBack) callBack();
                }
            });
        }
        ,saveSqlCommand     : function() {
            var _sqlcmd_id = $id.val();
            var _sqlcmd_code = $code.val();
            var _sqlcmd_text = editor.getValue();
            var _is_public = $is_public.val();
            
            if (_sqlcmd_code === "") { alert("Please enter code"); return }
            if (_sqlcmd_text === "") { alert("Please enter sql statement."); return }
            
            $.post(app.procURL + "sql_commands_upd @sqlcmd_id="+_sqlcmd_id+",@sqlcmd_code='"+_sqlcmd_code+"',@sqlcmd_text='"+_sqlcmd_text + "',@is_public='"+_is_public+"'", function(d) {
                zsi.form.showAlert("savedWindow");
                sc.displaySqlCommands();
            });
        }
        ,onClickEdit        : function(anchor){
           var _rowInfo = sc.data[$(anchor).closest('.zRow').index()];
            this.getTemplate(function() {
                    $modal.modal('show');
                    $is_procedure.val(_rowInfo.is_procedure);
                    $id.val(_rowInfo.sqlcmd_id);
                    $code.val(_rowInfo.sqlcmd_code);
                    $is_public.val(_rowInfo.is_public);
                    $modal.find("#editor").empty();
                    $modal.find("#editor").html($('<div/>').text(_rowInfo.sqlcmd_text).html());
                    
                    setTimeout(function(){ 
                        //sc.initAceEditor(false);
                        sc.initAceEditor((_rowInfo.is_procedure === 'N' ? false : true));
                    }, 100);

            });            

        }
    }
    ;     
   
return _pub;

})();


zsi.ready = function() {
    var tmr = null;
    $(".page-title").html("SQL Commands");
    sc.tw = new zsi.easyJsTemplateWriter();
    sc.displaySqlCommands();

    $("#btnSync").click(function() {
        $.get(app.procURL + "sql_commands_sync", function() {
            sc.displaySqlCommands(); 
        });
    });        

    $('#' + sc.gMdlId).on('show.bs.modal', function (e) {
        console.log("agi");
        $code.val("");
        $is_public.val("N");
    });   
    $(document).on("click", "#btnRun", function () {
        var tbl = "#tblResult";
        $(tbl).show();
        var text = editor.getSelectedText();
        if (text === "") { text = editor.getValue(); }
        if (text === "") { alert("Please enter an sql statement."); return; }
        $.post(
            base_url + "sql/exec?p=" + escape(text)
            , function(data) {
                var d = data.rows;
                if (d.length == 0) {
                    $(tbl).html("No Result.");
                    return;
                }
                var hInfo = d[0];
                var keys = Object.keys(hInfo);
                var colsLength = keys.length;
        
                var h = "<table class='fullWidth'><thead><tr>";
                for (var i = 0; i < colsLength; i++) {
                    h += "<th>" + keys[i] + "</th>";
                }
                h += "</tr></thead></table>"
                $(tbl).html(h);
        
                var trCls = "odd";
                for (var y = 0; y < d.length; y++) {
        
                    h = "<tr class='" + trCls + "'>";
                    if (trCls == "odd") trCls = "even"; else trCls = "odd";
        
                    for (var x = 0; x < colsLength; x++) {
                        var info = d[y];
                        var val = info[keys[x]];
                        var new_val = $('<div/>').text(val).html();
                        h += "<td>" + new_val + "</td>";
                    }
                    h += "</tr>";
                    $(tbl + " table").append(h);
                }
            }
        );
    });
    $(document).on("click", "#btnSave", sc.saveSqlCommand);
    $(window).bind('keydown', function (e) {
        var isCtrlS = (e.ctrlKey && e.which == 83);
        if (isCtrlS) {
            sc.saveSqlCommand();
            e.preventDefault();
            return false;
        }
    }); 
	function setInputs() { 
        $("#sql_code").on('keyup',function(e){
            clearTimeout(tmr);
            _searchCode = $.trim($(this).val()); 
            tmr = setTimeout(
    			function(){ 
    				  sc.displaySqlCommands(_searchCode);
    			},1000);
              
        }); 
        $("#stored_procedure").on('keyup',function(e){
            clearTimeout(tmr);
            _searchText = $.trim($(this).val()); 
             tmr = setTimeout(
    			function(){ 
    				  sc.displaySqlCommands("",_searchText);
    			},1000); 
        });
         
	}
    setInputs();
      
    
};  

                       