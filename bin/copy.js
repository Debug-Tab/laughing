/**
 * **********************************
 * 函数名: copy
 * 功能: 复制文件
 * **********************************
 * @param {Array} argv - 参数(源文件路径，目标文件路径)
 * @returns {String} - HTML文本
 */

let content = sys.getData(sys.storedData, term.getRealPath(argv[0]), true, true);
sys.writeData(term.getRealPath(argv[1]), content);
return `<br>`;
