/**
 * **********************************
 * 函数名: cat
 * 功能: 输出文件内容
 * **********************************
 * @param {Array} argv - 参数(文件路径)
 * @returns {String} - HTML文本
 */

if (argv.length != 1) {
    throw new ParameterError(`cat expects 1 arguments.`);
}

let p = Terminal.getRealPath(argv[0]);
let text = System.getData(System.storedData, p, false, true);

return `<span style="white-space: pre;">${text}</span>`;