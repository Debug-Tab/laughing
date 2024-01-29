function cat(argv) {
    if (argv.length == 0) {
        return `<span style="color: red">${SyntaxError(languageData['parameterError'][language])}</span><br>`;
    }
    
    let p = getRealPath(argv[0]);
    let text = getData(dir, p, false, true);
    Output(`<span style="white-space: pre;">${text}</span>`);
    return ``;
}