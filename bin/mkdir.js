/**
 * **********************************
 * 函数名: mkdir
 * 功能: 创建文件夹
 * **********************************
 * @param {Array} argv - 参数(路径)
 * @returns {String} - HTML文本
 */

function mkdir(argv) {
    if (argv.length == 0) {
        return `<span style="color: red">${SyntaxError(languageData['parameterError'][language])}</span><br>`;
    }
    else if (argv.length == 1) {
        argv = argv[0];
    }

    getData(dir, getRealPath(argv), true, false);
    return "";
}