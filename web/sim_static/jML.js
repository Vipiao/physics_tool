/* NAMESPACES
-----------------------------------------------------------------------------*/
sim.jML = function(){};
sim.jML.atom = function(){};
sim.jML.molecule = function(){};
sim.jML.structure = function(){};
sim.jML.page = function(){};


/* ATOMS
-----------------------------------------------------------------------------*/
sim.jML.atom.canvas = function(data){

    var canvas = jML.atom.tag('CANVAS', "", );    

    window.hasLoadedBeforeError = true;
    canvas.physicsSimulator = new PhysicsSimulator(canvas);
    window.physicsSimulator = canvas.physicsSimulator;

    var ps = canvas.physicsSimulator;

    canvas.mouseTool = jML.atom.tag('DIV', "mouse", {'class': 'mouseTool'});
    canvas.clickTool = jML.atom.tag('DIV', "click", {'class': 'clickTool'});

    canvas.polygonDraw = function(){};
    canvas.polygonDraw.create = 0;
    canvas.polygonDraw.angles = [];
    canvas.polygonDraw.top = [];
    canvas.polygonDraw.left = [];


    canvas.addEventListener('mousemove', function(event){

        canvas.mouseTopCoor = event.clientY,
        canvas.mouseLeftCoor = event.clientX;

    });

    canvas.addEventListener('mousedown', function(event){

        // Left click
        if (event.button == 0){

            if (canvas.polygonDraw.curAngle !== undefined) canvas.polygonDraw.angles.push(canvas.polygonDraw.curAngle);

        };

        // Right click
        if (event.button == 2){

            if (!canvas.polygonDraw.create){

                canvas.polygonDraw.angles.pop();
                canvas.polygonDraw.top.pop();
                canvas.polygonDraw.left.pop();

            }else{
                canvas.polygonDraw.create = 0;
            };
        };
    });

    canvas.addEventListener('click', function(event){

        canvas.clickTopCoor = event.clientY,
        canvas.clickLeftCoor = event.clientX;

        canvas.polygonDraw.top.push(event.clientY);
        canvas.polygonDraw.left.push(event.clientX);

    });

    canvas.addEventListener('keydown', function(e){

        if(e.keyCode == 13) {

            canvas.polygonDraw.create++;

            if (canvas.polygonDraw.create > 1){

                canvas.clickTool.classList.remove('show');
                canvas.mouseTool.classList.remove('show');
                canvas.polygonDraw.angles = [];
                canvas.polygonDraw.top = [];
                canvas.polygonDraw.left = [];
                canvas.polygonDraw.create = 0;

            };
        };     
    });

    // Polygon draw callback
    ps.addPolygonDrawDataCallback(function(props){

        canvas.clickTool.style.top = canvas.polygonDraw.top[canvas.polygonDraw.top.length - 1] + 'px';
        canvas.clickTool.style.left = canvas.polygonDraw.left[canvas.polygonDraw.left.length - 1] + 'px';

        canvas.mouseTool.style.top = canvas.mouseTopCoor + 20 + 'px';
        canvas.mouseTool.style.left = canvas.mouseLeftCoor + 20 + 'px';

        if (canvas.polygonDraw.angles.length){ 
            canvas.clickTool.classList.add('show');
            canvas.mouseTool.classList.add('show');
        }else{
            canvas.clickTool.classList.remove('show');
            canvas.mouseTool.classList.remove('show');           
        };

        if (props.angle !== undefined){

            var degrees = props.angle * (180 / Math.PI),
            roundedAngle = Math.round(degrees * 1000) / 1000;

            canvas.polygonDraw.curAngle = roundedAngle;

            if (canvas.polygonDraw.angles.length) roundedAngle -= canvas.polygonDraw.angles[canvas.polygonDraw.angles.length - 1];

            utils.fill(canvas.clickTool, document.createTextNode(roundedAngle));

        };

        if (props.magnitude !== undefined){

            var roundedMagnitude = Math.round(props.magnitude * 1000) / 1000;

            utils.fill(canvas.mouseTool, document.createTextNode(roundedMagnitude));

        };
    });

    // Object properties callback
    ps.addReadPropertiesCallback(function(properties){

        var data = {
            'mouseX': properties.mouseX,
            'mouseY': properties.mouseY,
            'type': 'polygon',
            'id': properties.id,
            'ps': ps,
            'canvas': canvas,
            'delete': function(event){
                ps.setPolygonProperties({
                    'id': properties.id,
                    'delete': true
                });
            },
            'props': {
                'positionX': {
                    'type': 'number',
                    'label': "X-position: ",
                    'value': properties.positionX
                },
                'positionY': {
                    'type': 'number',
                    'label': "Y-position: ",
                    'value': properties.positionY
                },
                'velocityX': {
                    'type': 'number',
                    'label': "X-velocity: ",
                    'min': 0,
                    'value': properties.velocityX
                },
                'velocityY': {
                    'type': 'number',
                    'label': "Y-velocity: ",
                    'min': 0,
                    'value': properties.velocityY
                },
                'orientation': {
                    'type': 'number',
                    'label': "Orientation: ",
                    'value': properties.orientation
                },
                'angularVelocity': {
                    'type': 'number',
                    'label': "Angular velocity: ",
                    'value': properties.angularVelocity
                },
                'density': {
                    'type': 'number',
                    'label': "Density: ",
                    'min': 0,
                    'value': properties.density
                },
                'mass': {
                    'type': 'number',
                    'label': "Mass: ",
                    'min': 0,
                    'value': properties.mass
                },
                'isFixed': {
                    'type': 'checkbox',
                    'label': "Fixed: ",
                    'value': properties.isFixed
                },
                'dynamicFrictionConstant': {
                    'type': 'number',
                    'min': 0,
                    'max': 1,
                    'step': 0.1,
                    'label': "Dynamic friction constant: ",
                    'value': properties.dynamicFrictionConstant
                },
                'staticFrictionConstant': {
                    'type': 'number',
                    'min': 0,
                    'max': 1,
                    'step': 0.1,
                    'label': "Static friction constant: ",
                    'value': properties.staticFrictionConstant
                },
                'bounceFactor': {
                    'type': 'number',
                    'label': "Bounce factor: ",
                    'min': 0,
                    'max': 1,
                    'step': 0.1,
                    'value': properties.bounceFactor
                }
            }
        };

        contextual = sim.jML.molecule.props_contextual(data);

        if (document.getElementById('polygon_' + properties.id)) utils.remove(document.getElementById('polygon_' + properties.id));

        utils.append(canvas.parentNode, contextual);

    });

    // Rope properties callback
    ps.addReadRopesCallback(function(properties){
        
        var data = {
            'mouseX': properties.mouseX,
            'mouseY': properties.mouseY,
            'type': 'rope',
            'id': properties.id,
            'ps': ps,
            'canvas': canvas,
            'delete': function(event){
                ps.setRopeProperties({
                    'id': properties.id,
                    'delete': true
                });
            },
            'props': {
                'length': {
                    'type': 'number',
                    'label': "Length: ",
                    'min': 0,
                    'value': properties.length
                }
            }
        };

        contextual = sim.jML.molecule.props_contextual(data);

        if (document.getElementById('rope_' + properties.id)) utils.remove(document.getElementById('rope_' + properties.id));

        utils.append(canvas.parentNode, contextual);
    });

    // Hinge properties callback
    ps.addReadHingesCallback(function(properties){
        
        var data = {
            'mouseX': properties.mouseX,
            'mouseY': properties.mouseY,
            'type': 'hinge',
            'id': properties.id,
            'ps': ps,
            'canvas': canvas,
            'delete': function(event){
                ps.setHingeProperties({
                    'id': properties.id,
                    'delete': true
                });
            },
            'props': {
                'friction': {
                    'type': 'number',
                    'label': "Friction: ",
                    'min': 0,
                    'max': 1,
                    'step': 0.1,
                    'value': properties.friction
                }
            }
        };

        contextual = sim.jML.molecule.props_contextual(data);

        if (document.getElementById('hinge_' + properties.id)) utils.remove(document.getElementById('hinge_' + properties.id));

        utils.append(canvas.parentNode, contextual);

    });

    // Fixed constraint properties callback
    ps.addReadFixedCallback(function(properties){
        
        var data = {
            'mouseX': properties.mouseX,
            'mouseY': properties.mouseY,
            'type': 'fixed',
            'id': properties.id,
            'ps': ps,
            'canvas': canvas,
            'delete': function(event){
                ps.setFixedProperties({
                    'id': properties.id,
                    'delete': true
                });
            },
            'props': {
                'positionX': {
                    'type': 'number',
                    'label': "X-position: ",
                    'value': properties.positionX
                },
                'positionY': {
                    'type': 'number',
                    'label': "Y-position: ",
                    'value': properties.positionY
                },
                'velocityX': {
                    'type': 'number',
                    'label': "X-velocity: ",
                    'min': 0,
                    'value': properties.velocityX
                },
                'velocityY': {
                    'type': 'number',
                    'label': "Y-velocity: ",
                    'min': 0,
                    'value': properties.velocityY
                }
            }
        };

        contextual = sim.jML.molecule.props_contextual(data);

        if (document.getElementById('object_id_' + properties.id)) utils.remove(document.getElementById('object_id_' + properties.id));

        utils.append(canvas.parentNode, contextual);
    });

    // Pulley properties callback
    ps.addReadPulleysCallback(function(properties){
        
        var data = {
            'mouseX': properties.mouseX,
            'mouseY': properties.mouseY,
            'type': 'pulley',
            'id': properties.id,
            'ps': ps,
            'canvas': canvas,
            'delete': function(event){
                ps.setPulleyProperties({
                    'id': properties.id,
                    'delete': true
                });
            },
            'props': {}
        };

        contextual = sim.jML.molecule.props_contextual(data);

        if (document.getElementById('object_id_' + properties.id)) utils.remove(document.getElementById('object_id_' + properties.id));

        utils.append(canvas.parentNode, contextual);
    });

    return canvas;

};


