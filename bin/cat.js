/**
 * **********************************
 * 函数名: cat
 * 功能: 输出文件内容
 * **********************************
 * @param {Array} argv - 参数(文件路径)
 * @returns {String} - HTML文本
 */

function cat(argv) {
    if (argv.length == 0) {
        return `<span style="color: red">${SyntaxError(languageData['parameterError'][language])}</span><br>`;
    }

    let p = getRealPath(argv[0]);
    let text = getData(dir, p, false, true);
    Output(`<span style="white-space: pre;">${text}</span>`);
    return ``;
}