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
        return `<span style="color: red">${SyntaxError(languageData['parameterError'][sys.getVar("language")])}</span><br>`;
    }

    let p = getRealPath(argv[0]);
    let text = sys.getData(sys.storedData, p, false, true);
    return `<span style="white-space: pre;">${text}</span>`;
}
