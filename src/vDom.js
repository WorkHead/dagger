/**
 * Created by tanjiasheng on 2017/5/9.
 */
import $ from './myQuery';

class vNode {
    constructor(props) {
        this.tName = props.tName;
        this.attrs = props.attrs;
        this.children = props.children;
        this.nodeType = props.nodeType;
    }
}

class vTextNode {
    constructor(props) {
        this.text = props.text;
    }
}

function createVNode(...vObj) {
    return new vNode({
        tName: vObj[0],
        attrs: vObj[1],
        nodeType: vObj[2],
        children: vObj[3]
    });
}

function createVTextNode(...vObj) {
    return new vTextNode({
        text: vObj[0],
        nodeType: vObj[1]
    });
}

export {
    createVNode,
    createVTextNode
}