/* MOLECULES
-----------------------------------------------------------------------------*/
sim.jML.molecule.props_contextual = function(data){

    var close = jML.atom.tag('BUTTON', ""),
    title = jML.atom.tag('SPAN', "Type: "+ data.type +" ID: " + data.id),
    h2 = jML.atom.tag('H2', [title, close]),
    props_list = [],
    apply_object = {
        'id': data.id
    };

    function numbers(prop, props){

        var label = jML.atom.tag('LABEL', props.label),
        input = jML.atom.single('INPUT', {'type': 'number', 'value': props.value}),
        container = jML.atom.tag('DIV', [label, input], {'class': 'ffix'});

        if (props.min !== undefined){
            input.setAttribute('min', props.min);
        };

        if (props.max !== undefined){
            input.setAttribute('max', props.max);
        };

        if (props.step !== undefined){
            input.setAttribute('step', props.step);
        };

        input.addEventListener('change', function(event){

            apply_object[prop] = parseFloat(input.value);

        });

        props_list.push(container);

    };

    function checkboxes(prop, props){

        var label = jML.atom.tag('LABEL', props.label),
        input = jML.atom.single('INPUT', {'type': 'checkbox'}),
        container = jML.atom.tag('DIV', [label, input], {'class': 'ffix'});

        if (props.value) input.checked = true;

        input.addEventListener('change', function(event){

            apply_object[prop] = input.checked;

        });

        props_list.push(container);

    };

    function buttons(prop, props){

        var button = jML.atom.tag('BUTTON', props.label),
        container = jML.atom.tag('DIV', [button], {'class': 'ffix'});

        button.addEventListener('click', function(event){
            props.onclick(event)
        });

        props_list.push(container);

    };

    for (var prop in data.props){

        apply_object[prop] = data.props[prop].value;

        switch(data.props[prop].type) {

            case 'number':
                numbers(prop, data.props[prop])
                break;
            case 'checkbox':
                checkboxes(prop, data.props[prop])
                break;
            case 'button':
                buttons(prop, data.props[prop])
                break;

        };
    };

    close.addEventListener('click', function(){
        utils.remove(contextual);
    });

    var pos = data.canvas.getBoundingClientRect(),
    top = pos.top + data.mouseY,
    left = pos.left + data.mouseX,
    props = jML.atom.tag('DIV', props_list),
    applyButton = jML.atom.tag('BUTTON', "Apply"),
    deleteButton = jML.atom.tag('BUTTON', "Delete"),
    contextual = jML.atom.tag('DIV', [h2, props, applyButton, deleteButton], {'class': 'contextual', 'id': data.type+'_'+data.id, 'style': 'top:'+top+'px; left:'+left+'px;'});

    deleteButton.addEventListener('click', function(event){

        data.delete(event);

    });

    applyButton.addEventListener('click', function(){

        switch(data.type) {

            case 'polygon':
                data.ps.setPolygonProperties(apply_object);
                break;
            case 'rope':
                data.ps.setRopeProperties(apply_object);
                break;
            case 'hinge':
                data.ps.setHingeProperties(apply_object);
                break;
            case 'fixed':
                data.ps.setFixedProperties(apply_object);
                break;
            case 'pulley':
                data.ps.setPulleyProperties(apply_object);
                break;
        };


    });

    utils.move(title, contextual);

    return contextual;

};

