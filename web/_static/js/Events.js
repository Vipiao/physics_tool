var events = (function(){

    function formSuccess(args){
        var thisEvent = new Event('formSuccess', {bubbles: true});
        thisEvent.args = args;
        return thisEvent;
    };

    function testDown(){
        return new Event('testDown', {bubbles: true});
    };

    function loaded(){
        return new Event('loaded', {bubbles: false});
    };

    function done(){
        return new Event('done', {bubbles: true});
    };

    return {
        formSuccess: function(args){
            return formSuccess(args);
        },
        testDown: function(){
            return testDown();
        },
        loaded: function(){
            return loaded();
        },
        done: function(){
            return done();
        }
    };

})();