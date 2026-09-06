var utils = (function(){

    function required(fields, failed){

        for (var field in fields){
            fields[field].classList.remove("reqFill");
        };

        for (var i=0, len=failed.length;i<len;i++){
            fields[failed[i]].classList.add("reqFill");
        };

    };

    function checkEmail(email){
        return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(email);
    };

    function append(target, element){
        element.addEventListener('loaded', function(event){
            if (this.loaded) this.loaded(event);
        });
        target.appendChild(element);
        element.dispatchEvent(events.loaded());
    };

    function prepend(target, element){
        element.addEventListener('loaded', function(event){
            if (this.loaded) this.loaded(event);
        });
        target.insertBefore(element, target.firstChild);
        element.dispatchEvent(events.loaded());
    };

    function fill(target, element){
        
        target.innerHTML = "";
        if (element instanceof Array){

            for (var i = 0, len = element.length; i<len; i++){

                element[i].addEventListener('loaded', function(event){
                    if (this.loaded) this.loaded(event);
                });
                target.appendChild(element[i]);
                element[i].dispatchEvent(events.loaded());

            };

        }else{

            element.addEventListener('loaded', function(event){
                if (this.loaded) this.loaded(event);
            });
            target.appendChild(element);
            element.dispatchEvent(events.loaded());

        };
        
    };

    function replace(target, element){
        element.addEventListener('loaded', function(event){
            if (this.loaded) this.loaded(event);
        });
        target.parentNode.replaceChild(element, target);
        element.dispatchEvent(events.loaded());
    };

    function remove(target){
        target.parentNode.removeChild(target);
    };

    function mergeAttributes(defaults, custom){
        var merged = {};
        
        for(var a in defaults){
            merged[a] = defaults[a];
        };
    
        if (typeof custom !== 'undefined'){ 
            for(var a in custom){
                if ( !(merged.hasOwnProperty(a)) ){
                    merged[a] = 1;
                };
            };     
            for(var a in merged){
                if (custom.hasOwnProperty(a)){       
                    if (a == 'class'){
                        merged[a] = defaults[a] + ' ' + custom[a];
                    }else{
                        merged[a] = custom[a];
                    };       
                };
            };            
        };
        
        return merged;
    };

    function allTrue(obj){  

        for (var index in obj){      
            if (!obj[index]){
                return false;
            };
        };

        return true;
    }

    function unique(){
        return (new Date()).getTime() + "_" + Math.floor(Math.random() * Math.floor(10000));
    }

    function move(element, target){

        element.addEventListener('mousedown', function(event){

            var initX = event.pageX,
            initY = event.pageY;

            var pos = target.getBoundingClientRect(),
            top = pos.top,
            left = pos.left;

            target.style.left = left + "px";
            target.style.top = top + "px";
            
            var mousemove = function(event){

                var deltaX = event.pageX - initX,
                deltaY = event.pageY - initY;

                /*var pos = target.getBoundingClientRect(),
                top = pos.top,
                left = pos.left;*/
    
                var newX = parseFloat(target.style.left) + deltaX,
                newY = parseFloat(target.style.top) + deltaY;

                target.style.left = newX + "px";
                target.style.top = newY + "px";
    
                initX += deltaX;
                initY += deltaY;
    
            };
            document.addEventListener('mousemove', mousemove);
            element.addEventListener('mouseup', function(){
                document.removeEventListener('mousemove', mousemove);
            });
    
        });

    };

    function fly(element, targetTop, targetLeft){

        var interval = setInterval(fly, 5);

        function fly(){

            var left = parseFloat(element.style.left),
            top = parseFloat(element.style.top);

            if ( Math.pow((left - targetLeft), 2) < 100  && Math.pow((top - targetTop), 2) < 100 ){
                clearInterval(interval);
            }else{

                var newLeft = (left - targetLeft > 0) ? -5 : 5,
                newTop = (top - targetTop > 0) ? -5 : 5;

                element.style.left = left + newLeft + 'px';
                element.style.top = top + newTop + 'px';

            };
        };
    };

    function modal(label, element){

        var close = jML.atom.tag('BUTTON', "", {'class': 'close'}),
        min = jML.atom.tag('BUTTON', "", {'class': 'min'}),
        max = jML.atom.tag('BUTTON', "", {'class': 'max'}),
        bar = jML.atom.tag('DIV', [max, min, close], {'class': 'bar'}),
        content = jML.atom.tag('DIV', [element], {'class': 'content'}),
        modal = jML.atom.tag('DIV', [bar, content], {'class': 'window'}),
        dock = document.getElementById('dock'),
        main = document.getElementById('main'),
        dockbutton = jML.atom.tag('BUTTON', label);

        modal.max = function(event){
            
            var width = main.offsetWidth,
            height = main.offsetHeight,
            pos = main.getBoundingClientRect(),
            top = pos.top,
            left = pos.left;
    
            modal.style.width = width + "px";
            modal.style.height = height + "px";
            content.style.height = height - bar.offsetHeight - 6 + "px";
            modal.style.top = top + "px";
            modal.style.left = left + "px";
            modal.style.margin = 0;

        };

        modal.restore = function(event){

            if(!modal.classList.contains('show')){
                modal.classList.add('show');
                utils.fly(modal, dockbutton.restoreTop, dockbutton.restoreLeft);
            };
        };

        modal.min = function(event){

            if(modal.classList.contains('show')) modal.classList.remove('show');

            var pos = modal.getBoundingClientRect();
            dockbutton.restoreTop = pos.top;
            dockbutton.restoreLeft = pos.left;

            var pos = dockbutton.getBoundingClientRect(),
            targetTop = pos.top,
            targetLeft = pos.left;

            utils.fly(modal, targetTop, targetLeft);

        };

        modal.remove = function(event){
            modal.classList.remove('show');
            dockbutton.parentNode.removeChild(dockbutton);
            setTimeout(function(){ modal.parentNode.removeChild(modal) }, 1000);
        };
    
        modal.loaded = function(event){

            // Needed to trigger the CSS transition effects
            var width = this.offsetWidth,
            height = this.offsetHeight;

            var winWidth = document.documentElement.clientWidth,
            winHeight = document.documentElement.clientHeight;
    
            var width = 640,
            height = 480,
            top = parseInt( (winHeight / 2) - (height/2) ),
            left = parseInt( (winWidth / 2) - (width/2) );
    
            this.style.width = width + "px";
            this.style.height = height + "px";
            content.style.height = height - bar.offsetHeight - 6 + "px";
            this.style.top = top + "px";
            this.style.left = left + "px";
            this.classList.add('show');
    
        };

        dockbutton.addEventListener('click', modal.restore);

        close.addEventListener('click', modal.remove);

        min.addEventListener('click', modal.min);

        max.addEventListener('click', modal.max);

        utils.move(bar, modal);
    
        utils.append(dock, modal);

        utils.append(dock, dockbutton);
    
        return modal;
    
    };

    function select(selected, options){

        var optionList = [];

        for (var option in options){

            var attributes = (options[option] == selected) ? {'value': options[option], 'selected': true} : {'value': options[option]};
            optionList.push(       
                jML.atom.tag('OPTION', option, attributes)
            );
        };

        return jML.atom.tag('SELECT', optionList);

    };

    return {
        select: function(selected, options){
            return select(selected, options);
        },
        fly: function(element, targetTop, targetLeft){
            return fly(element, targetTop, targetLeft);
        },
        move: function(element, target){
            return move(element, target);
        },
        modal: function(label, element){
            return modal(label, element);
        },
        unique: function(){
            return unique();
        },
        allTrue: function(obj){
            return allTrue(obj);
        },
        mergeAttributes: function(defaults, custom){
            return mergeAttributes(defaults, custom);
        },
        required: function(fields, failed){
            required(fields, failed);
        },
        checkEmail: function(email){
            return checkEmail(email);
        },
        append: function(target, element){
            append(target, element);
        },
        prepend: function(target, element){
            prepend(target, element);
        },
        fill: function(target, element){
            fill(target, element);
        },
        replace: function(target, element){
            replace(target, element);
        },
        remove: function(target){
            remove(target);
        }
    };

})();