/**
 * **********************************
 * 函数名: copy
 * 功能: 复制文件
 * **********************************
 * @param {Array} argv - 参数(源文件路径，目标文件路径)
 * @returns {String} - HTML文本
 */

if (argv.length != 2) {
    throw new ParameterError(`copy expects 2 arguments.`);
}

let source = new Path(argv[0]);
let target = new Path(argv[1]);

let content = System.getData(source, true, true);
if (target.exist) {
    console.log(target.path.concat(source.name), content);
    System.writeData(target.path.concat(source.name), content);
} else {
    System.writeData(target, content);
}

return `<br>`;
