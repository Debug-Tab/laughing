/**
 * **********************************
 * 函数名: vim
 * 功能: 编辑文件
 * **********************************
 * @param {Array} argv - 参数(文件路径)
 * @returns {String} - HTML文本
 */

if (argv.length != 1) {
    throw new ParameterError(`vim expects 1 arguments.`);
}

// 通过判断后缀来实现高亮
let extensions = {
    md: "markdown",
    py: "python",
    txt: "null",
};

let filePath = new Path(argv[0]);
let mode = filePath.extName; // 获取后缀

mode = mode in extensions ? extensions[mode] : "null"; // 获取模式

console.log(mode);

// 设置保存函数
CodeMirror.commands.save = function (e) {
    terminal.setAttribute("style", "");
    System.writeData(filePath, editor.getValue(), false);
    $(".CodeMirror").remove();
    Terminal.refocus();
};

// 获取需读取的文件内容
let fileContent = System.getData(filePath, true, true);

let editor = CodeMirror(document.body, {
    value: fileContent,
    lineNumbers: true,
    mode: mode,
    keyMap: "vim",
    matchBrackets: true,
    showCursorWhenSelecting: true,
    inputStyle: "contenteditable",
    theme: "ayu-mirage",
});
editor.focus();

// 隐藏终端界面
terminal.setAttribute("style", "display:none;");

return "<br>";
