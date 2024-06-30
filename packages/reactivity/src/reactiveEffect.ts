import { activeEffect, trackEffect, triggerEffects } from "./effect";

const targetMap = new WeakMap(); // 存放依赖收集的关系

export const createDep = (cleanup, key) => {
    const dep = new Map() as any; // 创建的收集器还是一个map
    dep.cleanup = cleanup; // 删除方法
    dep.name = key; // 自定义属性，标识这个映射表是给哪个属性服务的
    return dep;
};

export function track(target, key) {
    // 有activeEffect这个属性，说明这个key是在effect中访问的
    // 没有activeEffect这个属性，说明这个key是在effect之外访问的，不用进行收集
    if (activeEffect) {
        // 针对对象
        let depsMap = targetMap.get(target);
        // map里面没有，说明是新增的，应该往里放
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        // 针对对象中的key
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(
                key,
                (dep = createDep(() => depsMap.delete(key), key)) // 后面用于清理不需要的属性
            );
        }
        trackEffect(activeEffect, dep); // 将当前的effect放入到dep（映射表）中， 后续可以根据值的变化触发此dep中存放的effect
    }
}

export function trigger(target, key, newValue, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return; // 找不到对象 直接return即可
    }
    let dep = depsMap.get(key);
    if (dep) {
        triggerEffects(dep); // 修改的属性对应了effect
    }
}
