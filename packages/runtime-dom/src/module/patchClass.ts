export default function patchClass(el, value) {
    if (value == null) {
        el.removeAttribute("class"); // 移除class
    } else {
        el.className = value;
    }
}
