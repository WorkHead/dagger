/**
 * Created by tanjiasheng on 2017/5/5.
 */
import $ from './myQuery';
import {parseHTML, genVnodeExp} from './parser';
import {createVNode as _c, createVTextNode as _ct} from './vDom';
import dgComponent from './component';

const urlReg = /^.?(\/?.+)+\w+\.\w+$/;
const _cm = $.dMap.bind($);

function render(tpl, elem, scope) {

    let conEle = $(elem.startsWith('#') ? elem : '#' + elem).getEl(),
        dgObj = new dgComponent({
            conEle: {},
            vDom: {},
            vExp: '',
            scope: scope
        }),
        vNode = {};

    bindWatch(dgObj);

    if (urlReg.test(tpl)) {
        $.http({
            url: tpl,
            success: init
        });
    } else {
        init(tpl)
    }

    function init(data) {
        if (!$.isVoid(data) && $.isString(data)) {
            let hObj = parseHTML(data),
                vNodeExp = genVnodeExp(hObj);

            vNode = genVnodeObj(vNodeExp, scope, dgObj);
            dgObj.vDom = vNode;
            if ($.isArrayLike(conEle) && $.isElement(conEle[0])) {
                dgObj.conEle = conEle[0];
                renderToDom(vNode, conEle[0]);
            }
        } else {
            return new Error('template error');
        }
    }

    return dgObj;
}


function genVnodeObj(vNodeExp, scope, dgObj) {
    let vNodeFun = new Function('_c', '_ct', '_cm', 'scope', vNodeExp);

    dgObj.vExp = vNodeExp;
    return vNodeFun(_c, _ct, _cm, scope);
}

function renderToDom(vNode, ele) {
    let children = vNode.children,
        curEle;

    if (vNode.tName === 'root') {
        curEle = ele;
        while (curEle.childNodes.length > 0) {
            curEle.removeChild(curEle.firstChild);
        }
    } else {
        if (vNode.shouldRender || $.isArray(vNode)) {
            if ($.isArray(vNode)) {
                $.each(vNode, (n) => {
                    renderToDom(n, ele);
                });
            }
            curEle = createAndAppend(vNode, ele);
        } else {
            return renderComment(vNode, ele);
        }
    }

    $.each(children, (o) => {
        renderToDom(o, curEle);
    });

}

function renderComment(vNode, ele) {
    let comment = 'if ---- <' + vNode.tName + '/> ---- if',
        com = document.createComment(comment);

    ele.appendChild(com);
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

    if ($.isElement(ele) && ($.isElement(tarEle))) {
        ele.appendChild(tarEle)
    }
    return tarEle;
}

function bindWatch(dgObj, key, value) {
    let scope = dgObj.scope;
    $.each(scope, (v, k) => {
        $.defProp(scope, k, () => {
            if (!$.isVoid(key) && k == key) {
                return value;
            }
            return v;
        }, (newV) => {
            if (newV !== v) {
                bindWatch(dgObj, k, newV);
                notifyChange(dgObj);
            }
        });
    });
}

function notifyChange(dgObj) {
    let newVNode = genVnodeObj(dgObj.vExp, dgObj.scope, dgObj);

    //todo diff
    renderToDom(newVNode, dgObj.conEle);
}

export default render;