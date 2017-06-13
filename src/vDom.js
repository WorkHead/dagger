/**
 * Created by tanjiasheng on 2017/5/9.
 */
import $ from './query';

class vNode {
    constructor(props) {
        this.tName = props.tName;
        this.attrs = props.attrs;
        this.children = props.children;
        this.nodeType = props.nodeType;
        this.shouldRender = props.shouldRender;
        this.classObj = props.classObj;
        this.events = props.events;
    }
}

class vTextNode {
    constructor(props) {
        this.text = props.text;
        this.nodeType = props.nodeType;
        this.shouldRender = true;
    }
}

class vComment {
    constructor (props) {
        this.text = props.text;
        this.nodeType = props.nodeType;
    }
}


function createVNode(...vObj) {
    let curVnode = new vNode({
        tName: vObj[0],
        attrs: vObj[1],
        nodeType: vObj[2],
        shouldRender: vObj[3],
        classObj: vObj[4],
        events: vObj[5],
        children: vObj[6],
    });

    !$.isVoid(vObj[6]) && $.each(vObj[6], (o) => {
        o.parent = curVnode;
    });
    return curVnode;
}

function createVTextNode(...vObj) {
    return new vTextNode({
        text: vObj[0],
        nodeType: vObj[1],
    });
}

function createComment(...vObj) {
    return new vComment({
        text: vObj[0],
        nodeType: vObj[1]
    });
}

export {
    createVNode,
    createVTextNode,
    createComment
}