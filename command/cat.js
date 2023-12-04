function cat(argv) {
    let p = getRealPath(argv[0]);
    let text = getData(dir, p, false, true);
    Output(`<span style="white-space: pre;">${text}</span>`);
    return ``;
}