sim.jML.molecule.tools_menu = function(data){

    var draw = jML.atom.tag('BUTTON', "Draw"),
    tools = jML.atom.tag('BUTTON', "Tools"),
    inspect = jML.atom.tag('BUTTON', "Inspect", {'class': 'selected'}),
    scene = jML.atom.tag('BUTTON', "Scene"),
    menu = jML.atom.tag('DIV', [draw, tools, inspect, scene], {'class': 'tools_menu'});
    
    var selected = inspect;

    data.select_tool = function(target){
        data.tool.classList.remove('selected');
        data.tool = target;
        target.classList.add('selected');
    };

    var draw_panel = sim.jML.molecule.tools_panel_draw(data),
    tools_panel = sim.jML.molecule.tools_panel_tools(data),
    inspect_panel = sim.jML.molecule.tools_panel_inspect(data),
    scene_panel = sim.jML.molecule.tools_panel_scene(data);

    data.tool = inspect_panel.getElementsByClassName('default_tool')[0];
    data.tool.classList.remove('default_tool');
    data.tool.classList.add('selected');

    function select(target){
        selected.classList.remove('selected');
        selected = target;
        target.classList.add('selected');
    };

    draw.addEventListener('click', function(){
        utils.fill(data.panel, draw_panel);
        select(draw);
    });

    tools.addEventListener('click', function(){
        utils.fill(data.panel, tools_panel);
        select(tools);
    });

    inspect.addEventListener('click', function(){
        utils.fill(data.panel, inspect_panel);
        select(inspect);
    });

    scene.addEventListener('click', function(){
        utils.fill(data.panel, scene_panel);
        select(scene);
    });

    inspect.click();

    return menu;
};

