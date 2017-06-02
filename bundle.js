'use strict';

/**
 * Created by tanjiasheng on 2017/5/4.
 */
const _t = {
    toString(obj) {
        return Object.prototype.toString.call(obj);
    },
    isArray(obj) {
        return this.toString(obj) === '[object Array]';
    },
    isObject(obj) {
        return this.toString(obj) === '[object Object]';
    },
    isNumber(obj) {
        return this.toString(obj) === '[object Number]';
    },
    isString(obj) {
        return this.toString(obj) === '[object String]';
    },
    isFunction(obj) {
        return this.toString(obj) === '[object Function]';
    },
    isElement(obj) {
        let eleReg = /\[object HTML(?:\w+?)Element\]/,
            str = this.toString(obj);
        return eleReg.test(str) || str === '[object DocumentFragment]' || str === '[object Text]';
    },
    isVoid(obj) {
        return obj === null || obj === void 0 || obj !== obj;
    },
    isArrayLike(obj) {
        return this.isArray(obj) || (!this.isVoid(obj) && !this.isVoid(obj.length) && !this.isVoid(obj[obj.length - 1]));
    },
    isEmptyStr(str) {
        return this.isString(str) && str == '';
    },
    isEmptyArr(arr) {
        return this.isArray(arr) && arr.length === 0;
    },
    callFun(fun, ctx) {
        let args = arguments,
            argArr = args[2];
        return fun.apply(ctx, this.isArrayLike(argArr)
            ? argArr
            : Array.prototype.slice.call(args, 2));
    },
    each(arr, cb) {
        if (this.isArrayLike(arr)) {
            for (let i = 0; i < arr.length; i++) {
                this.callFun(cb, arr[i], [arr[i], i, arr]);
            }
        } else if (this.isObject(arr)) {
            for (let o in arr) {
                if (arr.hasOwnProperty(o)) {
                    this.callFun(cb, arr[o], [arr[o], o]);
                }
            }
        }
    },
    dMap(arr, cb) {
        let resArr = new Array(arr.length);
        if (this.isArrayLike(arr)) {
            for (let i = 0; i < arr.length; i++) {
                resArr[i] = this.callFun(cb, arr[i], [arr[i], i, arr]);
            }
        } else if (this.isObject(arr)) {
            for (let o in arr) {
                if (arr.hasOwnProperty(o)) {
                    resArr[o] = this.callFun(cb, arr[o], arr[o]);
                }
            }
        }
        return resArr;
    },
    extend(tar, obj) {
        for (let p in obj) {
            tar[p] = obj[p];
        }
        return tar;
    },
    http(opts = {}) {
        let url = opts.url,
            method = opts.method || 'get',
            data = opts.data,
            success = opts.success,
            fail = opts.fail,
            client = new XMLHttpRequest(),
            responseType = opts.resType || 'text';

        if (method == 'get' && !_t.isVoid(data)) {
            url += /\?/.test(url) ? '&' + data : '?' + data;
            data = null;
        }

        client.open(method, url, true);
        client.onreadystatechange = handler;

        try {
            client.responseType = responseType;
        } catch (err) {
            client.setRequestHeader('responseType', responseType);
        }
        client.setRequestHeader("Content-Type", opts.contentType || "application/x-www-form-urlencoded;charset=utf-8");
        client.send(data);

        function handler() {
            let response;
            if (client.readyState !== 4) {
                return;
            }
            if (client.status === 200) {
                response = client.response;
                if (responseType == 'json') {
                    _t.isString(response) && (response = JSON.parse(response));
                }
                success(response);
            } else {
                fail(new Error(client.statusText));
            }
        }
    },
    defProp(obj, key, getter, setter) {
        return (this.isFunction(getter) && this.isFunction(setter)) ? Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                set: setter,
                get: getter
            }) : Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: getter
            });
    }
};

/**
 * Created by tanjiasheng on 2017/5/4.
 */

function Query(selector) {
    this.el = {};
    _t.isString(selector) && (this.el = document.querySelectorAll(selector));
    _t.isElement(selector) && (this.el = selector);
}


Query.prototype = {
    constructor: Query,

    val(val) {
        if (_t.isVoid(val)) {
            return this.el[0] && (this.el[0].value || '');
        }
        _t.each(this.el, (e) => {
            e.value = val;
        });
        return this;
    },
    attr(key, value) {
        if (_t.isVoid(value)) {
            return this.el[0] && (this.el[0].getAttribute(key) || '');
        }
        _t.each(this.el, (e) => {
            e.setAttribute(key, value);
        });
        return this;
    },
    getEl() {
        return $.isArrayLike(this.el)? this.el: null;
    }
};

