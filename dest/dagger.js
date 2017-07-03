(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Dagger = factory());
}(this, (function () { 'use strict';

/**
 * Created by tanjiasheng on 2017/5/4.
 */
var _t = {
    toString: function toString(obj) {
        return Object.prototype.toString.call(obj);
    },
    isArray: function isArray(obj) {
        return this.toString(obj) === '[object Array]';
    },
    isObject: function isObject(obj) {
        return this.toString(obj) === '[object Object]' && obj !== null;
    },
    isNumber: function isNumber(obj) {
        return this.toString(obj) === '[object Number]';
    },
    isString: function isString(obj) {
        return this.toString(obj) === '[object String]';
    },
    isFunction: function isFunction(obj) {
        return this.toString(obj) === '[object Function]';
    },
    isElement: function isElement(obj) {
        var eleReg = /\[object HTML(?:\w+?)Element\]/,
            str = this.toString(obj);
        return eleReg.test(str) || str === '[object DocumentFragment]' || str === '[object Text]';
    },
    isVoid: function isVoid(obj) {
        return obj === null || obj === void 0 || obj !== obj;
    },
    isArrayLike: function isArrayLike(obj) {
        return this.isArray(obj) || !this.isVoid(obj) && !this.isVoid(obj.length) && !this.isVoid(obj[obj.length - 1]);
    },
    isEmptyStr: function isEmptyStr(str) {
        return this.isString(str) && str == '';
    },
    isEmptyArr: function isEmptyArr(arr) {
        return this.isArray(arr) && arr.length === 0;
    },
    callFun: function callFun(fun, ctx) {
        var args = arguments,
            argArr = args[2];
        return fun.apply(ctx, this.isArrayLike(argArr) ? argArr : Array.prototype.slice.call(args, 2));
    },
    each: function each(arr, cb) {
        if (this.isArrayLike(arr)) {
            for (var i = 0; i < arr.length; i++) {
                this.callFun(cb, arr[i], [arr[i], i, arr]);
            }
        } else if (this.isObject(arr)) {
            for (var o in arr) {
                if (arr.hasOwnProperty(o)) {
                    this.callFun(cb, arr[o], [arr[o], o]);
                }
            }
        }
    },
    dMap: function dMap(arr, cb) {
        var resArr = new Array(arr.length);
        if (this.isArrayLike(arr)) {
            for (var i = 0; i < arr.length; i++) {
                resArr[i] = this.callFun(cb, arr[i], [arr[i], i, arr]);
            }
        } else if (this.isObject(arr)) {
            for (var o in arr) {
                if (arr.hasOwnProperty(o)) {
                    resArr[o] = this.callFun(cb, arr[o], arr[o]);
                }
            }
        }
        return resArr;
    },
    extend: function extend(tar, obj) {
        for (var p in obj) {
            tar[p] = obj[p];
        }
        return tar;
    },
    http: function http() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var url = opts.url,
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
            var response = void 0;
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
    defProp: function defProp(obj, key, getter, setter) {
        return this.isFunction(getter) && this.isFunction(setter) ? Object.defineProperty(obj, key, {
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
    },
    createEle: function createEle(tName) {
        return document.createElement(tName);
    },
    createTxtNode: function createTxtNode(txt) {
        return document.createTextNode(txt);
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

    val: function val(_val) {
        if ($.isVoid(_val)) {
            return this.el[0] && (this.el[0].value || '');
        }
        $.each(this.el, function (e) {
            e.value = _val;
        });
        return this;
    },
    attr: function attr(key, value) {
        if ($.isVoid(value)) {
            return this.el[0] && (this.el[0].getAttribute(key) || '');
        }
        $.each(this.el, function (e) {
            e.setAttribute(key, value);
        });
        return this;
    },
    getEl: function getEl() {
        return $.isArrayLike(this.el) ? this.el : null;
    },
    addClass: function addClass(str) {
        if ($.isArrayLike(this.el)) {
            $.each(this.el, function (e) {
                if (!$(e).hasClass(str)) {
                    e.className += e.className.length > 0 ? ' ' + str : str;
                }
            });
        } else /*if($.isElement(this.el))*/{
                this.el.className += this.el.className.length > 0 ? ' ' + str : str;
            }
    },
    removeClass: function removeClass(str) {
        if ($.isArrayLike(this.el)) {
            $.each(this.el, function (e) {
                if ($(e).hasClass(str)) {
                    e.className.indexOf(str) == 0 ? e.className = e.className.replace(str, '') : e.className = e.className.replace(' ' + str, '');
                }
            });
        } else /*if($.isElement(this.el))*/{
                this.el.className.indexOf(str) == 0 ? this.el.className = this.el.className.replace(str, '') : this.el.className = this.el.className.replace(' ' + str, '');
            }
    },
    hasClass: function hasClass(str) {
        if ($.isElement(this.el)) {
            return this.el.className.indexOf(str) > -1;
        }
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
var tagReg = /<(\/?\w+?\s?)(\:?\w+=(?:"|'|{).+?(?:"|'|})\s?)*>(?:\s*?\n*?\s*?)(.+?)??(?:\s*?\n*?\s*?)(?=<\/?\w+?\s?(?:\:?\w+=(?:"|'|{).+?(?:"|'|})\s?)*>|$)/g;
var attrReg = /(\:?\w+=((".+?")|({.+?})|('.+?'))\s?)/g;
var bindAttReg = /(\:\w+)|(\{\{.+?\}\})/;
var expBindReg = /\+|-|\?|!|\*|\/|<|>|\[|\]/g;
var forReg = /(\w+)\s*in\s*(\w+)/;
var eventReg = /^\:((click)|(input)|(change)|(touchstart)|(touchmove)|(touchend)|(scroll)|(blur)|(focus)|(keydown)|(keypress)|(keyup)|(load)|(mousedown)|(mousemove)|(mouseout)|(mouseover)|(mouseup)|(select)|(submit))$/;

function parseHTML(html) {
    var stack = [],
        match = void 0,
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
        var tagName = match[1],
            tagStr = getAttr(match[0]),
            innerText = match[3];

        if (!$.isVoid(tagName)) {
            if (!tagName.startsWith('/')) {
                stack.push(tagName);
                var _obj = {
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
                var cloTagName = tagName.slice(1);
                if (stack.pop().trim() !== cloTagName.trim()) throw new Error('template parse Error!');
                curObj = curObj.parent;
                parObj = parObj.parent;
            }
        }
    }
    return resObj;
}

function getAttr(str) {
    var res = str.match(attrReg);
    return $.isArray(res) ? res : [];
}

function genVnodeExp(hObj) {
    return 'with(scope){' + ('return ' + genExp(hObj)) + '}';
}

function genExp(hObj, genForing) {
    var type = hObj.type,
        parent = hObj.parent,
        attrArr = hObj.attrs,
        children = void 0,
        text = void 0,
        tName = void 0,
        shouldRender = 'true',
        resAtt = '{',
        stat = '\"stat\": {',
        dyn = '\"dyn\": {',
        isFor = false,
        forExp = '',
        classObj = '{}',
        events = '{';

    if ($.isEmptyArr(attrArr) || $.isVoid(attrArr)) {
        resAtt += '}';
    } else {
        for (var i = 0, tmp = []; i < attrArr.length; i++) {
            //todo  optimize
            tmp = attrArr[i].split('=');
            tmp[1] = tmp.slice(1).join('=');
            if (bindAttReg.test(tmp[1]) || bindAttReg.test(tmp[0])) {
                tmp[1] = repBrace(tmp[1]);
                dyn += '"' + tmp[0] + '": ' + tmp[1] + ',';
            } else {
                stat += '"' + tmp[0] + '":' + tmp[1] + ',';
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

            //class
            if (tmp[0] == ':class') {
                classObj = repQuo(tmp[1]);
            }

            //model
            if (tmp[0] == ':model') {
                dyn += '"value":' + repQuo(tmp[1]) + ',';
            }

            //events
            if (eventReg.test(tmp[0])) {
                events += '"' + repCol(tmp[0]) + '": ' + repQuo(tmp[1]) + ',';
            }
        }
        stat += '}';
        dyn += '}';
        resAtt += stat + ',';
        resAtt += dyn + '}';
    }

    events += '}';

    switch (type) {
        case 1:
            tName = hObj.tName.trim();
            children = hObj.children;
            if (!isFor || genForing) {
                return '_c("' + tName + '",' + resAtt + ', ' + type + ', !!(' + shouldRender + ') ,' + classObj + ', ' + events + ', [' + genChildren(children) + '])';
            } else {
                return genForExp(hObj, forExp);
            }
        case 2:
            text = parseText(hObj.text);
            return '_ct(' + text + ', 2)';
        default:
            return '_c("div", {}, 1 ,true, {}, {}, [])';
    }
}

function genChildren(hObj) {
    return $.dMap(hObj, function (o) {
        return genExp(o);
    });
}

function genForExp(hObj, forExp) {
    var res = forExp.match(forReg),
        arr = res[2],
        ita = res[1];

    return '_cm(' + arr + ', function(' + ita + ', $index){' + ('return ' + genExp(hObj, true)) + '})';
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
        return '"' + txt + '"';
    }
}

function repBrace(str) {
    return str.replace(/\{{2}|\}{2}|\b/g, '');
}

function repQuo(str) {
    return str.replace(/"/g, '');
}

function repCol(str) {
    return str.replace(':', '');
}

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by tanjiasheng on 2017/5/9.
 */
var vNode = function vNode(props) {
    _classCallCheck$1(this, vNode);

    this.tName = props.tName;
    this.attrs = props.attrs;
    this.children = props.children;
    this.nodeType = props.nodeType;
    this.shouldRender = props.shouldRender;
    this.classObj = props.classObj;
    this.events = props.events;
};

var vTextNode = function vTextNode(props) {
    _classCallCheck$1(this, vTextNode);

    this.text = props.text;
    this.nodeType = props.nodeType;
    this.shouldRender = true;
};

function createVNode() {
    var curVnode = new vNode({
        tName: arguments.length <= 0 ? undefined : arguments[0],
        attrs: arguments.length <= 1 ? undefined : arguments[1],
        nodeType: arguments.length <= 2 ? undefined : arguments[2],
        shouldRender: arguments.length <= 3 ? undefined : arguments[3],
        classObj: arguments.length <= 4 ? undefined : arguments[4],
        events: arguments.length <= 5 ? undefined : arguments[5],
        children: arguments.length <= 6 ? undefined : arguments[6]
    });

    !$.isVoid(arguments.length <= 6 ? undefined : arguments[6]) && $.each(arguments.length <= 6 ? undefined : arguments[6], function (o) {
        o.parent = curVnode;
    });
    return curVnode;
}

function createVTextNode() {
    return new vTextNode({
        text: arguments.length <= 0 ? undefined : arguments[0],
        nodeType: arguments.length <= 1 ? undefined : arguments[1]
    });
}

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by tanjiasheng on 2017/5/12.
 */

var dgComponent = function () {
    function dgComponent(props) {
        _classCallCheck$2(this, dgComponent);

        this.vDom = props.vDom;
        this.vExp = props.vExp;
        this.conEle = props.conEle;
        this.scope = props.scope;
    }

    _createClass$1(dgComponent, [{
        key: 'onLoad',
        value: function onLoad() {
            console.info('load success');
        }
    }, {
        key: 'onUpdate',
        value: function onUpdate() {
            console.info('update success');
        }
    }]);

    return dgComponent;
}();

/**
 * Created by tanjiasheng on 2017/5/15.
 */
function diff(vNode, newVNode, father, scope) {
    if (vNode.tName == 'root') {
        return diffChildren(vNode.children, newVNode.children, vNode.ele, scope);
    }
    var tarEle = vNode.ele;
    $.each(newVNode, function (v, k) {
        switch (k) {
            case 'attrs':
                //only dynamic attributes need to be diffed
                diffAttr(vNode.attrs.dyn, v.dyn, tarEle);
                //todo update when changed only
                vNode.attrs.dyn = v.dyn;
                break;
            case 'children':
                diffChildren(vNode.children, v, tarEle, scope);
                break;
            case 'shouldRender':
                if (v !== vNode[k]) {
                    father.replaceChild(renderToDom(newVNode, $.createEle(newVNode.tName), scope), tarEle);
                    vNode[k] = v;
                }
                break;
            case 'text':
                if (v !== vNode[k]) {
                    father.innerText = v;
                    vNode[k] = v;
                }
                break;
            case 'classObj':
                diffClass(vNode.classObj, v, tarEle);
                //todo update when changed only
                vNode.classObj = v;
                break;
            default:
                break;
        }
    });
}

function diffChildren(children, newChildren, ele, scope) {
    $.each(newChildren, function (nc, i) {
        if ($.isArray(nc)) {
            diffArr(children[i], nc, ele, scope);
        } else {
            diff(children[i], nc, ele, scope);
        }
    });
}

function diffAttr(attr, newAttr, tarEle) {
    $.each(newAttr, function (v, k) {
        if ($.isVoid(attr[k]) || attr[k] != v) {
            tarEle.setAttribute(k, v);
        }
    });
}

function diffArr(arr, newArr, ele, scope) {
    var arrNext = arr[arr.length - 1].ele.nextSibling; //this is the element which goes after the array elements we need to diff
    $.each(newArr, function (na, i) {
        if (!$.isVoid(arr[i])) {
            diff(arr[i], na, ele, scope);
        } else {
            ele.insertBefore(renderToDom(na, $.createEle(na.tName), scope), arrNext);
            arr.push(na);
        }
    });
    if (arr.length > newArr.length) {
        var toDel = arr.splice(newArr.length);
        $.each(toDel, function (d) {
            ele.removeChild(d.ele);
        });
    }
}

function diffClass(classObj, newClassObj, ele) {
    $.each(newClassObj, function (v, k) {
        if (v && !classObj[k]) {
            $(ele).addClass(k);
        } else if (!v && classObj[k]) {
            $(ele).removeClass(k);
        }
    });
}

/**
 * Created by tanjiasheng on 2017/5/5.
 *
 */
var urlReg = /\w+\.html$/;
var _cm = $.dMap.bind($);

function render(tpl, elem, scope) {
    var conEle = $(elem.startsWith('#') ? elem : '#' + elem).getEl(),
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
            var hObj = parseHTML(data),
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
    var vNodeFun = new Function('_c', '_ct', '_cm', 'scope', vNodeExp);

    try {
        dgObj.vExp = vNodeExp;
        return vNodeFun(createVNode, createVTextNode, _cm, scope);
    } catch (e) {
        throw new Error('template parse error');
    }
}

function renderToDom(vNode, ele, scope) {
    var children = vNode.children,
        curEle = void 0;

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
                $.each(vNode, function (n) {
                    renderToDom(n, ele, scope);
                });
            }
            curEle = createAndAppend(vNode, ele, scope);
        } else {
            return renderComment(vNode, ele);
        }
    }

    $.each(children, function (o) {
        renderToDom(o, curEle, scope);
    });

    return curEle;
}

function renderComment(vNode, ele) {
    var comment = 'if ---- <' + vNode.tName,
        com = void 0,
        dynAtt = vNode.attrs.dyn,
        statAtt = vNode.attrs.stat;

    $.each(dynAtt, function (y, ay) {
        comment += ' ' + ay + '="' + y + '"';
    });

    $.each(statAtt, function (t, ay) {
        comment += ' ' + at + '="' + t + '"';
    });

    comment += '/> ---- if';
    com = document.createComment(comment);
    ele.appendChild(com);
    vNode.ele = com;
    return com;
}

function createAndAppend(vNode, ele, scope) {
    var type = vNode.nodeType,
        attrs = void 0,
        statAtt = void 0,
        dynAtt = void 0,
        tarEle = void 0,
        classObj = void 0,
        events = void 0;

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

    $.each(statAtt, function (t, at) {
        tarEle.setAttribute(at, t);
    });

    $.each(dynAtt, function (y, ay) {
        tarEle.setAttribute(ay, y);
        if (ay == ':model') {
            bindModel(tarEle, scope, y);
        }
    });

    $.each(classObj, function (l, al) {
        if (l) {
            $(tarEle).addClass(al);
        }
    });

    $.each(events, function (v, av) {
        tarEle.addEventListener(av, v);
    });

    vNode.ele = tarEle;

    if ($.isElement(ele) && $.isElement(tarEle)) {
        ele.appendChild(tarEle);
    }
    return tarEle;
}

function bindWatch(dgObj) {
    var scope = dgObj.scope;

    observer(scope, dgObj);
}

function observer(obj, dgObj) {
    if ($.isObject(obj)) {
        Object.keys(obj).forEach(function (key) {
            defineReactive(obj, key, obj[key], dgObj);
        });
    } else if ($.isArray(obj)) {
        watchArr(obj, dgObj);
    }
}

function bindModel(ele, scope, value) {
    ele.addEventListener('input', function (e) {
        scope[value] = ele.value;
    });
}

function defineReactive(scope, key, value, dgObj) {
    if ($.isObject(value) || $.isArray(value)) {
        observer(value, dgObj);
    }
    $.defProp(scope, key, function () {
        return value;
    }, function (newV) {
        if (newV === value) return;

        value = newV;

        observer(newV, dgObj);

        notifyChange(dgObj);
    });
}

function notifyChange(dgObj) {
    var newVNode = genVnodeObj(dgObj.vExp, dgObj.scope, dgObj);

    diff(dgObj.vNode, newVNode, dgObj.conEle, dgObj.scope);
    $.callFun(dgObj.onUpdate, dgObj);
}

//watch array changes by overriding Array.prototype
function watchArr(arr, dgObj) {
    var fakeProto = Object.create(Array.prototype),
        arrayFuns = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

    $.each(arrayFuns, function (f) {
        $.defProp(fakeProto, f, function () {
            //ES6 arrow functions can't read arguments
            var args = Array.prototype.slice.call(arguments),
                res = Array.prototype[f].apply(arr, args);

            notifyChange(dgObj);

            //rewatch
            observer(arr, dgObj);

            return res;
        });
    });

    arr.__proto__ = fakeProto;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dagger = function () {
    function Dagger(options) {
        _classCallCheck(this, Dagger);

        this._data = options.data;
        this._options = options;
        self = this;

        Object.keys(options.data).forEach(function (key) {
            self._proxy(key);
        });

        var dgObj = render(options.template, options.el, options.data);

        this._vDom = dgObj.vDom;
        this._vExp = dgObj.vExp;
        this._el = dgObj.conEle;
    }

    _createClass(Dagger, [{
        key: "_proxy",
        value: function _proxy(key) {
            var self = this;
            $.defProp(this, key, function () {
                return self._data[key];
            }, function (newV) {
                self._data[key] = newV;
            });
        }
    }]);

    return Dagger;
}();

Dagger.render = render;
Dagger.$ = $;

return Dagger;

})));
