import { isObject } from "@vue/shared";
import { reactive } from "./reactive";
import { track, trigger } from "./reactiveEffect";
import { ReactiveFlags } from "./constants";

export const mutableHandlers: ProxyHandler<any> = {
    // 依赖收集
    get(target, key, recevier) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }
        track(target, key); // 当取值的时候，收集这个对象上的响应式属性，和effect关联在一起
        let res = Reflect.get(target, key, recevier); // 通过去代理对象recevier上取值，避免使用receive[key]陷入proxy的拦截死循环（不能在代理对象中访问代理对象的属性），即proxy需要搭配reflect来使用
        if (isObject(res)) {
            return reactive(res); // 当取的值也是对象的时候，我需要对这个对象在进行代理，递归代理
        }
        return res;
    },
    // 触发更新
    set(target, key, value, recevier) {
        let oldValue = target[key]; // 找到属性让对应的effect重新执行
        let result = Reflect.set(target, key, value, recevier);
        if (oldValue !== value) {
            trigger(target, key, value, oldValue); // 触发页面更新
        }
        return result;
    }
};
