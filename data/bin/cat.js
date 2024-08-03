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

let path = new Path(argv[0]);
let text = System.getData(path, false, true);

if (text === -1) {    // 如果目标不存在
    throw new FileError(`No such file or directory.`);
}

return `<span style="white-space: pre;">${text}</span>`;
