var gui = (function(){

    var name = 'gui',
    model = new Model({
        'init': false,
        'mainmenu': [
            {
                'title': "Scenes",
                'action': 'scenes'
            },{
                'title': "Messages",
                'action': 'messages'
            },{
                'title': "Forum",
                'action': 'forum'
            },{
                'title': "Groups",
                'action': 'groups'
            }
        ],
        'assets': {
            'gui_jML': false
        }
    }),
    assets = {
        'js': [
            {
                'id': 'gui_jML',
                'src': '/gui_static/jML.js'
            }
        ]
    },
    eventElement = jML.atom.tag('DIV', "", {'class': 'eventElement'});

    /* GUI utilities
    */
    // Modal
    function modal(target, element){

        var modal = jML.atom.tag('DIV', [element], {'class': 'modal'});
    
        var launchEvent = function(event){
            document.removeEventListener('click', launchEvent);
            document.addEventListener('click', removeEvent);
        };
    
        var removeEvent = function(event){
            if (!event.path.includes(modal)){
                modal.remove(event);
            };
        };
    
        document.addEventListener('click', launchEvent);
    
        modal.remove = function(event){
            modal.classList.remove('show');
            document.removeEventListener('click', removeEvent);
            setTimeout(function(){modal.parentNode.removeChild(modal)}, 1000);
        };
    
        modal.loaded = function(event){
    
            var width = this.offsetWidth,
            height = this.offsetHeight,
            marginTop = parseInt(height/2),
            marginLeft = parseInt(width/2);
    
            this.style.width = width + "px";
            this.style.height = height + "px";
            this.style.marginTop = -marginTop + "px";
            this.style.marginLeft = -marginLeft + "px";
            this.style.position = "fixed";
            this.classList.add('show');
    
        };
    
        utils.prepend(target, modal);
    
        return modal;
    
    };

    return {
        modal: function(target, element){
            return modal(target, element);
        },
        assets:  assets,
        model:  model,
        name: name,
        element: eventElement
    };

})();

Assets.load(gui, function(){
    console.log("GUI initialized!");
    app.model.set('assets.gui', true);
});