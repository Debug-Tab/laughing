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

path = new Path(argv[0]);
path.touch(true);

return ``;
