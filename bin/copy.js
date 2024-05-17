/**
 * **********************************
 * 函数名: copy
 * 功能: 复制文件
 * **********************************
 * @param {Array} argv - 参数(源文件路径，目标文件路径)
 * @returns {String} - HTML文本
 */

function copy(argv) {
    let content = sys.getData(sys.storedData, getRealPath(argv[0]), true, true);
    sys.writeData(getRealPath(argv[1]), content);
    return `<br>`;
}