sim.jML.molecule.tools_props = function(data){

    var h2 = jML.atom.tag('H2', data.title);
    prop_list = [h2];    

    for (var property in data.props){
        var title = jML.atom.tag('LABEL', property),
        container = jML.atom.tag('DIV', [title, data.props[property]], {'class': 'ffix'});
        prop_list.push(container);
    };
    
    var props = jML.atom.tag('DIV', prop_list);

    return props;

};

sim.jML.molecule.tools_panel_scene = function(data){

    var freeze = jML.atom.tag('BUTTON', "Freeze"),
    pause = jML.atom.tag('BUTTON', "Pause"),
    saveLoad = jML.atom.tag('BUTTON', "Save/Load"),
    panel = jML.atom.tag('DIV', ifLoggedin());

    function ifLoggedin(){

        if (usr.model.get('login.loggedin')){
            return [freeze, pause, saveLoad];
        }else{
            return [freeze, pause];
        };

    };
    usr.model.register('login.loggedin', panel);
    panel.addEventListener('login.loggedin', function(event){

        utils.fill(panel, ifLoggedin());

    });

    var ps = data.canvas.physicsSimulator;

    // Save / Load properties
    saveLoad.addEventListener('click', function(){
        var saveLoad_props = sim.jML.molecule.saveLoad_props({'ps': ps});
        utils.fill(data.props, saveLoad_props);
        data.select_tool(saveLoad);
    });

    // Pause properties
    pause.addEventListener('click', function(){
        var pause_props = sim.jML.molecule.pause_props({'ps': ps});
        utils.fill(data.props, pause_props);
        data.select_tool(pause);
    });

    // Freeze properties
    freeze.addEventListener('click', function(){
        var freeze_props = sim.jML.molecule.freeze_props({'ps': ps});
        utils.fill(data.props, freeze_props);
        data.select_tool(freeze);
    });


    return panel;
};

sim.jML.molecule.tools_panel_draw = function(data){

    var polygonDraw = jML.atom.tag('BUTTON', "Polygon"),
    square = jML.atom.tag('BUTTON', "Square"),
    disc = jML.atom.tag('BUTTON', "Disc"),
    gear = jML.atom.tag('BUTTON', "Gear"),
    panel = jML.atom.tag('DIV', [polygonDraw, square, disc, gear]);

    var ps = data.canvas.physicsSimulator;

    // Polygon draw properties
    polygonDraw.addEventListener('click', function(){

        utils.append(data.canvas.parentNode, data.canvas.mouseTool);
        utils.append(data.canvas.parentNode, data.canvas.clickTool);

        var polygonDraw_props = sim.jML.molecule.polygon_draw_props({'ps': ps});
        ps.setMode(PhysicsSimulator.POLYGON_DRAW);
        utils.fill(data.props, polygonDraw_props);
        data.select_tool(polygonDraw);
    });

    // Gear properties
    gear.addEventListener('click', function(){
        var gear_props = sim.jML.molecule.gear_props({'ps': ps});
        ps.setModeCustomShapeSpawner();
        ps.setCustomShape(PhysicsSimulator.GEAR);
        ps.setPlacementMode(PhysicsSimulator.DEFAULT_PLACEMENT);
        utils.fill(data.props, gear_props);
        data.select_tool(gear);
    });

    // Disc properties
    disc.addEventListener('click', function(){
        var disc_props = sim.jML.molecule.disc_props({'ps': ps});
        ps.setModeCustomShapeSpawner();
        ps.setCustomShape(PhysicsSimulator.DISC);
        utils.fill(data.props, disc_props);
        data.select_tool(disc);
    });

    // Square properties
    square.addEventListener('click', function(){
        var square_props = sim.jML.molecule.square_props({'ps': ps});
        ps.setModeCustomShapeSpawner();
        ps.setCustomShape(PhysicsSimulator.SQUARE);
        utils.fill(data.props, square_props);
        data.select_tool(square);
    });

    return panel;
};

