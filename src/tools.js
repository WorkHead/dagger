/**
 * Created by tanjiasheng on 2017/5/4.
 */
const _t = {
    toString(obj) {
        return Object.prototype.toString.call(obj)
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
    isVoid(obj) {
        return obj === null || obj === void 0 || obj !== obj;
    },
    isArrayLike(obj) {
        return this.isArray(obj) || (!this.isVoid(obj.length) && !this.isVoid(obj[obj.length - 1]));
    },
    callFun(fun, ctx) {
        let args = arguments,
            argArr = args[2];
        return fun.apply(ctx, this.isArrayLike(argArr)
            ? argArr
            : Array.prototype.slice.call(args, 2));
    },
    each(arr, cb) {
        if(this.isArrayLike(arr)) {
            for(let i = 0; i < arr.length; i++) {
                this.callFun(cb, arr[i], [arr[i], i, arr]);
            }
        } else if(this.isObject(arr)) {
            for (let o in arr) {
                if(arr.hasOwnProperty(o)) {
                    this.callFun(cb, arr[o], arr[o]);
                }
            }
        }
    }
}

export default _t;