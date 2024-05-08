/**
 * **********************************
 * 函数名: ls
 * 功能: 列举目录与文件
 * **********************************
 * @param {Array} argv - 参数(路径)
 * @returns {String} - HTML文本
 */

function ls(argv) {
	let d = getData(dir, (argv.length == 0)?directory:getRealPath(argv[0]));
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