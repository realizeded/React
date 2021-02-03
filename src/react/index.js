import {ELEMENT_TEXT} from './constant';
function createElement(type,config,...children) {
    return {
        type,
        props:{
            ...config,
            children:children.map(item=>{
                return typeof item === 'object'?item:{
                    text:item,
                    type:ELEMENT_TEXT
                };
            })
        }
        
    }
}
const React = {
    createElement
}
export default React;