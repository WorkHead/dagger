/*
 * A simple template engine with two-way data bindings.
 *
 * */
// import {render, $} from '../src/dagger';

// let a = {
//     text1: 'text1',
//     text2: 'text2',
//     num1: 2,
//     num3: 3,
//     arr:  [1,2,3,4],
//     obj: {
//         qq: 1,
//         bb: {
//             cc: 2
//         }
//     },
//     dd: 'dddddddd',
//     ckck: function () {
//         console.log('ckck');
//     }

// };
// render('templates/test.html', 'test1', a);

// setTimeout(() => {
//     a.arr.push(100)
// }, 1000);

// setTimeout(() => {
//     a.text1 = 'bbbbbbbbbbbbbbb';
// }, 2000);


var a = {
    text1: 'text1',
    text2: 'text2',
    num1: 2,
    num3: 3,
    arr:  [1,2,3,4],
    obj: {
        qq: 1,
        bb: {
            cc: 2
        }
    },
    dd: 'dddddddd',
    ckck: function () {
        console.log('ckck');
    }
}

Dagger.render('templates/test.html', 'test1', a);

setTimeout(() => {
    a.arr.push(100)
}, 1000);

setTimeout(() => {
    a.text1 = 'bbbbbbbbbbbbbbb';
}, 2000);