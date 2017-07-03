/**
 * Created by tanjiasheng on 2017/5/4.
 */
import $ from './query';
import {NODETYPES} from './types';

const tagReg = /<(\/?\w+?\s?)(\:?\w+=(?:"|'|{).+?(?:"|'|})\s?)*>(?:\s*?\n*?\s*?)(.+?)??(?:\s*?\n*?\s*?)(?=<\/?\w+?\s?(?:\:?\w+=(?:"|'|{).+?(?:"|'|})\s?)*>|$)/g,
    attrReg = /(\:?\w+=((".+?")|({.+?})|('.+?'))\s?)/g,
    bindAttReg = /(\:\w+)|(\{\{.+?\}\})/,
    expBindReg = /\+|-|\?|!|\*|\/|<|>|\[|\]/g,
    forReg = /(\w+)\s*in\s*(\w+)/,
    eventReg = /^\:((click)|(input)|(change)|(touchstart)|(touchmove)|(touchend)|(scroll)|(blur)|(focus)|(keydown)|(keypress)|(keyup)|(load)|(mousedown)|(mousemove)|(mouseout)|(mouseover)|(mouseup)|(select)|(submit))$/;

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
                if (stack.pop().trim() !== cloTagName.trim()) throw new Error('template parse Error!');
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
    return `with(scope){` +
        `return ${genExp(hObj)}` +
        `}`;
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
        forExp = '',
        classObj = '{}',
        events = '{';

    if ($.isEmptyArr(attrArr) || $.isVoid(attrArr)) {
        resAtt += '}';
    } else {
        for (let i = 0, tmp = []; i < attrArr.length; i++) {
            //todo  optimize
            tmp = attrArr[i].split('=');
            tmp[1] = tmp.slice(1).join('=');
            if (bindAttReg.test(tmp[1]) || bindAttReg.test(tmp[0])) {
                tmp[1] = repBrace(tmp[1]);
                dyn += `\"${tmp[0]}\": ${tmp[1]},`;
            } else {
                stat += `\"${tmp[0]}\":${tmp[1]},`;
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
            if(tmp[0] == ':class') {
                classObj = repQuo(tmp[1]);
            }

            //model
            if(tmp[0] == ':model') {
                dyn += `"value":${repQuo(tmp[1])},`;
            }

            //events
            if(eventReg.test(tmp[0])) {
                events +=  `"${repCol(tmp[0])}": ${repQuo(tmp[1])},`;
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
                return `_c(\"${tName}\",${resAtt}, ${type}, !!(${shouldRender}) ,${classObj}, ${events}, [${genChildren(children)}])`;
            } else {
                return genForExp(hObj, forExp);
            }
        case 2:
            text = parseText(hObj.text);
            return `_ct(${text}, 2)`;
        default:
            return `_c(\"div\", {}, 1 ,true, {}, {}, [])`;
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

    return `_cm(${arr}, function(${ita}, $index){` +
        `return ${genExp(hObj, true)}` +
        `})`;
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
            return `(function(){ return ${txt}})()`;
        } else {
            return txt;
        }
    } else {
        return `\"${txt}\"`;
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

export {
    parseHTML,
    genVnodeExp
}