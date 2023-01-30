/*********************************************/
/*    File name: main.js                     */
/*    Function: Command parsing, processing  */
/*    Last update: 2023.1.15                 */
/*    dependencies: jQuery                   */
/*********************************************/

//我是因为发现中文末尾对不齐才写了个英文的。。。

//**************************************
//    文件名: main.js
//    功能: 命令解析,处理
//    最后更新: 2023.1.15
//    依赖: jQuery
//**************************************


//**************************************
//    定义变量
//**************************************


//定义命令头，只有包含在里面的命令才会被执行
const cmd_head = ["help", "update", "cat", "ls", "cd", "clear", "mkdir", "vim"]

//定义当前路径分割后的数组
var directory = []

//目录json，包含所有文件(夹)的信息
var dir;

//定义主要元素
const terminal = $("#terminal")[0];
const input = $("#terminal-input")[0];
const html = $('body,html');

//定义当前URL，用于提示语
var host = window.location.hostname;
if (host == "") host = "localhost";

//当前语言
var language = "zh-cn";

//语言名称
languageName = {
    'zh-cn': ['中文', 'red'],
    'en-us': ['English', 'deepskyblue']
}

//多语言支持
var languageData = {
    'error': {
        'zh-cn': '错误: ',
        'en-us': 'Error: '
    },

    'tryCookie': {
        'zh-cn': '尝试从Cookie中读取文件数据',
        'en-us': 'Try to read the file data in cookie'
    },

    'tryCookieError': {
        'zh-cn': '错误: 无法从Cookie中读取到正确的文件数据\nCookie:\n',
        'en-us': 'Error: Unable to read the correct file data from the Cookie.\nCookie:\n'
    },

    'unableFind': {
        'zh-cn': '无法找到 ',
        'en-us': 'Unable to find '
    },

    'runCmd': {
        'zh-cn': '运行命令: ',
        'en-us': 'Run command: '
    },

    'argError': {
        'zh-cn': '传入参数数量应为',
        'en-us': 'The number of incoming parameters should be '
    },

    'notFound': {
        'zh-cn': '无法找到对应的文件或文件夹',
        'en-us': 'No such file or directory.'
    },

    'notFolder': {
        'zh-cn': '不是一个文件夹',
        'en-us': ' is not a folder.'
    },

    'updateData': {
        'zh-cn': '已成功更新Cookie缓存的data.json',
        'en-us': 'Successfully updated the data.json of the Cookie cache'
    }
}


//**************************************
//    主程序
//**************************************

function main() {
    //操控Cookie，使用Js-cookie(已在index.html中引入)
    if (Cookies.get('file') == undefined) {
        getJson();
    } else {
        try {
            console.log(languageData['tryCookie'][language])
            dir = JSON.parse(decodeURI(Cookies.get('file')));
        } catch (err) {
            console.log(languageData['tryCookieError'][language] + document.cookie);
            getJson();
        }
    }
    for (let i of document.getElementsByClassName("host")) {
        i.innerHTML = host;
    }

    let welcome = $("#welcome")[0]
    for (let k in languageName) {
        let temp = `<a 
                        href="javascript:void(0);" 
                        onclick="language='${k}'" 
                        style="color: ${languageName[k][1]}"
                    >${languageName[k][0]}</a>
                    <p>&nbsp;</p>`
        welcome.appendChild(parseHTML(temp))
    }

    input.addEventListener('blur', refocus);
    input.addEventListener('keydown', keydown);
}
main()

/**
 * **********************************
 * 函数名: getJson
 * 功能: 通过ajax获取data.json
 * **********************************
 */
function getJson() {
    $.ajax({
        url: "../data.json",
        type: "GET",
        dataType: "json",
        success:
            function (data) {
                //console.log(data);
                dir = data;
                Cookies.set('file', JSON.stringify(dir));
            }
    });

}


