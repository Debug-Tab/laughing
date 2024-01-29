function mkdir(argv) {
    if (argv.length == 0) {
        return `<span style="color: red">${SyntaxError(languageData['parameterError'][language])}</span><br>`;
    }
    
    getData(dir, getRealPath(argv[0]), true, false)
    return "";
}