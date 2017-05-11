/**
 * Created by tanjiasheng on 2017/5/4.
 */
import  $ from './myQuery';
import {NODETYPES} from './types';

const tagReg = /<(\/?\w+?\s?)(\w+=(?:"|'|{).+?(?:"|'|})\s?)*>(?:\s*?\n*?\s*?)(.+?)??(?:\s*?\n*?\s*?)(?=<\/?\w+?\s?(?:\w+=(?:"|'|{).+?(?:"|'|})\s?)*>|$)/g,
    attrReg = /(\w+=(?:"|'|{).+?(?:"|'|})\s?)/g,
    bindAttReg = /\{\{.+?\}\}/,
    expBindReg = /\+|-|\?|!|\*|\/|<|>|\[|\]/g;

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
        if(!$.isVoid(tagName)) {
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
                if($.isString(innerText)) {
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
    console.log(resObj);
    return resObj;
}

function getAttr(str) {
    let res = str.match(attrReg);
    return $.isArray(res)? res.join('$$$'): '';
}

function genVnodeExp(hObj) {
    return 'with(scope){' +
                'return ' + genExp(hObj) +
            '}';
}

function genExp(hObj) {
    let type = hObj.type,
        attrs,
        children,
        text,
        tName;
    switch (type) {
        case 1:
            tName = hObj.tName.trim();
            attrs = parseAttr(hObj.attrs);
            children = hObj.children;
            return '_c(\"' + tName + '\",' + attrs + ', ' + type + ', [' + genChildren(children) + '])';
        case 2:
            text = parseText(hObj.text);
            return '_ct(' + text + ', 2)';
        default:
            return '_c(\"div\", {}, 1, [])';
    }
}

function genChildren(hObj) {
    return $.dMap(hObj, (o) => {
        return genExp(o);
    });
}

function parseAttr(attrs) {
    if($.isEmptyStr(attrs)) return '{}';
    let attrArr = attrs.split('$$$'),
        resAtt = '{',
        stat =  'stat: {',
        dyn = 'dyn: {';

    $.each(attrArr, (t) => {
        let tmp = t.split('=');
        if(bindAttReg.test(tmp[1])) {
            tmp[1] = repBrace(tmp[1]);
            if(expBindReg.test(tmp[1])) {
                dyn += tmp[0] + ': (function(){ return ' + tmp[1] + '})(),';
            } else {
                dyn += tmp[0] + ': ' + tmp[1] + ',';
            }
        } else {
            stat += tmp[0] + ':' + tmp[1] + ',';
        }
    });
    stat += '}';
    dyn += '}';
    resAtt += stat + ',';
    resAtt += dyn + '}';
    return resAtt;
}

function parseText(txt) {

    if(bindAttReg.test(txt)) {
        txt = repBrace(txt);
        if(expBindReg.test(txt)) {
            return '(function(){ return ' + txt + '})()';
        } else {
            return txt;
        }
    } else {
        return txt;
    }
}

function repBrace(str) {
    return str.replace(/\{|\}|\b/g, '');
}

export {
    parseHTML,
    genVnodeExp
}