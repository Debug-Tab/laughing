/**
 * **********************************
 * 函数名: mkdir
 * 功能: 创建文件夹
 * **********************************
 * @param {Array} argv - 参数(路径)
 * @returns {String} - HTML文本
 */

if (argv.length != 1) {
    throw new ParameterError(`mkdir expects 1 arguments.`);
}

System.getData(System.storedData, Terminal.getRealPath(argv[0]), true, false);
return "";