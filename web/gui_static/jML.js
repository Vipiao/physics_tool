/* NAMESPACES
-----------------------------------------------------------------------------*/
gui.jML = function(){};
gui.jML.molecule = function(){};
gui.jML.structure = function(){};
gui.jML.page = function(){};
gui.jML.super = function(){};


/* MOLECULES
-----------------------------------------------------------------------------*/
gui.jML.molecule.ghostbox = function(data){
    var defaults = {
        'box': {
            'class': 'box'
        },
        'ghost': {
            'class': 'ghost'
        }
    };

    var box = jML.atom.tag('DIV', data.box.content, utils.mergeAttributes(defaults.box, data.box.attributes)),
    ghost = jML.atom.tag('DIV', [box], utils.mergeAttributes(defaults.ghost, data.ghost.attributes));

    return ghost;
};

gui.jML.molecule.logo = function(data){

    var h1 = jML.atom.tag('H1','FySim'),
    logo = gui.jML.molecule.ghostbox({
        'box': {
            'attributes': {},
            'content': [h1]
        },
        'ghost': {
            'attributes': {
                'id': 'logo'
            }
        }
    });

    logo.addEventListener('click', function(){
        router.router().navigate();
    });

    return logo;

};

gui.jML.molecule.mainmenu = function(data){
    var getMenu = function(){
        return menus.menuitems( app.model.get('mainmenu'), `
            router.router().navigate('/'+action);
        `);
    },
    unread_messages = msg.jML.molecule.unread_messages(),
    menubutton = jML.atom.tag('BUTTON', [unread_messages]),
    mainmenu = jML.atom.tag('NAV', [getMenu(), menubutton], {
        'id': 'mainmenu'
    });

    app.model.register('mainmenu', mainmenu);
    mainmenu.addEventListener('mainmenu', function(event){

        utils.fill(mainmenu, getMenu());

    });
    
    var setTop = function(){
        var value = mainmenu.clientHeight + 5;
        mainmenu.style.marginBottom = -value + 'px';
    };

    menubutton.addEventListener('click', function(){

        if (mainmenu.classList.contains('open')){

            mainmenu.classList.remove('open');
            mainmenu.removeAttribute('style');

        }else{

            mainmenu.classList.add('open');         
            setTop();

        };
        
    });

    window.addEventListener('resize', function(){
        if (mainmenu.classList.contains('open')){
            setTop();
        };
    });

    return mainmenu;

};

gui.jML.molecule.search = function(data){
    var defaults = {
        'searchfield': {
            'type': 'text',
            'name': 'searchfield',
            'placeholder': 'Search here'
        }
    };

    var searchfield = jML.atom.single('INPUT', utils.mergeAttributes(defaults.searchfield, data.searchfield.attributes)),
    search_label = jML.atom.tag('LABEL', "Search:"),
    fieldset = jML.atom.tag('FIELDSET', [search_label, searchfield]),
    form = jML.atom.tag('FORM', [fieldset], {'action': '/search'});

    searchfield.addEventListener('keyup', function(){
        //var checkSearchfield = (searchfield.value.length > 0);
        //if (checkSearchfield)
        Request.form(form, data.action, data.callback);
    });

    return form;
};

gui.jML.molecule.list = function(data){

    var list = jML.atom.tag('UL', "", {'class': 'table'}),
    header = jML.atom.tag('LI', "", {'class': 'row tableheader'});

    for (var i=0; i<data.header.length; i++){

        var title = jML.atom.tag('DIV', data.header[i].title, {'class': 'cell'});
        header.appendChild(title);

    };

    list.appendChild(header);

    var unique = utils.unique();

    for (var i=0; i<data.list.length; i++){

        var checkbox = jML.atom.single('INPUT', {'type': 'checkbox', 'id': unique+'_row_'+i}),
        label = jML.atom.tag('LABEL', "", {'for': unique+'_row_'+i}),
        row = jML.atom.tag('LI', [checkbox, label], {'class': 'row'});

        for (var k=0; k<data.list[i].length; k++){

            var listItem = jML.atom.tag('DIV', data.list[i][k], {
                'data-label': data.header[k].title,
                'class': 'cell '+data.header[k].class
            });
            row.appendChild(listItem);

        };

        list.appendChild(row);

    };

    return list;

};


/* STRUCTURES
-----------------------------------------------------------------------------*/
gui.jML.structure.header = function(data){

    var logo = gui.jML.molecule.logo(),
    user = usr.jML.molecule.login(),
    page = jML.atom.tag('DIV', [logo, user], {'class': 'page ffix'}),
    header = jML.atom.tag('HEADER', [page]);

    return header;

};

gui.jML.structure.header_loggedin = function(data){

    var menu = gui.jML.molecule.mainmenu(),
    logo = gui.jML.molecule.logo(),
    user = usr.jML.molecule.loggedin(),
    page = jML.atom.tag('DIV', [menu, logo, user], {'class': 'page ffix'}),
    header = jML.atom.tag('HEADER', [page]);

    return header;

};

gui.jML.structure.footer = function(data){

    var copyright = jML.atom.tag('DIV', '&copy; 2018 FySim'),
    ghostbox = gui.jML.molecule.ghostbox({
        'box': {
            'attributes': {
                'class': 'ffix'
            },
            'content': [copyright]
        },
        'ghost': {
            'attributes': {
                'class': 'copyright'
            }
        }
    }),
    page = jML.atom.tag('DIV', [ghostbox], {'class': 'page'}),
    dock = jML.atom.tag('DIV', "", {'id': 'dock', 'class': 'page'}),
    footer = jML.atom.tag('FOOTER', [dock, page], {'id': 'footer'});

    return footer;

};


/* PAGES
-----------------------------------------------------------------------------*/
gui.jML.page.front = function(data){

    var panel = sim.jML.structure.public_panel(),
    page = jML.atom.tag('DIV', [panel], {'class': 'page'}),
    main = jML.atom.tag('MAIN', [page], {'id': 'main'});

    return main;

};


/* SUPERPAGES
-----------------------------------------------------------------------------*/
gui.jML.super.default = function(data){

    var header = getHeader(),
    footer = gui.jML.structure.footer(),
    main = jML.atom.tag('MAIN', "Loading...", {'id': 'main'}),
    body = jML.atom.tag('BODY', [header, main, footer], {'id': 'body'});
    
    function getHeader(){

        if (usr.model.get('login.loggedin')){
            return gui.jML.structure.header_loggedin();
        }else{
            return gui.jML.structure.header();
        };

    };
    usr.model.register('login.loggedin', body);
    body.addEventListener('login.loggedin', function(event){

        var newHeader = getHeader();
        utils.replace(header, newHeader);
        header = newHeader;

    });

    body.onload = function(event){

        console.log("page loaded!");

    };

    return body;

};


 // Init callback!
//////////////////////////////////////////////////////////////////////////////
gui.model.set('assets.gui_jML', true);