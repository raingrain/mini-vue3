import { isObject } from "@mini-vue3/shared";
import { createVnode, isVnode } from "./createVnode";

export function h(type, propsOrChildren?, children?) {
    let l = arguments.length;
    if (l === 2) {
        // h(h1, 虚拟节点|属性)
        if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
            // 虚拟节点
            if (isVnode(propsOrChildren)) {
                return createVnode(type, null, [propsOrChildren]); // h('div',h('a'))
            } else {
                return createVnode(type, propsOrChildren); // 属性
            }
        }
        // 儿子 是数组 | 文本
        return createVnode(type, null, propsOrChildren);
    } else {
        if (l > 3) {
            children = Array.from(arguments).slice(2);
        }
        if (l == 3 && isVnode(children)) {
            children = [children];
        }
        return createVnode(type, propsOrChildren, children);
    }
}