/**
 * **********************************
 * 函数名: run
 * 功能: 获取输入并执行命令
 * **********************************
 * @returns {string} - 函数(命令)运行后返回的HTML字符串
 */
function run() {
    //获取输入的数值
    let script = input.value;
    if (script == "") return "";

    //在输入框前加入输入的内容
    terminal.insertBefore(parseHTML(`<span>${script}</span>`), input);

    //清空输入框
    input.value = "";

    //按空格分割
    script = script.split(" ");

    //去除空字符串
    script = script.filter((x) => x !== '');

    //输出
    console.log(languageData['runCmd'][language] + script);

    //忽略sudo
    if (script[0] == "sudo") script = script.slice(1);

    //如果命令不存在
    if (!cmd_head.includes(script[0]) || !script) {
        return `
            <span style="color: red">
                ${languageData['error'][language] + languageData['unableFind'][language] + script[0]}
            </span><br>`;
    }

    try {
        return new Function(`return ${script[0]}(${JSON.stringify(script.slice(1))})`)();
        //return eval(`${script[0]}(script.slice(1))`);
    } catch (err) {
        return `<span style="color: red">${err}</span><br>`
    }
}


/**
 * **********************************
 * 函数名: parseHTML
 * 功能: 将传入的字符串解析为HTML对象
 * **********************************
 * @param {String} html - 需转换的HTML字符串
 * @returns {Object} - 转换后的HTML对象
 */
function parseHTML(html) {
    let t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}


/**
 * **********************************
 * 函数名: refocus
 * 功能: 在失去焦点时再次获取焦点(用于输入框，暂时停用)
 * **********************************
 */
function refocus() {
    let that = this;
    setTimeout(function () {
        //document.getElementById("terminal-input").focus();
    }, 100);

}


/**
 * **********************************
 * 函数名: Render
 * 功能: 在执行命令后渲染新的提示符
 * **********************************
 * @param {String} tag - 运行命令后返回的HTML字符串
 */
function Render(tag) {
    //合并输出内容
    let temp = `
        <br>${tag}
        <span class="prefix">[<span id="usr">usr</span>@<span class="host">${host}</span> <span
        id="directory">${"/" + directory.join("/")}</span>]<span id="pos">$</span></span>`;

    let div = parseHTML(temp); //解析字符串为HTML
    terminal.insertBefore(div, input);
    html.animate({scrollTop: $(document).height()}, 0);
}


/**
 * **********************************
 * 函数名: keydown
 * 功能: 处理按键
 * **********************************
 */
function keydown(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        Render(run());
        Cookies.set('file', JSON.stringify(dir));
    }
}


/**
 * **********************************
 * 函数名: getData
 * 功能: 获取相应路径的对象
 * **********************************
 * @param {Object} d - 解析的来源，大部分时候是全局变量dir，仅为方便递归
 * @param {Array} path - 需要获取的路径分割后的数组，仅可为绝对路径(可使用getRealPath来将相对路径转为绝对路径)
 * @param {boolean} noPath - 如果为真，表示可能不存在此路径，需创建
 * @param {boolean} file - 是否为文件
 */
function getData(d, path, noPath = false, file = false) {
    //console.log([d,path]);
    if (path.length == 0) return dir;
    let name = getAllName(d["data"]);

    if (name.includes(path[0])) { //如果存在目标文件
        let l = name.indexOf(path[0]);
        console.log(name);
        if ((typeof d["data"][l]["data"] == typeof []) || file) {
            return path.length == 1 ? d["data"][l] : getData(d["data"][l], path.slice(1), noPath, file);
        }
        console.log(file)
        return -2;
    }
    if (noPath) {
        let data = {
            "name": path.slice(-1)[0],
            "data": file ? "" : [] //如果是文件则data为字符串
        };
        d["data"].push(data); //在最后添加

        return d["data"][d["data"].length-1];
    }
    return -1;

}


