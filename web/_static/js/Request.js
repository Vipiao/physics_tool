var Request = (function(){

    var requests = 0;

    var req = function(){

        var request = new XMLHttpRequest();
        
        request.addEventListener('load', loaded);
        return request;
    };

    var loaded = function(){
        
        if (this.readyState === this.DONE) {
            if (this.status === 200) {
                this.callback(JSON.parse(this.responseText));
            };
        };  
    };

    var form = function(formElement, action, callback){

        var request = req(),
        data = new FormData(formElement);

        request.callback = callback;
        request.open('POST', action);
        //request.setRequestHeader("Content-type", "application/json");
        request.withCredentials = true;
        request.send(data);
        requests++;
    };

    var get = function(action, callback){

        var request = req();

        request.callback = callback;
        request.open('GET', action);
        request.send();
        requests++;

        
    };

    var jsonpost = function(jsonElement, action, callback){

        var request = req();

        request.callback = callback;
        request.open('POST', action);
        request.setRequestHeader("Content-type", "application/json");
        request.withCredentials = true;
        request.send(jsonElement);
        requests++;
    };


    return {
        json: function(jsonElement, action, callback){
            jsonpost(jsonElement, action, callback);
        },
        form: function(formElement, action, callback){
            form(formElement, action, callback);
        },
        get: function(action, callback){
            get(action, callback);
        },
        totalRequests: function(){
            return requests;
        }
    };

})();