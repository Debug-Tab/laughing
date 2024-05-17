/**
 * **********************************
 * 函数名: cl
 * 功能: 切换语言
 * **********************************
 * @param {Array} argv - 参数(语言名称)
 * @returns {String} - HTML文本
 */

function cl(argv) {
    if (argv[0] in languageName) {
        sys.setVar("language", argv[0]);
        return ``;
    }
    else return `<span style="color: red">Can not find the language named ${argv[0]}</span><br>`;
}
