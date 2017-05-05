/**
 * Created by tanjiasheng on 2017/5/4.
 */
import _t from './tools';
import  $ from './myQuery';

const tagReg = /((?:\s|&[a-zA-Z]+;|<!\-\-@|[^<>]+)*)(<?(\/?)([^!<>\/\s]+)(?:\s*[^\s=\/>]+(?:="[^"]*"|='[^']*'|=[^'"\s]+|)|)+\s*\/?>?)(?:\s*@\-\->)?/g;

function parseHTML(html) {
    
    return html;
}


export {parseHTML}