/**
 * Created by tanjiasheng on 2017/5/15.
 */
import $ from "./myQuery";
import {renderToDom} from './render'

function diff(vNode, newVNode, father) {
    console.log(vNode, newVNode);
    if (vNode.tName == 'root') {
        return diffChildren(vNode.children, newVNode.children, vNode.ele);
    }
    let tarEle = vNode.ele;
    $.each(newVNode, (v, k) => {
        switch (k) {
            case 'attrs':
                //only dynamic attributes need to be diffed
                diffAttr(vNode.attrs.dyn, newVNode.attrs.dyn, tarEle);
                break;
            case 'nodeType':
                if (v !== newVNode[k]) {

                }
                break;
            case 'children':
                if(vNode.children.length === v.length){
                    diffChildren(vNode.children, v);
                } else {

                }
                break;
            default:
                break;
        }
    });
}

function diffChildren(children, newChildren) {
    $.each(newChildren, () => {

    });
}

function diffAttr(attr, newAttr, tarEle) {
    $.each(newAttr, (v, k) => {
        if ($.isVoid(attr[k]) || attr[k] != v) {
            tarEle.setAttribute(k, v);
        }
    });
}

function updateEle(ele, vNode) {

}

export default diff;