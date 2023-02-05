function cat(argv) {
    let p = getRealPath(argv[0]);
    let text = getData(dir, p, false, true)['data'];
    return `<span style="white-space: pre;">${text}</span><br>`;
}