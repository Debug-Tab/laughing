function ls(argv) {
    let Cdir = getData(dir, directory);
    let name = getAllName_Data(Cdir["data"]);
    let dirList = [], fileList = [];
    for (let t in name) {
        if (typeof name[t]["data"] == typeof []) {
            //dirList.push(name[t]);
            dirList.push(t);
        } else {
            //fileList.push(name[t]);
            fileList.push(t);
        }
    }
    console.log(dirList, fileList);
    return `<span style="color: yellow">${dirList.join(" ")}</span>
            <span style="color: deepskyblue">${fileList.join(" ")}</span><br>`;
}