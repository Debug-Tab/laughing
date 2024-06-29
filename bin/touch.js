/**
 * **********************************
 * 函数名: touch
 * 功能: 创造文件
 * **********************************
 * @param {Array} argv - 参数(文件路径)
 * @returns {String} - HTML文本
 */

if (argv.length != 1) {
    throw new ParameterError(`touch expects 1 arguments.`);
}

System.getData(System.storedData, Terminal.getRealPath(argv[0]), true, true);
return ``;