/**
 * **********************************
 * 函数名: getRealPath
 * 功能:将相对路径及字符串转为绝对路径
 * **********************************
 * @param path - 需转换的字符串或数组
 * @returns {Array} - 转换后的数组
 */
function getRealPath(path) {
    if (typeof path == typeof "") {
        //相对路径
        if (path[0] != "/") {
            path = directory.concat(path.split("/"));
        } else {
            path = path.split("/")
        }
        path = path.filter((x) => x !== '');
    }


    while (path.includes("..")) {
        path.splice(path.indexOf("..") - 1, 2);
    }
    return path;
}


/**
 * **********************************
 * 函数名: getAllName_Data
 * 功能: 获取传入的data中所有文件(夹)的名字及其数据
 * **********************************
 * @param {Array} data - 文件夹数据中的Data
 * @returns {Object} - 字典，key对应名字，value对应数据
 */
function getAllName_Data(data) {
    let name = {};
    for (let l = 0; l < data.length; l++) {
        name[data[l]["name"]] = data[l];
    }
    return name;
}

/**
 * **********************************
 * 函数名: getAllName
 * 功能: 获取传入的data中所有文件(夹)的名字
 * **********************************
 * @param {Array} data - 文件夹数据中的Data
 * @returns {Array} - 有序数组，所有文件(夹)的名字
 */
function getAllName(data) {
    let name = [];
    for (let l = 0; l < data.length; l++) {
        name.push(data[l]["name"]);
    }
    return name;
}


/**
 * **********************************
 * 函数名: cd
 * 功能: 尝试切换到指定目录(修改全局变量directory)
 * **********************************
 * @param {Array} argv - 参数
 * @returns {String}
 */
function cd(argv) {
    if (argv.length != 1) {
        return `<span style="color: red">${languageData['error'][language] + languageData['argError'][language] + "1"}</span><br>`
    }

    //获取需切换目录的信息，主要用于判断是否存在
    let path = getRealPath(argv[0]);
    let pathData = getData(dir, path);


    if (pathData == -1) {    //如果目标不存在
        return `<span style="color: red">${languageData['error'][language] + languageData['notFound'][language]}</span><br>`;
    } else if (pathData == -2) {   //如果目标为文件
        return `<span style="color: red">${languageData['error'][language] + argv[0] + languageData['notFolder'][language]}</span><br>`
    } else {
        directory = path;
        return "";
    }
}


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

function clear(argv) {
    var child = terminal.firstChild;
    var last = terminal.lastChild;
    var t;
    while (child != last) {
        t = child;
        child = child.nextSibling;
        if (t.tagName != "INPUT" && t.tagName != "SCRIPT") t.remove();
    }
    return "";
}


function cat(argv) {
    let p = getRealPath(argv[0]);
    let text = getData(dir, p, false, true)['data'];
    return `<span style="white-space: pre;">${text}</span><br>`;
}

function mkdir(argv) {
    getData(dir, getRealPath(argv[0]), true)
    return "";
}

function update(argv) {
    getJson();
    directory = [];
    return `<span>${languageData['updateData'][language]}</span><br>`;
}

function vim(argv) {
    //通过判断后缀来实现高亮
    let extensions = {
        'md': 'markdown',
        'py': 'python',
        'txt': 'null'
    };

    let mode = argv[0].split(".").slice(-1)[0]; //获取后缀
    mode = (mode in extensions) ? extensions[mode] : "null"; //获取模式

    console.log(mode);

    //设置保存函数
    CodeMirror.commands.save = function (e) {
        terminal.setAttribute("style", "");
        getData(dir, getRealPath(argv[0]), true, true)["data"] = editor.getValue();
        $(".CodeMirror").remove();
    };

    //获取需读取的文件内容
    let fileContent = getData(
        dir,
        getRealPath(argv[0]),
        true,
        true
    )['data'];

    let editor = CodeMirror(document.body,
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