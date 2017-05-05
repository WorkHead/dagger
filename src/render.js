/**
 * Created by tanjiasheng on 2017/5/5.
 */
import $ from './myQuery';
import {parseHTML} from './parser'

const urlReg = /^.?(\/?.+)+\w+\.\w+$/;

function render(tpl, cfg) {
    if (urlReg.test(tpl)) {
        $.http({
            url: tpl,
            success(data) {
                if(!$.isVoid(data)) {
                    parseHTML(data)
                }
            }
        })
    }
}



export default render;