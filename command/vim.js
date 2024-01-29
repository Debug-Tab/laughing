function vim(argv) {
    if (argv.length == 0) {
        return `<span style="color: red">${SyntaxError(languageData['parameterError'][language])}</span><br>`;
    }
    
    //通过判断后缀来实现高亮
    let extensions = {
        'md': 'markdown',
        'py': 'python',
        'txt': 'null'
    };

    let mode = argv[0].split(".").slice(-1)[0]; //获取后缀
    mode = (mode in extensions) ? extensions[mode] : "null"; //获取模式

    console.log(mode);

    let filePath = getRealPath(argv[0])
    //设置保存函数
    CodeMirror.commands.save = function (e) {
        terminal.setAttribute("style", "");
        getData(dir, filePath, true, true);
        let dPath = filePath.slice(0, -1);
        console.log(dPath, getData(dir, dPath), filePath);
        getData(dir, dPath)[filePath[filePath.length-1]] = editor.getValue();
        $(".CodeMirror").remove();
    };

    //获取需读取的文件内容
    let fileContent = getData(
        dir,
        filePath,
        true,
        true
    );

    let editor = CodeMirror(
        document.body,
        {
            value: fileContent,
            lineNumbers: true,
            mode: mode,
            keyMap: "vim",
            matchBrackets: true,
            showCursorWhenSelecting: true,
            inputStyle: "contenteditable",
            theme: "ayu-mirage"
        }
    );
    editor.focus()

    //隐藏终端界面
    terminal.setAttribute("style", "display:none;");

    return "<br>"
}