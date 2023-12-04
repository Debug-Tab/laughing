function ls(argv) {
    if (argv.length != 0) {
        let d = getData(dir, getRealPath(argv[0]));
    }
    else { let d = getData(dir, directory); }

    let dirList = [], fileList = [];
    for (let key in d) {
        if (typeof d[key] == typeof {}) {
            dirList.push(key);
        } else {
            fileList.push(key);
        }
    }
    console.log(dirList, fileList);
    return `<span style="color: yellow">${dirList.join(" ")}</span>
            <span style="color: deepskyblue">${fileList.join(" ")}</span><br>`;
}