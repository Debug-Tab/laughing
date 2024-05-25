/**
 * **********************************
 * 函数名: cd
 * 功能: 切换到指定目录(修改全局变量directory)
 * **********************************
 * @param {Array} argv - 参数(路径)
 * @returns {String} - HTML文本
 */
if (argv.length != 1) {
    return `<span style="color: red">${SyntaxError(languageData['parameterError'][sys.getVar("language")])}</span><br>`;
}

// 获取需切换目录的信息，主要用于判断是否存在
let path = term.getRealPath(argv[0]);
let pathData = sys.getData(sys.storedData, path);


if (pathData == -1) {    // 如果目标不存在
    return `<span style="color: red">${languageData['error'][sys.getVar("language")] + languageData['notFound'][sys.getVar("language")]}</span><br>`;
} else if (pathData == -2) {   // 如果目标为文件
    return `<span style="color: red">${languageData['error'][sys.getVar("language")] + argv[0] + languageData['notFolder'][sys.getVar("language")]}</span><br>`
} else {
    term.setWorkPath(path);
    return "";
}
