/**
 * **********************************
 * 函数名: touch
 * 功能: 创造文件
 * **********************************
 * @param {Array} argv - 参数(文件路径)
 * @returns {String} - HTML文本
 */

function touch(argv) {
    getData(dir, getRealPath(argv[0]), true, true);
    return `<br>`;
}
