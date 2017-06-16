/**
 * Created by tanjiasheng on 2017/5/5.
 *
 */
import $ from './query';
import {parseHTML, genVnodeExp} from './parser';
import {createVNode as _c, createVTextNode as _ct} from './vDom';
import dgComponent from './component';
import diff from './diff'

const urlReg = /\w+\.html$/;
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
            dgObj.vNode = vNode;
            if ($.isArrayLike(conEle) && $.isElement(conEle[0])) {
                dgObj.conEle = conEle[0];
                renderToDom(vNode, conEle[0], scope);
                $.callFun(dgObj.onLoad, dgObj);
            }
        } else {
            throw new Error('template error');
        }
    }

    return dgObj;
}


function genVnodeObj(vNodeExp, scope, dgObj) {
    let vNodeFun = new Function('_c', '_ct', '_cm', 'scope', vNodeExp);

    try {
        dgObj.vExp = vNodeExp;
        return vNodeFun(_c, _ct, _cm, scope);
    } catch (e) {
        throw new Error('template parse error');
    }
}

function renderToDom(vNode, ele, scope) {
    let children = vNode.children,
        curEle;

    if (vNode.tName === 'root') {
        curEle = ele;
        vNode.ele = ele;
        while (curEle.childNodes.length > 0) {
            //todo diff
            curEle.removeChild(curEle.firstChild);
        }
    } else {
        if (vNode.shouldRender || $.isArray(vNode)) {
            if ($.isArray(vNode)) {
                $.each(vNode, (n) => {
                    renderToDom(n, ele, scope);
                });
            }
            curEle = createAndAppend(vNode, ele, scope);
        } else {
            return renderComment(vNode, ele);
        }
    }

    $.each(children, (o) => {
        renderToDom(o, curEle, scope);
    });

    return curEle;
}

function renderComment(vNode, ele) {
    let comment = 'if ---- <' + vNode.tName + '/> ---- if',
        com = document.createComment(comment);

    ele.appendChild(com);
    vNode.ele = com;
    return com;
}

function createAndAppend(vNode, ele, scope) {
    let type = vNode.nodeType,
        attrs,
        statAtt,
        dynAtt,
        tarEle,
        classObj,
        events;

    switch (type) {
        case 1:
            attrs = vNode.attrs;
            statAtt = attrs.stat;
            dynAtt = attrs.dyn;
            classObj = vNode.classObj;
            events = vNode.events;
            tarEle = $.createEle(vNode.tName);
            break;
        case 2:
            tarEle = $.createTxtNode(vNode.text);
            break;
    }

    $.each(statAtt, (t, at) => {
        tarEle.setAttribute(at, t);
    });

    $.each(dynAtt, (y, ay) => {
        tarEle.setAttribute(ay, y);
        if(ay == ':model') {
            bindModel(tarEle, scope, y);
        }
    });

    $.each(classObj, (l, al) => {
        if(l) {
            $(tarEle).addClass(al);
        }
    });

    $.each(events, (v, av) => {
        tarEle.addEventListener(av, v);
    });

    vNode.ele = tarEle;

    if ($.isElement(ele) && ($.isElement(tarEle))) {
        ele.appendChild(tarEle)
    }
    return tarEle;
}

function bindWatch(dgObj) {
    let scope = dgObj.scope;

    defineReactive(scope, dgObj);
}

function bindModel(ele, scope, value) {
    ele.addEventListener('input', (e) => {
       scope[value] = ele.value;
    });
}

//todo optimize arguments
function defineReactive(scope, dgObj, key, value) {
    $.each(scope, (v, k) => {
        $.defProp(scope, k, () => {
            if (!$.isVoid(key) && k == key) {
                return value;
            }
            return v;
        }, (newV) => {
            if (newV !== v) {
                defineReactive(scope, dgObj, k, newV);
                notifyChange(dgObj);
            }
        });

        if ($.isObject(v)) {
            defineReactive(v, dgObj);
        } else if ($.isArray(v)) {
            hijackArrProto(v, dgObj);
        }
    });
}

function notifyChange(dgObj) {
    let newVNode = genVnodeObj(dgObj.vExp, dgObj.scope, dgObj);

    diff(dgObj.vNode, newVNode, dgObj.conEle, dgObj.scope);
    $.callFun(dgObj.onUpdate, dgObj);
}

//watch array changes by overriding Array.prototype
function hijackArrProto(arr, dgObj) {
    let fakeProto = Object.create(Array.prototype),
        arrayFuns = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

    $.each(arrayFuns, (f) => {
        $.defProp(fakeProto, f, function () {//ES6 arrow functions can't read arguments
            let args = Array.prototype.slice.call(arguments),
                res = Array.prototype[f].apply(arr, args);

            notifyChange(dgObj);

            //rewatch
            defineReactive(arr, dgObj);

            return res;
        });
    });

    arr.__proto__ = fakeProto;
}

export {
    render,
    renderToDom
}