sim.jML.molecule.tools_panel_tools = function(data){

    var hinges = jML.atom.tag('BUTTON', "Hinge"),
    ropes = jML.atom.tag('BUTTON', "Rope"),
    pulley = jML.atom.tag('BUTTON', "Pulley"),
    panel = jML.atom.tag('DIV', [hinges, ropes, pulley]);

    var ps = data.canvas.physicsSimulator;

    // Pulley properties
    pulley.addEventListener('click', function(){
        var pulley_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.PULLEYS);
        utils.fill(data.props, pulley_props);
        data.select_tool(pulley);
    });

    // Ropes properties
    ropes.addEventListener('click', function(){
        var ropes_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.ROPES);
        utils.fill(data.props, ropes_props);
        data.select_tool(ropes);
    });

    // Hinges properties
    hinges.addEventListener('click', function(){
        var hinges_props = sim.jML.molecule.hinges_props({'ps': ps});
        ps.setMode(PhysicsSimulator.HINGES);
        utils.fill(data.props, hinges_props);
        data.select_tool(hinges);
    });

    return panel;
};

sim.jML.molecule.tools_panel_inspect = function(data){

    var defaultTool = jML.atom.tag('BUTTON', "Default", {'class': 'default_tool'}),
    move = jML.atom.tag('BUTTON', "Move"),
    readProps = jML.atom.tag('BUTTON', "Object properties"),
    deletePoly = jML.atom.tag('BUTTON', "Delete"),
    toggleStatic = jML.atom.tag('BUTTON', "Toggle static"),
    selectTools = jML.atom.tag('BUTTON', "Tool properties"),
    showForces = jML.atom.tag('BUTTON', "Forces"),
    panel = jML.atom.tag('DIV', [defaultTool, readProps, move, deletePoly, toggleStatic, selectTools, showForces]);

    var ps = data.canvas.physicsSimulator;

    // Show forces properties
    showForces.addEventListener('click', function(){
        var showForces_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.SHOW_FORCES);
        utils.fill(data.props, showForces_props);
        data.select_tool(showForces);
    });

    // Select objects properties
    selectTools.addEventListener('click', function(){
        var selectTools_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.SELECT_TOOLS);
        utils.fill(data.props, selectTools_props);
        data.select_tool(selectTools);
    });

    // Toggle static properties
    toggleStatic.addEventListener('click', function(){
        var toggleStatic_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.TOGGLE_STATIC);
        utils.fill(data.props, toggleStatic_props);
        data.select_tool(toggleStatic);
    });

    // Delete properties
    deletePoly.addEventListener('click', function(){
        var deletePoly_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.DELETE_POLYGONS);
        utils.fill(data.props, deletePoly_props);
        data.select_tool(deletePoly);
    });

    // Move properties
    move.addEventListener('click', function(){
        var move_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.MOVE_TOOL);
        utils.fill(data.props, move_props);
        data.select_tool(move);
    });

    // Default tool properties
    defaultTool.addEventListener('click', function(){
        var default_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.DEFAULT);
        utils.fill(data.props, default_props);
        data.select_tool(defaultTool);
    });

    // Read props properties
    readProps.addEventListener('click', function(){
        var read_props_props = jML.atom.tag('DIV', "");
        ps.setMode(PhysicsSimulator.READ_PROPERTIES);
        utils.fill(data.props, read_props_props);
        data.select_tool(readProps);
    });

    return panel;
};

// Properties ////////////
// Draw
sim.jML.molecule.polygon_draw_props = function(data){

    var polygonDraw_snapmode_default = jML.atom.tag('OPTION', "Default", {'value': 'SNAP _DEFAULT', 'selected': true}),
    polygonDraw_snapmode_polar = jML.atom.tag('OPTION', "Polar", {'value': 'SNAP_TO_POLAR'}),
    polygonDraw_snapmode_cartesian = jML.atom.tag('OPTION', "Cartesian", {'value': 'SNAP_TO_CARTESIAN'}),
    polygonDraw_snapmode = jML.atom.tag('SELECT', [polygonDraw_snapmode_default, polygonDraw_snapmode_polar, polygonDraw_snapmode_cartesian]),
    polygonDraw_mode = utils.select(data.ps.getPolygonDrawMode(), {
        'Default': 'POLYGON_DRAW_DYNAMIC',
        'Fixed': 'POLYGON_DRAW_STATIC'
    }),
    polygonDraw_props = sim.jML.molecule.tools_props({
        'title': "Polygon draw properties",
        'props': {
            'Mode:': polygonDraw_mode,
            'Snap:': polygonDraw_snapmode
        }
    });
    polygonDraw_snapmode.addEventListener('change', function(event){
        data.ps.setSnapMode(PhysicsSimulator[polygonDraw_snapmode.value]);
    });
    polygonDraw_mode.addEventListener('change', function(event){
        data.ps.setPolygonDrawMode(PhysicsSimulator[polygonDraw_mode.value]);
    });

    return polygonDraw_props;

};

