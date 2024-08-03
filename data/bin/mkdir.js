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

path = new Path(argv[0]);
path.touch(false);

return "";
