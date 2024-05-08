/**
 * **********************************
 * 函数名: refresh
 * 功能: 刷新data.json
 * **********************************
 * @param {Array} argv - 参数(无)
 * @returns {String} - HTML文本
 */

function refresh(argv) {
    getJson();
    directory = [];
    return `<span>${languageData['updateData'][language]}</span><br>`;
}
