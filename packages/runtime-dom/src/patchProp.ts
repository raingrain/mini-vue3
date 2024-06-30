import patchAttr from "./module/patchAttr";
import patchClass from "./module/patchClass";
import patchEvent from "./module/patchEvent";
import patchStyle from "./module/patchStyle";

// 主要是对节点元素的属性操作 class style event 普通属性
export default function patchProp(el, key, prevValue, nextValue) {
    if (key === "class") {
        return patchClass(el, nextValue);
    } else if (key === "style") {
        return patchStyle(el, prevValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
        return patchEvent(el, key, nextValue);
    } else {
        return patchAttr(el, key, nextValue);
    }
}
