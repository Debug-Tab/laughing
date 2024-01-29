/**
 * **********************************
 * 函数名: clear
 * 功能: 清空控制台输出
 * **********************************
 * @param {Array} argv - 参数(无)
 * @returns {String} - HTML文本
 */

function clear(argv) {
    var child = terminal.firstChild;
    var last = terminal.lastChild;
    var t;
    while (child != last) {
        t = child;
        child = child.nextSibling;
        if (t.tagName != "INPUT" && t.tagName != "SCRIPT") t.remove();
    }
    return "";
}
