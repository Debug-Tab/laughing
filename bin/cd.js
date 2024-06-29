/**
 * **********************************
 * 函数名: cd
 * 功能: 切换到指定目录(修改全局变量directory)
 * **********************************
 * @param {Array} argv - 参数(路径)
 * @returns {String} - HTML文本
 */
if (argv.length != 1) {
    throw new ParameterError(`cd expects 1 arguments.`);
}

// 获取需切换目录的信息，主要用于判断是否存在
let path = Terminal.getRealPath(argv[0]);
let pathData = System.getData(System.storedData, path);


if (pathData == -1) {    // 如果目标不存在
    throw new FileError(`No such file or directory.`);
} else if (pathData == -2) {   // 如果目标为文件
    throw new FileError(`${argv[0]} is not a folder.`);
} else {
    Terminal.setWorkPath(path);
    return "";
}
