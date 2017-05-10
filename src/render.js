/**
 * Created by tanjiasheng on 2017/5/5.
 */
import $ from './myQuery';
import {parseHTML, genVnodeExp} from './parser';
import {createVNode as _c} from './vDom';

const urlReg = /^.?(\/?.+)+\w+\.\w+$/;

function render(tpl, elem, scope) {
    if (urlReg.test(tpl)) {
        $.http({
            url: tpl,
            success(data) {
                if(!$.isVoid(data)) {
                    let hObj = parseHTML(data);
                    let vNodeExp = genVnodeExp(hObj)
                    console.log(vNodeExp)
                }
            }
        });
    }
}

function genVnodeObj(exp) {

}

export default render;