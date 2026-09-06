var Model = function(data){
    this.data = data;
    this.elements = {};
};

Model.prototype.get = function(path){
    var buildPath = 'this.data.' + path;
    return eval(buildPath);
};

Model.prototype.register = function(path, element){

    // Snippet adapted from: https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
    // Creator: bpmason1
    var schema = this.elements; 
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }
    // End snippet.
    if (!schema[pList[len-1]]) schema[pList[len-1]] = [];
    schema[pList[len-1]].push(element);

};

Model.prototype.set = function(path, value){


    var schema = this.data;
    var e = this.elements;
    var hasElements = true;
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {};
        if ( !e[elem] ){
            hasElements = false;
        }else{
            e = e[elem];
        };
        schema = schema[elem];
    };
    schema[pList[len-1]] = value;


    /*
    var buildPath = 'this.elements.' + path;
    console.log(path)
    var elements = eval(buildPath);*/



    if (e[pList[len-1]]){
        for (var i = 0, l = e[pList[len-1]].length; i < l; i++){
            var event = new Event(path, {'bubbles': false});
            event.args = {
                'model': this,
                'path': path,
                'value': value
            };
            e[pList[len-1]][i].dispatchEvent(event);
        };
    };
};