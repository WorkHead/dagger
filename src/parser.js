/**
 * Created by tanjiasheng on 2017/5/4.
 */
import  $ from './myQuery';

const tagReg = /<(\/?\w+?\s?)(\w+=(?:"|'|{).+?(?:"|'|})\s?)*>(?:\s*?\n*?\s*?)(.+?)??(?:\s*?\n*?\s*?)(?=<\/?\w+?\s?(?:\w+=(?:"|'|{).+?(?:"|'|})\s?)*>|$)/g,
    attrReg = /(\w+=(?:"|'|{).+?(?:"|'|})\s?)/;

function parseHTML(html) {
    let stack = [],
        match,
        resObj = {
            tName: 'root',
            attrs: '',
            children: [],
            parent: {}
        },
        parObj = {},
        curObj = resObj;
    while (match = tagReg.exec(html)) {
        let tagName = match[1],
            tagStr = match[0];
        if(!$.isVoid(tagName)) {
            if (!tagName.startsWith('/')) {
                stack.push(tagName);
                let _obj = {
                    tName: tagName,
                    attrs: tagStr,
                    children: [],
                    parent: curObj
                };
                curObj.children.push(_obj);
                parObj = curObj;
                curObj = _obj
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


export {parseHTML}