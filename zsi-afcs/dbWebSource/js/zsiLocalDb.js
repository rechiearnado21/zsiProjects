if(typeof zsi === "undefined") zsi = {}; 
zsi.localDb = function(version){
    var _self= this; 
    var _readError = "Unable to retrieve daa from database!";
    this.dbName = "zsi-db";
    this.db=null;
    this.loadJSON = async function(url) {
      var response = await fetch(url);
       return await response.json();
    }

    this.init = function(){
         window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
         window.IDBTransaction = window.IDBTransaction ||  window.webkitIDBTransaction || window.msIDBTransaction;
         window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
         if ( ! window.indexedDB) {
            console.error("Your browser doesn't support a stable version of IndexedDB.");
         }
    };
    
    this.loadServerDataToLocal = function(o){
        var ctr = 0;
        var _checkComplete = function(){
            ctr++;
            
            if(ctr === o.objects.length) {
                if(o.onComplete){
                    _self.onComplete = o.onComplete;
                    _self.onComplete(o);
                }
                
            }
        };

        //create objectStore first
        o.objects.forEach(function(v) { 
                var _db =  v.event.target.result;
                var _objStore = _db.createObjectStore( v.tableName,{ keyPath: v.keyPath, autoIncrement:v.autoIncrement }); 
                if(v.createIndex){
                    _objStore.createIndex( v.createIndex.name ,  v.createIndex.value, {unique: v.createIndex.isUnique});
                }
        });
            
        //load server data and save to localdb asynchronously
        o.objects.forEach( async function(v) {
            var _db =  v.event.target.result;
            var _data = await _self.loadJSON(v.url);
            var _objStore = _db.transaction(v.tableName, "readwrite").objectStore(v.tableName);
            _data.rows.forEach(function(o) {
                    _objStore.add(o);
            });
            if(v.onComplete){
                _self.onEachComplete = v.onComplete;
                _self.onEachComplete(v,_data.rows);
            }
           _checkComplete();
        });

    };

    this.read = function(o,callBack) {
        var _selfRead= this;
        var transaction = _self.db.transaction(o.tableName);
        var objectStore = transaction.objectStore(o.tableName);
        
        if(typeof o.key === "undefined"){
             console.error("key not defined."); return;
        }
        
        var request = objectStore.get(o.key);
        
        request.onerror = function(event) {
           console.log(_readError);
        };
        request.onsuccess = function(event) {
           if(callBack) callBack(request.result);
        };
        
        
        return request;
    };
    
    this.readAll = function(o,callBack) {
        var objectStore = _self.db.transaction(o.tableName).objectStore(o.tableName);
        var request = objectStore.getAll();
        
        request.onerror = function(event) {
           console.log(_readError);
        };
        
        request.onsuccess = function(event) {
            if(callBack) callBack(request.result);
        };
    };
    
    this.add = function(o,callBack) {
        var request = _self.db.transaction(o.tableName, "readwrite").objectStore(o.tableName)
        .add(o.data);
        
        request.onsuccess = function(event) {
            if(callBack) callBack(true);
        };
        
        request.onerror = function(event) {
            if(callBack) callBack(false);
        };
    };
    
    this.open = function(){
        return  window.indexedDB.open(this.dbName,version);
    };
    
    this.getAll  = function(tableName, callBack){
        var request1 = _self.open();
        request1.onsuccess = function(event) {
            var _db = event.target.result;
                var transaction = _db.transaction(tableName,'readonly');
                var store = transaction.objectStore(tableName);
                var request2 = store.getAll();
        
                request2.onsuccess = function(event) {
                    callBack( request2.result);
                };
        
        };
    };    
    
    this.delete = function (o) {
        var request = _self.db.transaction(o.tableName, "readwrite").objectStore(o.tableName);
        if(typeof o.key === "undefined"){
             console.error("key not defined."); return;
        }        
        request.delete( o.key);
        
        request.onsuccess = function(event) {
           if(callBack) callBack(true);
        };
    };    
    
    this.init();
    this.request = window.indexedDB.open(this.dbName,version);
    return this;
};

             