/*
 * A simple template engine with two-way data bindings.
 *
 * */
import {render, $} from './dagger';

let a = {
    text1: 'text1',
    text2: 'text2',
    num1: 1,
    num3: 3,
    arr:  [1,2,3,4]
};
render('templates/test.html', 'test1', a);

let b = {
    text1: 'mmmmmmmmmmmmm',
    text2: 'ccccccccccccc',
    num1: 10,
    num3: 30
}

// render('templates/test.html', 'test2', b)

// setInterval( ()=> {
//     a.num3++;
// }, 1000);
//
// setInterval(()=> {
//     b.num3++;
// }, 2000)
