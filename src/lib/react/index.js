import {ELEMENT_TEXT} from './constant';
import {Update,UpdateQueue} from './UpdateQueue'
import scheduler,{useReducer,useState} from '../react-dom/schedule'
//创建虚拟DOM
function createElement(type,props,...children) {
    delete props.__self;
    delete props.__source;
    return {
        type,
        props:{
            ...props,
            children:children.map(ele=>{
                return typeof ele === 'object'?ele:{
                    type:ELEMENT_TEXT,
                    props:{
                        text:ele
                    }
                }
            })
        }
    }
}
class Component {
    constructor(props) {
        this.props = props;
    }
    setState(payload) {
        this.interFiber.updateQueue.enQueue(new Update(payload));
        scheduler();
    }
}
Component.prototype.isReactComponent = {};
const React = {
    createElement,
    Component,
    useState,
    useReducer
}
export {
    createElement,
    Component,
    useState,
    useReducer
}
export default React;
