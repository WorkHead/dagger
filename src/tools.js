/**
 * Created by tanjiasheng on 2017/5/4.
 */
const _t = {
    toString(obj) {
        return Object.prototype.toString.call(obj);
    },
    isArray(obj) {
        return this.toString(obj) === '[object Array]';
    },
    isObject(obj) {
        return this.toString(obj) === '[object Object]';
    },
    isNumber(obj) {
        return this.toString(obj) === '[object Number]';
    },
    isString(obj) {
        return this.toString(obj) === '[object String]';
    },
    isFunction(obj) {
        return this.toString(obj) === '[object Function]';
    },
    isElement(obj) {
        let eleReg = /\[object HTML(?:\w+?)Element\]/,
            str = this.toString(obj);
        return eleReg.test(str) || str === '[object DocumentFragment]' || str === '[object Text]';
    },
    isVoid(obj) {
        return obj === null || obj === void 0 || obj !== obj;
    },
    isArrayLike(obj) {
        return this.isArray(obj) || (!this.isVoid(obj) && !this.isVoid(obj.length) && !this.isVoid(obj[obj.length - 1]));
    },
    isEmptyStr(str) {
        return this.isString(str) && str == '';
    },
    isEmptyArr(arr) {
        return this.isArray(arr) && arr.length === 0;
    },
    callFun(fun, ctx) {
        let args = arguments,
            argArr = args[2];
        return fun.apply(ctx, this.isArrayLike(argArr)
            ? argArr
            : Array.prototype.slice.call(args, 2));
    },
    each(arr, cb) {
        if (this.isArrayLike(arr)) {
            for (let i = 0; i < arr.length; i++) {
                this.callFun(cb, arr[i], [arr[i], i, arr]);
            }
        } else if (this.isObject(arr)) {
            for (let o in arr) {
                if (arr.hasOwnProperty(o)) {
                    this.callFun(cb, arr[o], [arr[o], o]);
                }
            }
        }
    },
    dMap(arr, cb) {
        let resArr = new Array(arr.length);
        if (this.isArrayLike(arr)) {
            for (let i = 0; i < arr.length; i++) {
                resArr[i] = this.callFun(cb, arr[i], [arr[i], i, arr]);
            }
        } else if (this.isObject(arr)) {
            for (let o in arr) {
                if (arr.hasOwnProperty(o)) {
                    resArr[o] = this.callFun(cb, arr[o], arr[o]);
                }
            }
        }
        return resArr;
    },
    extend(tar, obj) {
        for (let p in obj) {
            tar[p] = obj[p];
        }
        return tar;
    },
    http(opts = {}) {
        let url = opts.url,
            method = opts.method || 'get',
            data = opts.data,
            success = opts.success,
            fail = opts.fail,
            client = new XMLHttpRequest(),
            responseType = opts.resType || 'text';

        if (method == 'get' && !_t.isVoid(data)) {
            url += /\?/.test(url) ? '&' + data : '?' + data;
            data = null;
        }

        client.open(method, url, true);
        client.onreadystatechange = handler;

        try {
            client.responseType = responseType;
        } catch (err) {
            client.setRequestHeader('responseType', responseType);
        }
        client.setRequestHeader("Content-Type", opts.contentType || "application/x-www-form-urlencoded;charset=utf-8");
        client.send(data);

        function handler() {
            let response;
            if (client.readyState !== 4) {
                return;
            }
            if (client.status === 200) {
                response = client.response;
                if (responseType == 'json') {
                    _t.isString(response) && (response = JSON.parse(response));
                }
                success(response);
            } else {
                fail(new Error(client.statusText));
            }
        };
    },
    defProp(obj, key, getter, setter) {
        return (this.isFunction(getter) && this.isFunction(setter)) ? Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                set: setter,
                get: getter
            }) : Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: getter
            });
    }
};

export default _t;