// import React from './react';
// import ReactDOM from './react-dom'
/* import React from './react';
import ReactDOM from './react-dom'
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count:0
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState(state=>{
            return {count:state.count+1}
        })
    }
    render() {
        return (<div>
            {this.state.count}<br/>
            <button onClick={this.handleClick}>+</button>
            </div>);
    }
}
function CountTotal(props) {
    return (
        <div>123</div>
    )
}
let element = (
    <CountTotal/>
);
ReactDOM.render(element,document.getElementById('root')); */



/* import React from './lib/react';
import ReactDOM from './lib/react-dom';
let element = (
    <div class="A1" style={{border:'1px solid red'}}>
        <div class="B1">
            <div class="D1">D1</div>
            <div class="D2">D2</div>
        </div>
        <div class="B2">
            <div class="C1">C1</div>
            <div class="C2">C2</div>
        </div>
    </div>
);
ReactDOM.render(element,document.getElementById('root')); */
/* let btn1 = document.getElementById('btn1');
btn1.onclick = function() {
    let element = (
        <div class="A1" style={{border:'1px solid red'}}>
            <div class="B1-new">
                <div class="D1">D1-new</div>
                <div class="D2">D2</div>
            </div>
            <div class="B2">
                <div class="C1-new">C1-new</div>
                <div class="C2">C2</div>
                <div class="C3">C3</div>
            </div>
        </div>
    );
    ReactDOM.render(element,document.getElementById('root')); 
}


let btn2 = document.getElementById('btn2');
btn2.onclick = function() {
    let element = (
        <div class="A1" style={{border:'1px solid red'}}>
            <div class="B1-new">
                <div class="D1">D1-new</div>
                <div class="D2">D2</div>
            </div>
            <div class="B2">
                <div class="C1-new">C1-new</div>
            </div>
        </div>
    );
    ReactDOM.render(element,document.getElementById('root')); 
} */

import React ,{useState,useReducer}from './lib/react';
import ReactDOM from './lib/react-dom';
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count:0
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log(12)
        this.setState((state)=>{
            return {
                count:state.count+1
            }
        })
    }
    render() {
        return (
            <div>
                <div>{this.state.count}</div>
                <button onClick={this.handleClick}>点击</button>
            </div>
        )
    }
}
/* function Counter(props) {
    const [state,setState] = useState(0);
   
    return (
        <div>
            <div>{state}</div>
            <button onClick={()=> setState(state+1)}></button>
        </div>
    )
} */
/* function reducer(state,action) {
    if(action.type==='ADD') {
        return state+1;
    }
    return state;
}
function Counter(props) {
    const [state,dispatch] = useReducer(reducer,1);
    const [count,setCount] = useState(10);
    return (
        <div>
            <div>{state}</div>
            <button onClick={()=>dispatch({type:'ADD'})}>Add</button>
            <div>{count}</div>
            <button onClick={()=>setCount(state=>state+1)}>Add</button>
        </div>
    )
}
let element = (<Counter/>
); */
let element = (<Counter/>
    );
ReactDOM.render(element,document.getElementById('root'));