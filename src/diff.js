/**
 * Created by tanjiasheng on 2017/5/15.
 */
import $ from "./myQuery";

class patch {
    constructor(props) {

    }
}

function diff(vNode, newVNode) {
    console.log(vNode, newVNode);
    if (vNode.tName == 'root') {
        return diffChildren(vNode.children, newVNode.children);
    }
    let tarEle = vNode.ele;
    $.each(newVNode, (v, k) => {
        switch (k) {
            case 'attrs':
                //dynamic attributes only
                diffAttr(vNode.attrs.dyn, newVNode.attrs.dyn, tarEle);
                break;
            case 'nodeType':
                if (v !== newVNode[k]) {

                }
                break;
            case 'children':
                diffChildren(vNode.children, v);
                break;
            default:
                break;
        }
    });
}

function diffChildren(children, newChildren) {

}

function diffAttr(attr, newAttr, tarEle) {
    $.each(newAttr, (v, k) => {
        if ($.isVoid(attr[k]) || attr[k] != v) {
            tarEle.setAttribute(k, v);
        }
    });
}

export default diff;