function $(selector) {
    return new Query(selector);
}

_t.extend($, _t);

/**
 * Created by tanjiasheng on 2017/5/10.
 */

/**
 * Created by tanjiasheng on 2017/5/4.
 */
const tagReg = /<(\/?\w+?\s?)(\:?\w+=(?:"|'|{).+?(?:"|'|})\s?)*>(?:\s*?\n*?\s*?)(.+?)??(?:\s*?\n*?\s*?)(?=<\/?\w+?\s?(?:\:?\w+=(?:"|'|{).+?(?:"|'|})\s?)*>|$)/g;
const attrReg = /(\:?\w+=(?:"|'|{).+?(?:"|'|})\s?)/g;
const bindAttReg = /(\:\w+)|(\{\{.+?\}\})/;
const expBindReg = /\+|-|\?|!|\*|\/|<|>|\[|\]/g;
const forReg = /(\w+)\s*in\s*(\w+)/;

function parseHTML(html) {
    let stack = [],
        match,
        resObj = {
            tName: 'root',
            attrs: '',
            children: [],
            parent: {},
            type: 1
        },
        parObj = {},
        curObj = resObj;
    while (match = tagReg.exec(html)) {
        let tagName = match[1],
            tagStr = getAttr(match[0]),
            innerText = match[3];

        if (!$.isVoid(tagName)) {
            if (!tagName.startsWith('/')) {
                stack.push(tagName);
                let _obj = {
                    tName: tagName,
                    attrs: tagStr,
                    children: [],
                    parent: curObj,
                    type: 1
                };
                curObj.children.push(_obj);
                parObj = curObj;
                curObj = _obj;
                if ($.isString(innerText)) {
                    curObj.children.push({
                        parent: curObj,
                        type: 2,
                        text: innerText
                    });
                }
            } else {
                let cloTagName = tagName.slice(1);
                if (stack.pop().trim() !== cloTagName.trim()) return new Error('template parse Error!');
                curObj = curObj.parent;
                parObj = parObj.parent;
            }
        }
    }
    return resObj;
}

function getAttr(str) {
    let res = str.match(attrReg);
    return $.isArray(res) ? res : [];
}

function genVnodeExp(hObj) {
    return 'with(scope){' +
        'return ' + genExp(hObj) +
        '}';
}

function genExp(hObj, genForing) {
    let type = hObj.type,
        parent = hObj.parent,
        attrArr = hObj.attrs,
        children,
        text,
        tName,
        shouldRender = 'true',
        resAtt = '{',
        stat = '\"stat\": {',
        dyn = '\"dyn\": {',
        isFor = false,
        forExp = '';

    if ($.isEmptyArr(attrArr) || $.isVoid(attrArr)) {
        resAtt += '}';
    } else {
        for (let i = 0, tmp = []; i < attrArr.length; i++) {
            //todo  optimize
            tmp = attrArr[i].split('=');
            tmp[1] = tmp.slice(1).join('=');
            if (bindAttReg.test(tmp[1]) || bindAttReg.test(tmp[0])) {
                tmp[1] = repBrace(tmp[1]);
                if (expBindReg.test(tmp[1])) {
                    dyn += '\"' + tmp[0] + '\": (function(){ return ' + tmp[1] + '})(),';
                } else {
                    dyn += '\"' + tmp[0] + '\": ' + tmp[1] + ',';
                }
            } else {
                stat += '\"' + tmp[0] + '\":' + tmp[1] + ',';
            }

            //if
            if (tmp[0] == ':if') {
                shouldRender = repQuo(tmp[1]);
            }

            //for
            if (tmp[0] == ':for') {
                isFor = true;
                forExp = tmp[1];
            }
        }
        stat += '}';
        dyn += '}';
        resAtt += stat + ',';
        resAtt += dyn + '}';
    }

    switch (type) {
        case 1:
            tName = hObj.tName.trim();
            children = hObj.children;
            if (!isFor || genForing) {
                return '_c(\"' + tName + '\",' + resAtt + ', ' + type + ', !!(' + shouldRender + ') , [' + genChildren(children) + '])';
            } else {
                return genForExp(hObj, forExp)
            }
        case 2:
            text = parseText(hObj.text);
            return '_ct(' + text + ', 2)';
        default:
            return '_c(\"div\", {},1 ,true , [])';
    }
}

function genChildren(hObj) {
    return $.dMap(hObj, (o) => {
        return genExp(o);
    });
}

function genForExp(hObj, forExp) {
    let res = forExp.match(forReg),
        arr = res[2],
        ita = res[1];

    return '_cm(' + arr + ', function(' + ita + ', $index){' +
        'return ' + genExp(hObj, true) +
        '})';
}

// function parseAttr(attrs) {
//     if ($.isEmptyArr(attrs)) return '{}';
//     let resAtt = '{',
//         stat = 'stat: {',
//         dyn = 'dyn: {';
//
//     $.each(attrs, (t) => {
//         let tmp = t.split('=');
//         if (bindAttReg.test(tmp[1])) {
//             tmp[1] = repBrace(tmp[1]);
//             if (expBindReg.test(tmp[1])) {
//                 dyn += tmp[0] + ': (function(){ return ' + tmp[1] + '})(),';
//             } else {
//                 dyn += tmp[0] + ': ' + tmp[1] + ',';
//             }
//         } else {
//             stat += tmp[0] + ':' + tmp[1] + ',';
//         }
//     });
//     stat += '}';
//     dyn += '}';
//     resAtt += stat + ',';
//     resAtt += dyn + '}';
//     return resAtt;
// }

function parseText(txt) {

    if (bindAttReg.test(txt)) {
        txt = repBrace(txt);
        if (expBindReg.test(txt)) {
            return '(function(){ return ' + txt + '})()';
        } else {
            return txt;
        }
    } else {
        return '\"' + txt + '\"';
    }
}

function repBrace(str) {
    return str.replace(/\{|\}|\b/g, '');
}

function repQuo(str) {
    return str.replace(/"/g, '');
}

/**
 * Created by tanjiasheng on 2017/5/9.
 */
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

/**
 * Created by tanjiasheng on 2017/5/12.
 */

class dgComponent {
    constructor(props) {
        this.vDom = props.vDom;
        this.vExp = props.vExp;
        this.conEle = props.conEle;
        this.scope = props.scope;
    }
}

/**
 * Created by tanjiasheng on 2017/5/15.
 */
function diff(vNode, newVNode) {
    console.log(vNode, newVNode);
    if (vNode.tName == 'root') {
        return diffChildren(vNode.children, newVNode.children);
    }
    $.each(newVNode, (v, k) => {
        switch (k) {
            case 'attrs':
                let diffRes = diffAttr(vNode.attrs, newVNode.attrs);
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

function diffAttr(attr, newAttr) {

}

/**
 * Created by tanjiasheng on 2017/5/5.
 */
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
        init(tpl);
    }

    function init(data) {
        if (!$.isVoid(data) && $.isString(data)) {
            let hObj = parseHTML(data),
                vNodeExp = genVnodeExp(hObj);

            vNode = genVnodeObj(vNodeExp, scope, dgObj);
            dgObj.vNode = vNode;
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
    return vNodeFun(createVNode, createVTextNode, _cm, scope);
}

function renderToDom(vNode, ele) {
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
        //todo view2model data bind
        tarEle.setAttribute(ay, y);
    });

    vNode.ele = tarEle;

    if ($.isElement(ele) && ($.isElement(tarEle))) {
        ele.appendChild(tarEle);
    }
    return tarEle;
}

function bindWatch(dgObj) {
    let scope = dgObj.scope;
    defineReactive(scope, dgObj);
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

    //todo diff
    renderToDom(newVNode, dgObj.conEle);

    diff(dgObj.vNode, newVNode);
    dgObj.vNode = newVNode;
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

/**
 * Created by tanjiasheng on 2017/5/4.
 */

/*
 * A simple template engine with two-way data bindings.
 *
 * */
let a = {
    text1: 'text1',
    text2: 'text2',
    num1: 1,
    num3: 3,
    arr:  [1,2,3,4],
    obj: {
        qq: 1,
        bb: {
            cc: 2
        }
    },
    dd: 'dddddddd'

};
render('templates/test.html', 'test1', a);

setTimeout(() => {
    a.arr.push(5);
}, 1000);

setTimeout(() => {
    a.arr.push(6);
}, 2000);



// render('templates/test.html', 'test2', b)

// setInterval( ()=> {
//     a.num3++;
// }, 1000);
//
// setInterval(()=> {
//     b.num3++;
// }, 2000)
