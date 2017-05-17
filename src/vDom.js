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
        this.shouldRender = props.shouldRender;
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
    }
}


function createVNode(...vObj) {
    let curVnode = new vNode({
        tName: vObj[0],
        attrs: vObj[1],
        nodeType: vObj[2],
        shouldRender: vObj[3],
        children: vObj[4],
    });

    !$.isVoid(vObj[4]) && $.each(vObj[4], (o) => {
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
        text: vObj[0]
    });
}

export {
    createVNode,
    createVTextNode,
    createComment
}