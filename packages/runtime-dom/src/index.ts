import { nodeOps } from "./nodeOps";
import patchProp from "./patchProp";
import { createRenderer } from "@vue/runtime-core";

const renderOptions = Object.assign({patchProp}, nodeOps); // 将节点操作和属性操作合并在一起

// render方法采用domapi来进行渲染
export const render = (vnode, container) => {
    return createRenderer(renderOptions).render(vnode, container);
};

export * from "@vue/runtime-core";
