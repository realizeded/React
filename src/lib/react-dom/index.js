import {TAG_ROOT} from '../react/constant'
import scheduler from './schedule'
function render(element,dom) {
    let rootFiber = {
        tag:TAG_ROOT,
        stateNode:dom,
        props:{
            children:[element]
        }
    }
    scheduler(rootFiber);
}
const ReactDOM = {
    render
}
export default ReactDOM;