sim.jML.molecule.gear_props = function(data){

    var gear_size = jML.atom.single('INPUT', {'type': 'number', 'value': data.ps.getGearSize()}),
    gear_res = jML.atom.single('INPUT', {'type': 'number', 'value': data.ps.getGearResolution(), 'min': 2, 'max': 100}),
    gear_mode = utils.select(data.ps.getPlacementMode(), {
        'Default': 'DEFAULT_PLACEMENT',
        'Hinged': 'HINGE_TO_POLYGON',
        'Fixed': 'FIX_TO_BACKGROUND'
    }),
    gear_props = sim.jML.molecule.tools_props({
        'title': "Disc properties",
        'props': {
            'Size:': gear_size,
            'Resolution:': gear_res,
            'Mode:': gear_mode
        }
    });
    gear_size.addEventListener('change', function(event){
        data.ps.setGearSize(parseFloat(gear_size.value));
    });
    gear_res.addEventListener('change', function(event){
        data.ps.setGearResolution(parseInt(gear_res.value));
    });
    gear_mode.addEventListener('change', function(event){
        data.ps.setGearPlacementMode(PhysicsSimulator[gear_mode.value]);
    });

    return gear_props;

};

sim.jML.molecule.disc_props = function(data){

    var disc_size = jML.atom.single('INPUT', {'type': 'number', 'value': data.ps.getDiscSize()}),
    disc_res = jML.atom.single('INPUT', {'type': 'number', 'value': data.ps.getDiscResolution(), 'min': 3, 'max': 200}),
    disc_mode = utils.select(data.ps.getPlacementMode(), {
        'Default': 'DEFAULT_PLACEMENT',
        'Hinged': 'HINGE_TO_POLYGON',
        'Fixed': 'FIX_TO_BACKGROUND'
    }),
    disc_props = sim.jML.molecule.tools_props({
        'title': "Disc properties",
        'props': {
            'Size:': disc_size,
            'Resolution:': disc_res,
            'Mode': disc_mode
        }
    });
    disc_size.addEventListener('change', function(event){
        data.ps.setDiscSize(parseFloat(disc_size.value));
    });
    disc_res.addEventListener('change', function(event){
        data.ps.setDiscResolution(parseInt(disc_res.value));
    });
    disc_mode.addEventListener('change', function(event){
        data.ps.setGearPlacementMode(PhysicsSimulator[disc_mode.value]);
    });

    return disc_props;

};

sim.jML.molecule.square_props = function(data){

    var square_size = jML.atom.single('INPUT', {'type': 'number', 'value': data.ps.getSquareSize()}),
    square_mode = utils.select(data.ps.getPlacementMode(), {
        'Default': 'DEFAULT_PLACEMENT',
        'Hinged': 'HINGE_TO_POLYGON',
        'Fixed': 'FIX_TO_BACKGROUND'
    }),
    square_props = sim.jML.molecule.tools_props({
        'title': "Square properties",
        'props': {
            'Size:': square_size,
            'Mode': square_mode
        }
    });
    square_size.addEventListener('change', function(event){
        data.ps.setSquareSize(parseFloat(square_size.value));
    });
    square_mode.addEventListener('change', function(event){
        data.ps.setGearPlacementMode(PhysicsSimulator[square_mode.value]);
    });

    return square_props;

};

// Tools
sim.jML.molecule.hinges_props = function(data){

    var hinges_fixed = jML.atom.single('INPUT', {'type': 'checkbox'}),
    hinges_props = sim.jML.molecule.tools_props({
        'title': "Hinges properties",
        'props': {
            'Fixed:': hinges_fixed
        }
    });
    hinges_fixed.addEventListener('change', function(event){
        if (hinges_fixed.checked){
            data.ps.setMode(PhysicsSimulator.FIXED_CONSTRAINT);
        }else{
            data.ps.setMode(PhysicsSimulator.HINGES);
        };
    });

    return hinges_props;

};

// Scene
sim.jML.molecule.saveLoad_props = function(data){

    var modal,
    h2 = jML.atom.tag('H2', "Save / Load scene"),
    nameLabel = jML.atom.tag('LABEL', "Name:"),
    name = jML.atom.single('INPUT', {'type': 'text', 'name': 'name'}),
    nameContainer = jML.atom.tag('DIV', [nameLabel, name], {'class': 'ffix'}),
    save = jML.atom.tag('BUTTON', "Save", {'type': 'button'}),
    load = jML.atom.tag('BUTTON', "Load", {'type': 'button'}),
    saveLoadContainer = jML.atom.tag('DIV', [save, load], {'class': 'ffix'}),
    scene = jML.atom.single('INPUT', {'type': 'hidden', 'name': 'scene'}),
    thumb = jML.atom.single('INPUT', {'type': 'hidden', 'name': 'thumb'}),
    form = jML.atom.tag('FORM', [h2,nameContainer, saveLoadContainer, scene, thumb], {'action': '/save_scene'});
    
    load.addEventListener('click', function(){
        var scenes = sim.jML.structure.load_scene({'ps': data.ps});
        modal = utils.modal("Load scene", scenes);
    });
    save.addEventListener('click', function(){
        var nameCheck = (name.value.length > 0);
        if (nameCheck){
            scene.value = data.ps.save();
            thumb.value = data.ps.getScreenshot();
            Request.form(form, '/sim/form?action=save_scene', saveCallback);
        };
    });
    function saveCallback(response){

        utils.required({
                'name': name
            }, response.formFailed);

        if (response.success){

            console.log("save done!")

        }else{

            console.log("save failed")
        };
    };

    return form;

};

