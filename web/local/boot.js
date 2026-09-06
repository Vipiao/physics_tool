/*
    Standalone entry point.

    The original application booted seven front-end modules (gui, usr, sim,
    router, grp, msg, frm) against a MySQL-backed Flask server with accounts, a
    forum and messaging. This entry point boots only the two modules the
    simulator itself needs, and stands in for the rest:

        usr    - a fixed local user, so the scene tools are always available
        router - a no-op, since the page never navigates away

    Everything under /gui_static/ and /sim_static/ is the original source,
    unmodified.
*/

var usr = (function(){

    var model = new Model({
        'login': {
            'loggedin': true,
            'level': 2,
            'username': "local"
        }
    });

    return {
        name: 'usr',
        model: model,
        element: jML.atom.tag('DIV', "")
    };

})();


var router = (function(){

    var noop = {
        'navigate': function(){},
        'resolve': function(){}
    };

    return {
        router: function(){ return noop; },
        start: function(){}
    };

})();


var app = (function(){

    var name = 'app',
    model = new Model({
        'init': false,
        'mainmenu': [],
        'assets': {
            'gui': false,
            'sim': false
        }
    }),
    assets = {
        'js': [
            {
                'id': 'gui',
                'src': '/gui_static/init.js'
            },
            {
                'id': 'sim',
                'src': '/sim_static/init.js'
            }
        ]
    },
    eventElement = jML.atom.tag('DIV', "");

    return {
        model: model,
        assets: assets,
        name: name,
        element: eventElement
    };

})();


/* Page
-----------------------------------------------------------------------------*/
function header(){

    var logo = gui.jML.molecule.logo(),
    page = jML.atom.tag('DIV', [logo], {'class': 'page ffix'});

    return jML.atom.tag('HEADER', [page]);

};

function main(){

    var panel = sim.jML.structure.public_panel(),
    page = jML.atom.tag('DIV', [panel], {'class': 'page'});

    return jML.atom.tag('MAIN', [page], {'id': 'main'});

};

/* Starter scene
-----------------------------------------------------------------------------*/
/*
    An empty simulator reads as a broken page, so this lays out something that
    is already in motion on the first frame: a disc rolls down a ramp and takes
    out a stack of boxes. Written against the same public API the tool GUI uses,
    so it doubles as a worked example.

    The simulator creates its own ground, a slab whose surface sits at y = -15.
    The camera is 60 world units wide and centred on the origin, so on a 16:10
    canvas the visible area is roughly x in [-30, 30], y in [-18, 18].
*/
function starterScene(ps){

    var animator = ps.animator,
    groundLevel = -15;

    // Frame the scene rather than the origin: the default view is 60 units wide
    // and centred on (0, 0), which on a wide window puts the floor off the
    // bottom edge and leaves most of the canvas empty sky.
    animator.camera.width = 46;
    animator.camera.position = new Vec2(0, groundLevel + 7);
    animator.camera.calculateProjection();

    // A static body is pinned in place and exempt from gravity; the tool's
    // "Toggle static" button sets the same pair.
    function statik(geometry, x, y, orientation, color){
        var object = animator.createAnimatedObject(geometry);
        object.setIsAffectedByGravity(false);
        object.setPosition(new Vec2(x, y));
        if (orientation) object.setOrientation(orientation);
        object.setIsStatic(true);
        object.setVelocity(new Vec2(0, 0));
        if (color) object.setColor(color);
        return object;
    };

    function dynamic(geometry, x, y, color){
        var object = animator.createAnimatedObject(geometry);
        object.setPosition(new Vec2(x, y));
        if (color) object.setColor(color);
        return object;
    };

    var slate = new Vec3(0.29, 0.33, 0.39),
    amber = new Vec3(0.90, 0.60, 0.15),
    teal = new Vec3(0.10, 0.55, 0.60);

    // Ramp, tilted down towards the stack.
    statik(Shapes.rectangle(9, 0.35), -13, -8, -0.32, slate);

    // Backstop, so the boxes stay in frame once they scatter.
    statik(Shapes.rectangle(0.4, 3), 18, groundLevel + 3, 0, slate);

    // Stacked with a small gap: a body spawned exactly touching another starts
    // the first tick already in contact, which the collision pass resolves
    // badly.
    var boxSize = 1.2,
    gap = 0.15;
    for (var i = 0; i < 4; i++){
        dynamic(Shapes.square(boxSize), 7, groundLevel + gap + boxSize * (2 * i + 1), amber);
    };

    dynamic(Shapes.disc(1.6, 24), -20.5, -3.2, teal);
    dynamic(Shapes.triangle(1.4), 3, 6, amber);

};

function render(){

    var body = document.getElementById('body');

    utils.fill(body, header());
    utils.append(body, main());
    utils.append(body, gui.jML.structure.footer());

    starterScene(window.physicsSimulator);

};


Assets.load(app, function(){
    console.log("App initialized!");
    render();
});
