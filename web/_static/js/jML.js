var jML = function(){};
jML.atom = function(){};

jML.atom.tag = function(tag, content, attributes){

    var element = document.createElement(tag);
    
    if (typeof content === 'string' || typeof content === 'number'){
        element.innerHTML = content;
    }else if (content instanceof Array){
        for (i=0;i<content.length;i++){
            element.appendChild(content[i]);
        } 
    };
    
    for(a in attributes){
        if (typeof attributes[a] !== 'undefined'){
            element.setAttribute(a, attributes[a]);
        };
    };

    return element;
};

jML.atom.single = function(tag, attributes){

    element = document.createElement(tag);

    for(a in attributes){
        if (typeof attributes[a] !== 'undefined'){
            element.setAttribute(a, attributes[a]);
        };
    };

    return element;

};

/*
jML.molecule = function(){};
jML.structure = function(){};
jML.page = function(){};
jML.super = function(){};
*/