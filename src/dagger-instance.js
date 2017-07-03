import $ from "./query";
import {render} from "./render";

class Dagger{
    constructor(options) {
        this._data = options.data;
        this._options = options;
        self = this;

        Object.keys(options.data).forEach((key) => {
            self._proxy(key);
        });

        let dgObj = render(options.template, options.el, options.data);

        this._vDom = dgObj.vDom;
        this._vExp = dgObj.vExp;
        this._el = dgObj.conEle;
    }

    _proxy(key) {
        let self = this;
        $.defProp(this, key, () => {
            return self._data[key];
        }, (newV) => {
            self._data[key] = newV;
        })
    }
}

Dagger.render = render;
Dagger.$ = $;

export default Dagger;