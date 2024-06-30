import { isObject } from "@mini-vue3/shared";
import { mutableHandlers } from "./baseHandler";
import { ReactiveFlags } from "./constants";

const reactiveMap = new WeakMap(); // 用于记录代理后的结果，可以复用

function createReactiveObject(target) {
    // 统一做判断，响应式对象必须是对象才可以
    if (!isObject(target)) {
        return target;
    }
    // proxy给响应式对象设置IS_REACTIVE拦截，读取时返回true，避免重复代理一个响应式对象
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target; // 传入的是响应式对象，不需要再次代理，直接返回
    }
    const exitsProxy = reactiveMap.get(target); // 取缓存，如果有直接返回，避免同一普通对象代理两次
    if (exitsProxy) {
        return exitsProxy;
    }
    let proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy); // 根据对象缓存代理后的结果
    return proxy;
}

export function reactive(target) {
    return createReactiveObject(target);
}

export function toReactive(value) {
    return isObject(value) ? reactive(value) : value;
}

export function isReactive(value) {
    return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}
