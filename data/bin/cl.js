/**
 * **********************************
 * 函数名: cl
 * 功能: 切换语言
 * **********************************
 * @param {Array} argv - 参数(语言名称)
 * @returns {String} - HTML文本
 */
if (argv[0] in languageName) {
    System.setVar("language", argv[0]);
    return ``;
}

return `<span style="color: red">Can not find the language named ${argv[0]}</span><br>`;
