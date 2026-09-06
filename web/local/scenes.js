/*
    Scene storage.

    The tool GUI saves and loads scenes through three endpoints on the original
    Flask server. On a static host there is no server to answer them, so this
    wraps the framework's request layer: calls to /sim/ are answered from
    localStorage, everything else is passed through untouched.

    A host that does answer /sim/ wins. The first /sim/ call probes for one and
    the result is reused, so running under serve.py stores scenes in its SQLite
    file exactly as before, and uploading the same folder to a static host falls
    back to the browser without any change to the files.

    No original file is modified; this only replaces two functions on the global
    Request object.
*/

var SceneStore = (function(){

    var STORAGE_KEY = 'fysim.scenes',
    // A saved scene runs to a few hundred KB once escaped, against a
    // localStorage budget of about 5MB. Eight leaves headroom; past that the
    // oldest is dropped.
    MAX_SCENES = 8,
    server = null,          // null until probed, then true or false
    waiting = [];           // callers queued behind the probe

    /* Storage
    -------------------------------------------------------------------------*/
    function read(){
        try {
            return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        };
    };

    function write(scenes){
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
            return true;
        } catch (e) {
            // Out of quota. The oldest scene is the cheapest thing to give up.
            if (scenes.length > 1){
                return write(scenes.slice(0, scenes.length - 1));
            };
            return false;
        };
    };

    function timestamp(){
        var d = new Date();
        function pad(n){ return (n < 10 ? '0' : '') + n; };
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
            + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    };

    /* The response envelope the front-end unwraps
    -------------------------------------------------------------------------*/
    function packet(header, success, data, formFailed){
        return {
            'header': header,
            'notifications': [],
            'success': !!success,
            'data': data === undefined ? {} : data,
            'formFailed': formFailed || []
        };
    };

    /* Local answers to the three endpoints
    -------------------------------------------------------------------------*/
    function myScenes(){
        var scenes = read(),
        listing = [];

        for (var i = 0; i < scenes.length; i++){
            listing.push({
                'sceneid': scenes[i].sceneid,
                'name': scenes[i].name,
                'timestamp': scenes[i].timestamp,
                'thumb': scenes[i].thumb
            });
        };

        return packet('my_scenes_result', true, listing);
    };

    function find(sceneid){
        var scenes = read();
        for (var i = 0; i < scenes.length; i++){
            if (String(scenes[i].sceneid) === String(sceneid)) return scenes[i];
        };
        return null;
    };

    function sceneBody(sceneid){
        var scene = find(sceneid);
        return packet('scene_body_result', !!scene, scene ? {'body': scene.body} : {});
    };

    function scene(sceneid){
        var found = find(sceneid);
        return packet('scene_result', !!found, found ? {
            'sceneid': found.sceneid,
            'name': found.name,
            'timestamp': found.timestamp,
            'thumb': found.thumb
        } : {});
    };

    function saveScene(fields){
        var name = fields.name || "";

        if (!name) return packet('save_scene_result', false, {'name': name}, ['name']);

        var scenes = read(),
        nextId = 1;

        for (var i = 0; i < scenes.length; i++){
            if (scenes[i].sceneid >= nextId) nextId = scenes[i].sceneid + 1;
        };

        scenes.unshift({
            'sceneid': nextId,
            'name': name,
            'timestamp': timestamp(),
            'thumb': fields.thumb || "",
            'body': fields.scene || ""
        });

        if (scenes.length > MAX_SCENES) scenes = scenes.slice(0, MAX_SCENES);

        var stored = write(scenes);

        return packet('save_scene_result', stored, {
            'name': name,
            'valid': true,
            'sceneid': nextId
        });
    };

    /* Routing a /sim/ URL to its local answer
    -------------------------------------------------------------------------*/
    function parameter(url, key){
        var match = new RegExp('[?&]' + key + '=([^&]*)').exec(url);
        return match ? decodeURIComponent(match[1]) : "";
    };

    function answer(url, fields){
        var action = parameter(url, 'action');

        if (action === 'my_scenes') return myScenes();
        if (action === 'scene_body') return sceneBody(parameter(url, 'sceneid'));
        if (action === 'scene') return scene(parameter(url, 'sceneid'));
        if (action === 'save_scene') return saveScene(fields || {});

        return packet('unknown_action', false);
    };

    /* Probing for a real server
    -------------------------------------------------------------------------*/
    function probe(callback){
        if (server !== null) return callback(server);

        waiting.push(callback);
        if (waiting.length > 1) return;

        var request = new XMLHttpRequest();

        function settle(found){
            server = found;
            var queued = waiting;
            waiting = [];
            for (var i = 0; i < queued.length; i++) queued[i](server);
        };

        request.onreadystatechange = function(){
            if (request.readyState !== 4) return;
            var found = false;
            if (request.status === 200){
                try {
                    found = !!JSON.parse(request.responseText).header;
                } catch (e) {
                    found = false;
                };
            };
            settle(found);
        };
        request.onerror = function(){ settle(false); };

        try {
            request.open('GET', FySim.resolve('/sim/get?action=my_scenes'), true);
            request.send();
        } catch (e) {
            settle(false);
        };
    };

    return {
        handles: function(url){
            return typeof url === 'string' && url.indexOf('/sim/') === 0;
        },
        resolve: FySim.resolve,
        probe: probe,
        answer: answer
    };

})();


/* Wrap the request layer
-----------------------------------------------------------------------------*/
(function(){

    var passthroughGet = Request.get,
    passthroughForm = Request.form;

    Request.get = function(action, callback){

        if (!SceneStore.handles(action)) return passthroughGet(action, callback);

        SceneStore.probe(function(hasServer){
            if (hasServer){
                passthroughGet(SceneStore.resolve(action), callback);
            }else{
                callback(SceneStore.answer(action));
            };
        });
    };

    Request.form = function(formElement, action, callback){

        if (!SceneStore.handles(action)) return passthroughForm(formElement, action, callback);

        SceneStore.probe(function(hasServer){
            if (hasServer){
                passthroughForm(formElement, SceneStore.resolve(action), callback);
                return;
            };

            var fields = {},
            data = new FormData(formElement),
            keys = data.keys ? data.keys() : null;

            if (keys){
                var entry = keys.next();
                while (!entry.done){
                    fields[entry.value] = data.get(entry.value);
                    entry = keys.next();
                };
            };

            callback(SceneStore.answer(action, fields));
        });
    };

})();