sim.jML.molecule.pause_props = function(data){

    var pausePlay = jML.atom.single('INPUT', {'type': 'checkbox'}),
    pause_props = sim.jML.molecule.tools_props({
        'title': "Pause / play",
        'props': {
            'Pause:': pausePlay
        }
    });
    pausePlay.addEventListener('change', function(event){
        data.ps.setPausePhysics(!data.ps.getPausePhysics());
    });

    pausePlay.checked = data.ps.getPausePhysics();

    return pause_props;

};

sim.jML.molecule.freeze_props = function(data){

    var freezeUnfreeze = jML.atom.single('INPUT', {'type': 'checkbox'}),
    freeze_props = sim.jML.molecule.tools_props({
        'title': "Freeze / unfreeze",
        'props': {
            'Freeze:': freezeUnfreeze
        }
    });
    freezeUnfreeze.addEventListener('change', function(event){
        data.ps.setPause(!data.ps.getPause());
    });

    freezeUnfreeze.checked = data.ps.getPause();

    return freeze_props;

};

// Lists /////////////////
sim.jML.molecule.load_list_element = function(data){

    var img = jML.atom.single('IMG', {'src': data.thumb}),
    name = jML.atom.tag('DIV', data.name, {'class': 'name'}),
    date = jML.atom.tag('DIV', data.timestamp, {'class': 'date'}),
    nameDate = jML.atom.tag('DIV', [name, date]),
    button = jML.atom.tag('BUTTON', "Load"),
    caption = jML.atom.tag('FIGCAPTION', [button, nameDate], {'class': 'ffix'}),
    figure = jML.atom.tag('FIGURE', [img, caption]),
    callback = function(response){

        if (response.success){

            data.ps.load(response.data.body)

        }else{

            console.log(response);

        };

    };
    button.addEventListener('click', function(){

        Request.get('/sim/get?action=scene_body&sceneid='+data.sceneid, callback);

    });

    return figure;

};

sim.jML.molecule.add_list_element = function(data){

    var img = jML.atom.single('IMG', {'src': data.thumb}),
    name = jML.atom.tag('DIV', data.name, {'class': 'name'}),
    date = jML.atom.tag('DIV', data.timestamp, {'class': 'date'}),
    nameDate = jML.atom.tag('DIV', [name, date]),
    button = jML.atom.tag('BUTTON', "Add"),
    caption = jML.atom.tag('FIGCAPTION', [button, nameDate], {'class': 'ffix'}),
    figure = jML.atom.tag('FIGURE', [img, caption]);

    button.addEventListener('click', function(){

        if (data.sceneList.indexOf(data.sceneid) == -1){

            var scene = sim.jML.molecule.remove_list_element(data);

            utils.append(data.scenes, scene);
            data.sceneList.push(data.sceneid);
        };

    });

    return figure;

};

sim.jML.molecule.remove_list_element = function(data){

    var sceneid = jML.atom.single('INPUT', {
        'type': 'hidden',
        'name': 'scenes',
        'value': data.sceneid
    }),
    img = jML.atom.single('IMG', {'src': data.thumb}),
    name = jML.atom.tag('DIV', data.name, {'class': 'name'}),
    date = jML.atom.tag('DIV', data.timestamp, {'class': 'date'}),
    nameDate = jML.atom.tag('DIV', [name, date]),
    button = jML.atom.tag('BUTTON', "Remove"),
    caption = jML.atom.tag('FIGCAPTION', [button, nameDate], {'class': 'ffix'}),
    figure = jML.atom.tag('FIGURE', [img, caption, sceneid]);

    button.addEventListener('click', function(){

        utils.remove(figure);
        var index = data.sceneList.indexOf(data.sceneid);
        if ( index != -1) data.sceneList.splice(index, 1);

    });

    return figure;

};

sim.jML.molecule.open_list_element = function(data){

    var img = jML.atom.single('IMG', {'src': data.thumb}),
    name = jML.atom.tag('DIV', data.name, {'class': 'name'}),
    date = jML.atom.tag('DIV', data.timestamp, {'class': 'date'}),
    nameDate = jML.atom.tag('DIV', [name, date]),
    button = jML.atom.tag('BUTTON', "Open"),
    caption = jML.atom.tag('FIGCAPTION', [button, nameDate], {'class': 'ffix'}),
    figure = jML.atom.tag('FIGURE', [img, caption]);

    button.addEventListener('click', function(){

        router.router().navigate('/scene/'+data.sceneid);

    });

    return figure;

};


