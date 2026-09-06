var menus = (function(){

    function menuitems(items, evalFunction){

        var ul = jML.atom.tag('UL',""),
        temp = [];

        for (var i = 0, len = items.length; i < len; i++){

            var button = jML.atom.tag('BUTTON', items[i].title);

            (function(action, button){
                button.addEventListener('click', function(){

                    eval(evalFunction);

                });
            })(items[i].action, button);

            if (items[i].icon){
                var icon = jML.atom.tag('IMG', "", {'src': items[i].icon}),
                li = jML.atom.tag('LI', [icon, button]);
            }else{
                var li = jML.atom.tag('LI', [button]);
            };

            

            (function(button, li){
                li.addEventListener('click', function(event){

                    if (event.target == button){
                        if (!li.classList.contains('selected')){
                            li.classList.add('selected');
                        };
                    };
    
                });
            })(button, li);

            if (items[i].children.length){
                var children = menus.menuitems(items[i].children, evalFunction);
                li.appendChild(children);
            }

            //ul.appendChild(li);

            temp[items[i].index] = li;

        };

        for (var i = 0; i < temp.length; i++) {
            ul.appendChild(temp[i]);
        };

        ul.addEventListener('click', function(event){

            var elements = ul.getElementsByClassName('selected');
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('selected');
            };

        }, true);

        return ul;

    };


    return {
        menuitems: function(items, evalFunction){
            return menuitems(items, evalFunction);
        }
    };

})();