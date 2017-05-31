/**
 * Created by tanjiasheng on 2017/5/4.
 */

import _t from './tools';


function Query(selector) {
    this.el = {};
    _t.isString(selector) && (this.el = document.querySelectorAll(selector));
    _t.isElement(selector) && (this.el = selector);
}


Query.prototype = {
    constructor: Query,

    val(val) {
        if (_t.isVoid(val)) {
            return this.el[0] && (this.el[0].value || '');
        }
        _t.each(this.el, (e) => {
            e.value = val;
        });
        return this;
    },
    attr(key, value) {
        if (_t.isVoid(value)) {
            return this.el[0] && (this.el[0].getAttribute(key) || '');
        }
        _t.each(this.el, (e) => {
            e.setAttribute(key, value);
        });
        return this;
    },
    getEl() {
        return $.isArrayLike(this.el)? this.el: null;
    }
};

function $(selector) {
    return new Query(selector);
}

_t.extend($, _t);

export default $;