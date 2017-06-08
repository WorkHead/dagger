/**
 * Created by tanjiasheng on 2017/5/15.
 */
import $ from "./query";
import {renderToDom} from './render'

function diff(vNode, newVNode, father) {
    if (vNode.tName == 'root') {
        return diffChildren(vNode.children, newVNode.children, vNode.ele);
    }
    let tarEle = vNode.ele;
    $.each(newVNode, (v, k) => {
        switch (k) {
            case 'attrs':
                //only dynamic attributes need to be diffed
                diffAttr(vNode.attrs.dyn, v.dyn, tarEle);
                vNode.attrs.dyn = v.dyn;
                break;
            case 'tName':
                if (v !== vNode[k]) {
                    father.replaceChild(renderToDom(newVNode, $.createEle(newVNode.tName)), tarEle);
                }
                break;
            case 'children':
                diffChildren(vNode.children, v, tarEle);
                break;
            case 'shouldRender':
                if(v !== vNode[k]) {
                    father.replaceChild(renderToDom(newVNode, $.createEle(newVNode.tName)), tarEle);
                    vNode[k] = v;
                }
                break;
            case 'text':
                if(v !== vNode[k]) {
                    father.innerText = v;
                    vNode[k] = v;
                }
                break;
            default:
                break;
        }
    });
}

function diffChildren(children, newChildren, ele) {
    $.each(newChildren, (nc, i) => {
        if($.isArray(nc)) {
            diffArr(children[i], nc, ele);
        } else {
            diff(children[i], nc, ele);
        }
    });
}

function diffAttr(attr, newAttr, tarEle) {
    $.each(newAttr, (v, k) => {
        if ($.isVoid(attr[k]) || attr[k] != v) {
            tarEle.setAttribute(k, v);
        }
    });
}

function diffArr(arr, newArr, ele) {
    let arrNext = arr[arr.length - 1].ele.nextSibling;//this is the element which goes after the array elements we need to diff
    $.each(newArr, (na, i) => {
        if(!$.isVoid(arr[i])) {
            diff(arr[i], na, ele);
        } else {
            ele.insertBefore(renderToDom(na, $.createEle(na.tName)), arrNext);
            arr.push(na);
        }
    });
    if(arr.length > newArr.length) {
        let toDel = arr.splice(newArr.length);
        $.each(toDel, (d) => {
           ele.removeChild(d);
        });
    }
}

export default diff;