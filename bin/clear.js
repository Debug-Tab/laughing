/**
 * **********************************
 * 函数名: clear
 * 功能: 清空控制台输出
 * **********************************
 * @param {Array} argv - 参数(无)
 * @returns {String} - HTML文本
 */

$("#terminal > *").each(
    (_i, e) => {
        if (e.tagName != "INPUT" && e.tagName != "SCRIPT")
            e.remove();
    }
);
return "";