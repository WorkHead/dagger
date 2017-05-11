/*
* A simple template engine with two-way data bindings.
*
* */
import {render, $} from './dagger';

render('templates/test.html', {}, {
    test: {
        text1: 'text1',
        text2: 'text2',
        num1: 1,
        num3: 3
    }
});
