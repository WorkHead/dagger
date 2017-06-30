/**
 * Created by tanjiasheng on 2017/6/13.
 */
import {render, $} from '../src/dagger'

function init() {
    let defTmp = '<div id="test" class="123" :if="num1 > 1" :click="ckck">\n'+
                '    <p class="cbd">{{text1}}</p>\n'+
                '</div>\n'+
                '<p :if="num1 <= 1">aaaaaaaaaaaaaaaa123123123</p>\n'+
                '<div :class="{\'test\': num1 > 1, \'test1\': num1 < 1}">{{text2}}</div>\n'+
            '<p :for="a in arr"  :if="a > 1">\n'+
            '    <span>{{$index + \':\'}}</span><span>{{a}}</span>\n'+
            '</p>\n'+
            '<span>{{dd}}</span>\n'+
            '<input :model="dd"></input>\n';

    let scopeStr = '{\n'+
        '   text1: \'text1\',\n'+
        '   text2: \'text2\',\n'+
        '   num1: 2,\n'+
        '   num3: 3,\n'+
        '   arr:  [1,2,3,4],\n'+
        '   obj: {\n'+
        '       qq: 1,\n'+
        '       bb: {\n'+
        '           cc: 2\n'+
        '       }\n'+
        '   },\n'+
        '   dd: \'dddddddd\',\n'+
        '   ckck: function () {\n'+
        '       console.log(\'ckck\');\n'+
        '   }\n'+
    '}\n';

    $('.template').getEl()[0].innerHTML = defTmp;
    $('.scope').getEl()[0].innerHTML = scopeStr;
    $('.run').getEl()[0].addEventListener('click', run);
    run();
}

function run() {
    let template =  $('.template').getEl()[0].value,
        scope = new Function(`return ${$('.scope').getEl()[0].value}`).call(null);

    render(template, 'result', scope)
}

init();