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
        tName: vObj.tName,
        attrs: vObj.attrs,
        children: vObj.children,
        nodeType: vObj.nodeType
    });
}

function createVTextNode(...vObj) {
    return new vTextNode({
        text: vObj.text
    });
}

export {
    createVNode
}