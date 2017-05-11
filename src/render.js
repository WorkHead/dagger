/**
 * Created by tanjiasheng on 2017/5/5.
 */
import $ from './myQuery';
import {parseHTML, genVnodeExp} from './parser';
import {createVNode as _c, createVTextNode as _ct} from './vDom';

const urlReg = /^.?(\/?.+)+\w+\.\w+$/;

let vNodeExp = '',
    vNodeFun;

function render(tpl, elem, scope) {
    if (urlReg.test(tpl)) {
        $.http({
            url: tpl,
            success(data) {
                if(!$.isVoid(data)) {
                    let vNode = genVnodeObj(data, scope);
                    console.log(vNode);
                }
            }
        });
    }
}

function genVnodeObj(data,scope) {
    let hObj = parseHTML(data);
    vNodeExp = genVnodeExp(hObj);
    console.log(vNodeExp);
    vNodeFun = new Function('_c','_ct', 'scope', vNodeExp);
    return vNodeFun(_c, _ct, scope);
}

function renderToDom(vdom) {

}

export default render;