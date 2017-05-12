/**
 * Created by tanjiasheng on 2017/5/5.
 */
import $ from './myQuery';
import {parseHTML, genVnodeExp} from './parser';
import {createVNode as _c, createVTextNode as _ct} from './vDom';
import dgComponent from './component';

const urlReg = /^.?(\/?.+)+\w+\.\w+$/;

function render(tpl, elem, scope) {

    let conEle = $(elem.startsWith('#') ? elem : '#' + elem).getEl(),
        dgObj = new dgComponent({
            conEle: conEle,
            vDom: {},
            vExp: ''
        }),
        vNode = {};
    if (urlReg.test(tpl)) {
        $.http({
            url: tpl,
            success(data) {
                if (!$.isVoid(data)) {
                    vNode = genVnodeObj(data, scope, dgObj);
                    dgObj.vDom = vNode;
                    if($.isArrayLike(conEle) && $.isElement(conEle[0])) {

                        renderToDom(vNode, conEle[0]);
                    }
                }
            }
        });
    }

    return dgObj;
}

function genVnodeObj(data, scope, dgObj) {
    let hObj = parseHTML(data),
        vNodeExp = genVnodeExp(hObj),
        vNodeFun = new Function('_c', '_ct', 'scope', vNodeExp);

    dgObj.vExp = vNodeExp;
    return vNodeFun(_c, _ct, scope);
}

function renderToDom(vNode, ele) {
    let children = vNode.children,
        curEle;

    if(vNode.tName === 'root') {
        curEle = ele
    } else {
        curEle = createAndAppend(vNode, ele);
    }

    $.each(children, (o) => {
        renderToDom(o, curEle);
    });

}

function createAndAppend(vNode, ele) {
    let type = vNode.nodeType,
        attrs,
        statAtt,
        dynAtt,
        tarEle;
    switch (type) {
        case 1:
            attrs = vNode.attrs;
            statAtt = attrs.stat;
            dynAtt = attrs.dyn;
            tarEle = document.createElement(vNode.tName);
            break;
        case 2:
            tarEle = document.createTextNode(vNode.text);
            break;
    }

    $.each(statAtt, (t, at) => {
        tarEle.setAttribute(at, t);
    });

    $.each(dynAtt, (y, ay) => {
        tarEle.setAttribute(ay, y);
    });

    vNode.ele = tarEle;
    $.isElement(ele) && (ele.appendChild(tarEle));
    console.log(ele);
    return tarEle;
}

export default render;