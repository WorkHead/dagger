/**
 * Created by tanjiasheng on 2017/5/4.
 */
import _t from "./tools";


function Query(selector) {
    this.el = {};
    _t.isString(selector) && (this.el = document.querySelectorAll(selector));
    _t.isElement(selector) && (this.el = selector);
}


Query.prototype = {
    constructor: Query,

    val(val) {
        if ($.isVoid(val)) {
            return this.el[0] && (this.el[0].value || '');
        }
        $.each(this.el, (e) => {
            e.value = val;
        });
        return this;
    },
    attr(key, value) {
        if ($.isVoid(value)) {
            return this.el[0] && (this.el[0].getAttribute(key) || '');
        }
        $.each(this.el, (e) => {
            e.setAttribute(key, value);
        });
        return this;
    },
    getEl() {
        return $.isArrayLike(this.el) ? this.el : null;
    },
    addClass(str) {
        if ($.isArrayLike(this.el)) {
            $.each(this.el, (e) => {
                if (!$(e).hasClass(str)) {
                    e.className += e.className.length > 0 ? ' ' + str : str;
                }
            });
        } else /*if($.isElement(this.el))*/ {
            this.el.className += this.el.className.length > 0 ? ' ' + str : str;
        }
    },
    removeClass(str) {
        if ($.isArrayLike(this.el)) {
            $.each(this.el, (e) => {
                if ($(e).hasClass(str)) {
                    e.className.indexOf(str) == 0 ? e.className = e.className.replace(str, '') : e.className = e.className.replace(' ' + str, '');
                }
            });
        } else /*if($.isElement(this.el))*/ {
            this.el.className.indexOf(str) == 0 ? this.el.className = this.el.className.replace(str, '') : this.el.className = this.el.className.replace(' ' + str, '');
        }
    },
    hasClass(str) {
        if ($.isElement(this.el)) {
            return this.el.className.indexOf(str) > -1
        }
    }
};

function $(selector) {
    return new Query(selector);
}

_t.extend($, _t);

export default $;