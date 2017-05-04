/**
 * Created by tanjiasheng on 2017/5/4.
 */

import $ from './myQuery';

const DOC = window.document;

function render(tpl, ct) {
}

function Dagger() {
    return {
        render: render
    }
}


window.$ = $;
console.log(2123);
export default new Dagger()