/* STRUCTURES
-----------------------------------------------------------------------------*/

sim.jML.structure.public_panel = function(data){

    var canvas = sim.jML.atom.canvas(),
    panel_open = jML.atom.tag('BUTTON', ""),
    tools_panel = jML.atom.tag('DIV', "", {'class': 'tools_panel'}),
    props_panel = jML.atom.tag('DIV', "", {'class': 'props_panel'}),
    tools_menu = sim.jML.molecule.tools_menu({
        'canvas': canvas,
        'panel': tools_panel,
        'props': props_panel
    }),
    tools = jML.atom.tag('DIV', [tools_menu, tools_panel, props_panel, panel_open], {'class': 'tools open'}),
    panel = gui.jML.molecule.ghostbox({
        'box': {
            'attributes': {'class': 'panel ffix'},
            'content': [canvas, tools]
        },
        'ghost': {}
    });

    panel_open.addEventListener('click', function(){
        tools.classList.toggle('open');
    });

    return panel;

};

sim.jML.structure.load_scene = function(data){
    
    var h2 = jML.atom.tag('H2', "Load scene"),
    load_scene = jML.atom.tag('DIV', [h2], {'class': 'scene_list'}),
    callback = function(response){

        if (response.success){

            for (var i = 0; i < response.data.length; i++) {

                response.data[i].ps = data.ps;
                temp = sim.jML.molecule.load_list_element(response.data[i]);
                utils.append(load_scene, temp);

            };

        }else{

            console.log(response);

        };

    };
    Request.get('/sim/get?action=my_scenes', callback);

    return load_scene;

};

sim.jML.structure.add_scene = function(data){
    
    var h2 = jML.atom.tag('H2', "Add scene"),
    add_scene = jML.atom.tag('DIV', [h2], {'class': 'scene_list'}),
    callback = function(response){

        if (response.success){

            for (var i = 0; i < response.data.length; i++) {

                response.data[i].sceneList = data.sceneList;
                response.data[i].scenes = data.scenes;
                temp = sim.jML.molecule.add_list_element(response.data[i]);
                utils.append(add_scene, temp);

            };

        }else{

            console.log(response);

        };

    };
    Request.get('/sim/get?action=my_scenes', callback);

    return add_scene;

};

sim.jML.structure.my_scenes = function(data){

    var scenes = jML.atom.tag('DIV', "", {'class': 'scene_list ffix'}),
    title = jML.atom.tag('SPAN',"My scenes"),
    h2 = jML.atom.tag('H2', [title], {'id': 'pagetitle'}),
    my_scenes = gui.jML.molecule.ghostbox({
        'box': {
            'attributes': {},
            'content': [h2, scenes]
        },
        'ghost': {}
    }),
    callback = function(response){

        if (response.success){

            for (var i = 0; i < response.data.length; i++) {

                temp = sim.jML.molecule.open_list_element(response.data[i]);
                utils.append(scenes, temp);

            };

        }else{

            console.log(response);

        };

    };
    Request.get('/sim/get?action=my_scenes', callback);

    return my_scenes;

};

sim.jML.structure.open_scene = function(data){

    var canvas = sim.jML.atom.canvas(),
    panel_open = jML.atom.tag('BUTTON', ""),
    tools_panel = jML.atom.tag('DIV', "", {'class': 'tools_panel'}),
    props_panel = jML.atom.tag('DIV', "", {'class': 'props_panel'}),
    tools_menu = sim.jML.molecule.tools_menu({
        'canvas': canvas,
        'panel': tools_panel,
        'props': props_panel
    }),
    tools = jML.atom.tag('DIV', [tools_menu, tools_panel, props_panel, panel_open], {'class': 'tools open'}),
    panel = gui.jML.molecule.ghostbox({
        'box': {
            'attributes': {'class': 'panel ffix'},
            'content': [canvas, tools]
        },
        'ghost': {}
    });

    panel_open.addEventListener('click', function(){
        tools.classList.toggle('open');
    });

    callback = function(response){

        if (response.success){

            console.log("loading!")
            canvas.physicsSimulator.load(response.data.body);

        }else{

            console.log(response);

        };

    };
    Request.get('/sim/get?action=scene_body&sceneid='+data.sceneid, callback);

    return panel;

};


/* PAGES
-----------------------------------------------------------------------------*/

sim.jML.page.scenes = function(data){

    var my_scenes = sim.jML.structure.my_scenes(),
    main = jML.atom.tag('MAIN', [my_scenes], {'id': 'main', 'class': 'page scenes'});

    return main;

};

sim.jML.page.scene = function(data){

    var scene = sim.jML.structure.open_scene(data),
    page = jML.atom.tag('DIV', [scene], {'class': 'page'}),
    main = jML.atom.tag('MAIN', [page], {'id': 'main'});

    return main;

};



 // Init callback!
//////////////////////////////////////////////////////////////////////////////
sim.model.set('assets.jML', true);