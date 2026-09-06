/*
    Module: Sim
    Description: Simulator related stuffs.

*/

var sim = (function(){
    var name = 'sim',
    model = new Model({
        'init': false,
        'assets': {
			'jML': false,
			'camera': false,
			'debug_render': false,
			'element_buffer': false,
			'mesh_handler': false,
			'mesh': false,
			'render_context': false,
			'shader_program': false,
			'texture': false,
			'vertex_buffer': false,
			'collision_box_handeler': false,
			'collision_box': false,
			'injected_collision_box': false,
			'polygon': false,
			'vertex': false,
			'phx': false,
			'keyboard_control': false,
			'mouse_control': false,
			'user_interface_handler': false,
			'linked_list': false,
			'tool': false,
			'matrix_3d': false,
			'queue': false,
			'vector': false,
			'animator': false,
			'animated_object': false,
			'physics_simulator': false,
			'shapes': false,
			'collision_group': false,
			'contact_point': false,
			'random_seed': false,
			'fixed_constraint': false,
			'animated_fixed_constraint': false,
			'hinge_constraint': false,
			'animated_hinge_constraint': false,
			'rope': false,
			'animated_rope': false,
			'pulley': false,
			'animated_pulley': false,
			'fracture': false,
		}
    }),
    assets = {
        'js': [
            {
                'id': 'jML',
                'src': '/sim_static/jML.js'
			},
			{
				'id': 'camera',
				'src': '/sim_static/graphics/graphics_engine/camera.js',
			},
			{
				'id': 'debug_render',
				'src': '/sim_static/graphics/graphics_engine/debug_render.js',
			},
			{
				'id': 'element_buffer',
				'src': '/sim_static/graphics/graphics_engine/element_buffer.js',
			},
			{
				'id': 'mesh_handler',
				'src': '/sim_static/graphics/graphics_engine/mesh_handler.js',
			},
			{
				'id': 'mesh',
				'src': '/sim_static/graphics/graphics_engine/mesh.js',
			},
			{
				'id': 'render_context',
				'src': '/sim_static/graphics/graphics_engine/render_context.js',
			},
			{
				'id': 'shader_program',
				'src': '/sim_static/graphics/graphics_engine/shader_program.js',
			},
			{
				'id': 'texture',
				'src': '/sim_static/graphics/graphics_engine/texture.js',
			},
			{
				'id': 'vertex_buffer',
				'src': '/sim_static/graphics/graphics_engine/vertex_buffer.js',
			},
			{
				'id': 'collision_box_handeler',
				'src': '/sim_static/physics_engine/collision_box_handeler/collision_box_handeler.js',
			},
			{
				'id': 'collision_box',
				'src': '/sim_static/physics_engine/collision_box_handeler/collision_box.js',
			},
			{
				'id': 'injected_collision_box',
				'src': '/sim_static/physics_engine/collision_box_handeler/injected_collision_box.js',
			},
			{
				'id': 'polygon',
				'src': '/sim_static/physics_engine/polygon/polygon.js',
			},
			{
				'id': 'vertex',
				'src': '/sim_static/physics_engine/polygon/vertex.js',
			},
			{
				'id': 'phx',
				'src': '/sim_static/physics_engine/phx.js',
			},
			{
				'id': 'keyboard_control',
				'src': '/sim_static/user_interface/keyboard_control.js',
			},
			{
				'id': 'mouse_control',
				'src': '/sim_static/user_interface/mouse_control.js',
			},
			{
				'id': 'user_interface_handler',
				'src': '/sim_static/user_interface/user_interface_handler.js',
			},
			{
				'id': 'linked_list',
				'src': '/sim_static/utilities/linked_list.js',
			},
			{
				'id': 'tool',
				'src': '/sim_static/utilities/tool.js',
			},
			{
				'id': 'matrix_3d',
				'src': '/sim_static/utilities/matrix_3d.js',
			},
			{
				'id': 'queue',
				'src': '/sim_static/utilities/queue.js',
			},
			{
				'id': 'vector',
				'src': '/sim_static/utilities/vector.js',
			},
			{
				'id': 'animator',
				'src': '/sim_static/animator.js',
			},
			{
				'id': 'animated_object',
				'src': '/sim_static/animated_elements/animated_object.js',
			},
			{
				'id': 'physics_simulator',
				'src': '/sim_static/physics_simulator.js',
			},
			{
				'id': 'shapes',
				'src': '/sim_static/shapes.js',
			},
			{
				'id': 'collision_group',
				'src': '/sim_static/physics_engine/collision_group.js',
			},
			{
				'id': 'contact_point',
				'src': '/sim_static/physics_engine/contact_point.js',
			},
			{
				'id': 'random_seed',
				'src': '/sim_static/utilities/random_seed.js',
			},
			{
				'id': 'fixed_constraint',
				'src': '/sim_static/physics_engine/fixed_constraint.js',
			},
			{
				'id': 'animated_fixed_constraint',
				'src': '/sim_static/animated_elements/animated_fixed_constraint.js',
			},
			{
				'id': 'hinge_constraint',
				'src': '/sim_static/physics_engine/hinge_constraint.js',
			},
			{
				'id': 'animated_hinge_constraint',
				'src': '/sim_static/animated_elements/animated_hinge_constraint.js',
			},
			{
				'id': 'rope',
				'src': '/sim_static/physics_engine/rope.js',
			},
			{
				'id': 'animated_rope',
				'src': '/sim_static/animated_elements/animated_rope.js',
			},
			{
				'id': 'pulley',
				'src': '/sim_static/physics_engine/pulley.js',
			},
			{
				'id': 'animated_pulley',
				'src': '/sim_static/animated_elements/animated_pulley.js',
			},
			{
				'id': 'fracture',
				'src': '/sim_static/physics_engine/polygon/fracture.js',
			},
        ]
    },
    menuitems = [{
        'title': 'Scenes',
        'index': 1,
        'action': 'scenes',
        'children': []
    }],
    eventElement = jML.atom.tag('DIV', "");

    // Do stuff before initialization here.


    return {
        assets:  assets,
        model:  model,
        name: name,
        element: eventElement,
        menuitems: menuitems
    };

})();


 // Load in assets defined for this module!
//////////////////////////////////////////////////////////////////////////////
Assets.load(sim, function(){

	// Do stuff after assets loaded pre-initialization here.

    var getmenu = app.model.get('mainmenu');
    for (var i=0; i<sim.menuitems.length; i++){
        getmenu.push(sim.menuitems[i]); 
    };
    app.model.set('assets.sim', true);
    console.log("Sim initialized!");

    // Do stuff after initialization here.
   
});