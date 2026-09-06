/*
    Base path resolution.

    The original front-end was served from the domain root, so its module
    loaders name assets by absolute path - sim_static/init.js alone lists 40 of
    them, all beginning with "/sim_static/". Uploaded into a subdirectory those
    resolve against the domain root instead of the tool, and nothing loads.

    This works out where the tool actually lives from the URL of this script,
    and rewrites asset paths as the module loader reads them. The result is a
    folder that runs unchanged at a domain root, on a subdomain, or at any depth
    of subdirectory. No original file is modified.
*/

var FySim = (function(){

    var marker = 'local/base.js',
    src = document.currentScript.src,
    base = src.slice(0, src.lastIndexOf(marker));

    return {
        base: base,
        // Everything the tool fetches lives inside its own folder, so a leading
        // slash always means "relative to the tool", not to the domain.
        resolve: function(url){
            return (typeof url === 'string' && url.charAt(0) === '/')
                ? base + url.slice(1)
                : url;
        }
    };

})();


/* Rewrite asset paths as they are loaded
-----------------------------------------------------------------------------*/
(function(){

    var original = Assets.load;

    Assets.load = function(mod, callback){

        for (var type in mod.assets){

            var group = mod.assets[type];

            for (var i = 0; i < group.length; i++){
                group[i].src = FySim.resolve(group[i].src);
            };
        };

        original(mod, callback);
    };

})();


/* Rewrite request paths
-----------------------------------------------------------------------------*/
/*
    The renderer fetches its GLSL over HTTP - Tool.ajaxGet prepends a slash to
    paths like "sim_static/graphics/shaders/.../mesh_vertex_shader.vert". In a
    subdirectory those 404, no shader program links, and the animator never
    reports ready, so the simulation sits at tick 0 with a blank canvas.
*/
(function(){

    var open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url){
        var args = Array.prototype.slice.call(arguments);
        args[1] = FySim.resolve(url);
        return open.apply(this, args);
    };

})();
