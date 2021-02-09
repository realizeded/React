import {TAG_COMPONENT_FUNCTION, TAG_COMPONENT_CLASS,TAG_ROOT ,ELEMENT_TEXT, TAG_HOST,TAG_TEXT,DELETION,UPDATION,APPEND} from "../react/constant";
import {setProps} from './util';
import {Update, UpdateQueue} from '../react/UpdateQueue'
let currentFiber = null;
let beforeFiber = null;
let nextUnitWork = null;
let workFiber = null;// 正在工作当中的Fiber
let hooksIndex = 0;//hooks索引
let deletions = [];
function schedule(rootFiber) {
    if(beforeFiber&&beforeFiber.alternate) { //双缓冲机制
        currentFiber = beforeFiber.alternate;
        currentFiber.alternate = beforeFiber;
        if(rootFiber) {
            currentFiber.props = rootFiber.props;
        }
    } else if(beforeFiber) {
        if(rootFiber) {
            rootFiber.alternate = beforeFiber;
            currentFiber = rootFiber; //第一次更新
        } else {
            currentFiber ={
                ...beforeFiber,
                alternate:beforeFiber
            }
        }
    } else {
        currentFiber = rootFiber; //初次渲染
    }
    if(currentFiber.child) {
        currentFiber.child = null;
    }
    currentFiber.firstEffect = currentFiber.lastEffect=currentFiber.nextEffectTag = null;
    nextUnitWork = currentFiber;
    requestIdleCallback(workLoop,{timeout:500});
} 
function performanceUnitOfWork(currentFiber) {
    beginWork(currentFiber);
    if(currentFiber.child) {
        return currentFiber.child;
    }
    while(currentFiber) {
        completeUnitOfWork(currentFiber);
        if(currentFiber.sibling) {
            return currentFiber.sibling;
        }
        currentFiber = currentFiber.return;
    }
}
//副作用收集
function completeUnitOfWork(currentFiber) {
    let tag = currentFiber.effectTag;
    let returnFiber = currentFiber.return;
    if(returnFiber) {
        if(!returnFiber.firstEffect) {
            returnFiber.firstEffect = currentFiber.firstEffect;
        }
        if(currentFiber.lastEffect) {
            if(returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffectTag = currentFiber.firstEffect;
            }
            returnFiber.lastEffect = currentFiber.lastEffect;
        }
        if(tag) {
            if(!returnFiber.lastEffect) {
                returnFiber.firstEffect = currentFiber;
            } else {
                returnFiber.lastEffect.nextEffectTag = currentFiber; 
            }
            returnFiber.lastEffect = currentFiber;
        }
    }
   
}
function beginWork(currentFiber) {
    let tag = currentFiber.tag;
    if(tag===TAG_ROOT) {
        updateRoot(currentFiber);
    } else if(tag===TAG_HOST) {
        updateHost(currentFiber);
    } else if(tag===TAG_TEXT) {
        UpdateText(currentFiber);
    } else if(tag===TAG_COMPONENT_CLASS) {
        UpdateClassComponent(currentFiber);
    } else if(tag === TAG_COMPONENT_FUNCTION) {
        UpdateFunctionComponent(currentFiber);
    }
}
function UpdateFunctionComponent(currentFiber) {
    workFiber = currentFiber;
    workFiber.hooks = [];
    hooksIndex = 0;
    
    let element = currentFiber.type(currentFiber.props);
    reconcile(currentFiber,[element])
}
function UpdateClassComponent(currentFiber) {
    if(!currentFiber.stateNode) {
        currentFiber.stateNode = new currentFiber.type(currentFiber.props);
        currentFiber.stateNode.interFiber = currentFiber;
        currentFiber.updateQueue = new UpdateQueue();
    }
    currentFiber.stateNode.state = currentFiber.updateQueue.forceUpdate(currentFiber.stateNode.state);
    let children = currentFiber.stateNode.render();
    reconcile(currentFiber,[children])
}
function updateDOM(dom,oldProps,newProps) {
    setProps(dom,oldProps,newProps);
}
function createDOM(currentFiber) {
    let tag = currentFiber.tag;
    let ele = null;
    if(tag===TAG_HOST) {
         ele = document.createElement(currentFiber.type);
         //还要设置样式 以及调和 创建子fiber
         updateDOM(ele,{},currentFiber.props);
    } else if(tag===TAG_TEXT) {
        ele = document.createTextNode(currentFiber.props.text); 
    }
    return ele;
}
function updateHost(currentFiber) {
    if(!currentFiber.stateNode) {
        currentFiber.stateNode = createDOM(currentFiber);
    }
    reconcile(currentFiber,currentFiber.props.children);
}
function UpdateText(currentFiber) {
    if(!currentFiber.stateNode) {
        currentFiber.stateNode = createDOM(currentFiber);
    }
}
function updateRoot(currentFiber) {
    reconcile(currentFiber,currentFiber.props.children);
}
function reconcile(currentFiber,children) {
    // debugger
   let size =children.length;
   let oldFiber = currentFiber.alternate&&currentFiber.alternate.child;
   let index = 0;
   let preSibling = null;
   while(index<size||oldFiber) {
    if(oldFiber) {
        oldFiber.firstEffect = oldFiber.lastEffect = oldFiber.nextEffect = null;
    }
       let child = children[index];
       let type = child&&child.type;
       let tag = null;
       let newFiber = null;
       let sameType = child&&oldFiber&&oldFiber.type === child.type; 
       if(sameType) {
           if(oldFiber.alternate) {
               let fiber = oldFiber.alternate;
               fiber.props = child.props;
               fiber.alternate = oldFiber;
               fiber.effectTag = UPDATION;
               fiber.child = null;
               fiber.nextEffectTag = null;
               newFiber = fiber;
           } else {
            newFiber = {
                tag:oldFiber.tag,
                type:child.type,
                props:{
                    ...child.props
                },
                stateNode:oldFiber.stateNode,
                effectTag:UPDATION,
                nextEffectTag:null,
                child:null,
                sibling:null,
                return:currentFiber,
                alternate:oldFiber,
                updateQueue:oldFiber.updateQueue
            };
           }
            
           
       
       } else {
           if(child) {
            if(type===ELEMENT_TEXT) {
                tag = TAG_TEXT;
           } else if(typeof type === 'string') {
                tag = TAG_HOST;
           } else if(typeof type === 'function'&&type.prototype.isReactComponent) {
            tag = TAG_COMPONENT_CLASS;
           } else if(typeof type === 'function') {
            tag = TAG_COMPONENT_FUNCTION;
           }
            newFiber = {
               tag,
               type:child.type,
               props:{
                   ...child.props
               },
               stateNode:null,
               effectTag:APPEND,
               nextEffectTag:null,
               child:null,
               sibling:null,
               return:currentFiber
           };
           }
           if(oldFiber) {
               
               oldFiber.effectTag = DELETION;
               deletions.push(oldFiber);
           }
       }
       if(oldFiber) {
           oldFiber = oldFiber.sibling;
       }
       if(newFiber) {
        if(!currentFiber.child) {
            currentFiber.child = newFiber;
        } else {
            preSibling.sibling = newFiber;
        }
        preSibling = newFiber;
       }
       index++;

   }
}
function workLoop(deadline) {
    while(nextUnitWork&&deadline.timeRemaining()>1) {
        nextUnitWork = performanceUnitOfWork(nextUnitWork);
    }
    if(!nextUnitWork&&currentFiber) {
        console.log(currentFiber)
        commit();//同步更新DOM 不可被中断
        beforeFiber = currentFiber;
        currentFiber = null;
    }
    requestIdleCallback(workLoop,{timeout:500});
}
function commit() {
    let currentEffect = currentFiber.firstEffect;
    deletions.forEach(item=>commitUnitOfWork(item));
    deletions = [];
    while(currentEffect) {
        commitUnitOfWork(currentEffect);
        currentEffect.effectTag = null;
        currentEffect.lastEffect = currentEffect.firstEffect = null;
        currentEffect = currentEffect.nextEffectTag;
    }
}
function commitUnitOfWork(effect) {
    let returnFiber = effect.return;
    let tag = effect.effectTag;
    if(tag===TAG_COMPONENT_CLASS) {
        return;
    }
    while(returnFiber.tag!==TAG_HOST&&returnFiber.tag!==TAG_TEXT&&returnFiber.tag!==TAG_ROOT) {
        returnFiber = returnFiber.return;
    }
    if(tag===APPEND) {
        while(effect.tag!==TAG_HOST&&effect.tag!==TAG_TEXT) {
            effect = effect.child;
        }
        returnFiber.stateNode.appendChild(effect.stateNode);
    } else if(tag===DELETION) {
       deletionUnitOdWork(returnFiber,effect);
    } else if(tag===UPDATION) {
        if(effect.tag===TAG_TEXT) {
            if(effect.alternate.props.text !== effect.props.text) {
                effect.stateNode.textContent = effect.props.text;
            }
        } else if(effect.tag===TAG_HOST){
            updateDOM(effect.stateNode,effect.alternate.props,effect.props);
        }
    }
}
function deletionUnitOdWork(returnFiber,currentFiber) {
   
    if(currentFiber.tag===TAG_HOST||currentFiber.tag===TAG_TEXT) {
        returnFiber.stateNode.removeChild(currentFiber.stateNode);
    } else {
        deletionUnitOdWork(returnFiber,currentFiber.child);
    }
}
export function useReducer(reducer,initVal) {

    let oldHook = workFiber&&workFiber.alternate&&workFiber.alternate.hooks[hooksIndex];
    let newHook = oldHook;
    if(newHook) {
        //非第一次更新
        newHook.state = newHook.updateQueue.forceUpdate(newHook.state);
    } else {
        newHook = {
            state:initVal,
            updateQueue:new UpdateQueue()
        }
    }
    function dispatch(action) {
        let state = reducer?reducer(newHook.state,action):action
        newHook.updateQueue.enQueue(new Update(state));
        schedule();
    }
    workFiber.hooks[hooksIndex] = newHook;
    hooksIndex++;
    return [newHook.state,dispatch];
}
export function useState(state) {
    return useReducer(null,state);
}
export default schedule;