function setProps(dom,oldProps,newProps) {
    for(let key in oldProps) {
       if(key!=='children') {
        if(newProps.hasOwnProperty(key)) {
            setProp(dom,key,newProps[key])
         } else {
             removeProp(dom,key)
         }
       }
    }
    for(let key in newProps) {
        if(key!=='children') {
            if(!oldProps.hasOwnProperty(key)) {
                setProp(dom,key,newProps[key])
            } 
        }
    }
}
function removeProp(dom,key) {
    if(/^on/.test(key)) {
        dom[key.toLowerCase()] = null;
    } else if(/^style/.test(key)) {
        dom['style'][key] = '';
    } else {
        dom.removeAttribute(key);
    }
} 
function setProp(dom,key,val) {
    if(/^on/.test(key)) {
        dom[key.toLowerCase()] = val;
    } else if(/^style/.test(key)) {
        for(let key in val) {
            dom.style[key] = val[key];
        }
    } else {
        dom.setAttribute(key,val);
    }
}
export {
    setProps
}