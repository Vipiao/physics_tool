var Assets = (function(){

    var assets = {},
    loaded = [],
    subsets = [];

    var registerSubset = function(id, assets, element){

        subsets.push({
            'id': id,
            'assets': assets,
            'loaded': [],
            'element': element,
            'alerted': false
        });

    };

    var setLoaded = function(mod){

        loaded.push(mod.name);

        for (var i=0; i<subsets.length; i++){

            if (subsets[i].alerted) continue;

            var alert = false;
            
            for (var k=0; k<subsets[i].assets.length; k++){

                if ( loaded.indexOf(subsets[i].assets[k]) != -1 && subsets[i].loaded.indexOf(subsets[i].assets[k]) == -1) {
                    subsets[i].loaded.push(subsets[i].assets[k]);
                };

                if ( subsets[i].loaded.length == subsets[i].assets.length ) {
                    alert = true;
                    break;
                };

            };
            if (alert){
                var event = new Event(subsets[i].id, {'bubbles': false});
                subsets[i].element.dispatchEvent(event);
                subsets[i].alerted = true;
            };
        };
    };

    var load = function(mod, callback){

        if ( loaded.indexOf(mod.name) != -1 ) return;

        var model = mod.model,
        element = mod.element;

        model.register('init', element);
        element.addEventListener('init', function(event){

            if (event.args.path.indexOf('init') !== -1){

                if (event.args.value){

                    setLoaded(mod);
                    callback();

                }else{

                    unload(mod);

                };
            };

        });

        for (var type in mod.assets){

            for (var i=0, len=mod.assets[type].length; i<len; i++ ){

                var id = mod.assets[type][i].id,
                script = document.createElement('SCRIPT');

                script.setAttribute('src', mod.assets[type][i].src);
                script.async = true;

                model.register('assets.'+id, script);
                script.addEventListener('assets.'+id, function(event){

                    if (event.args.path.indexOf('assets.') !== -1){

                        if (event.args.value){

                            if ( utils.allTrue( model.get('assets') ) ) model.set('init', true);
        
                        }else{
        
                            utils.remove(event.target);
        
                        };
                    };    
                });

                document.head.appendChild(script);
                
            };
        };
    };

    var unload = function(mod, callback){

        var model = mod.model,
        assets = model.get('assets');

        model.set('init', false);

        for (var asset in assets){

            model.set('assets.'+asset, false);

        };

        callback();

    };

    return {
        registerSubset: function(id, assets, element){
            registerSubset(id, assets, element)
        },
        load: function(mod, callback){
            load(mod, callback)
        },
        unload: function(mod, callback){
            unload(mod, callback)
        }
    };

})();