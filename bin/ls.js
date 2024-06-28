/**
 * **********************************
 * 函数名: ls
 * 功能: 列举目录与文件
 * **********************************
 * @param {Array} argv - 参数(路径)
 * @returns {String} - HTML文本
 */

let d = System.getData(System.storedData, (argv.length == 0)?Terminal.workPath: Terminal.getRealPath(argv[0]));
let dirList = [], fileList = [];

for (let key in d) {
    if (typeof d[key] == typeof {}) {
        dirList.push(key);
    } else {
        fileList.push(key);
    }
}
    
console.log(dirList, fileList);
return `<span style="color: yellow">${Object.keys(d).filter(function(key){return typeof d[key]=='object'}).join(" ")}</span>
        <span style="color: deepskyblue">${Object.keys(d).filter(function(key){return typeof d[key]=='string'}).join(" ")}</span><br>`;