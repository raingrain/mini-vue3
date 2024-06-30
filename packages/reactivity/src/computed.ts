import { isFunction } from "@mini-vue3/shared";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

// 实现原理：
// 1. 计算属性维护了一个dirty属性，默认就是true，稍后运行过一次会将dirty变为false，并且稍后依赖的值变化后会再次让dirty变为true
// 2. 计算属性也是一个effect，依赖的属性会收集这个计算属性，当前值变化后，会让computedEffect里面dirty变为true
// 3. 计算属性具备收集能力的，可以收集对应的effect，依赖的值变化后会触发effect重新执行

class ComputedRefImpl {
    public _value;
    public effect;
    public dep;

    constructor(getter, public setter) {
        // 我们需要创建一个effect来关联当前计算属性的dirty属性
        this.effect = new ReactiveEffect(
            () => getter(this._value), // 用户的fn
            () => {
                triggerRefValue(this); // 计算属性依赖的值变化了，我们应该触发渲染effect重新执行，依赖的属性变化后需要触发重新渲染，还需要将dirty变为true
            }
        );
    }

    get value() {
        // 让计算属性收集对应的effect
        // 这里我们需要做处理
        if (this.effect.dirty) {
            this._value = this.effect.run(); // 默认取值一定是脏的，但是执行一次run后就不脏了
            trackRefValue(this); // 如果当前在effect中访问了计算属性，计算属性是可以收集这个effect的
        }
        return this._value;
    }

    set value(v) {
        this.setter(v); // 这个就是ref的setter
    }
}

export function computed(getterOrOptions) {
    let onlyGetter = isFunction(getterOrOptions);
    let getter;
    let setter;
    if (onlyGetter) {
        getter = getterOrOptions;
        setter = () => {
        };
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter); // 计算属性ref
}
