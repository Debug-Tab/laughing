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
const cmd_head = ["help", "update", "cat", "ls", "cd", "clear", "sudo", "mkdir", "vim"]

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


/**
 * **********************************
 * 函数名: getJson
 * 功能: 通过ajax获取data.json
 * 调用位置: 函数下面、update
 * **********************************
 */
function getJson() {
    $.ajax({
        url: "data.json",
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

if (Cookies.get('file') == undefined) {
    getJson();
} else {
    try {
        console.log("Try to read the data in cookie")
        dir = JSON.parse(unescape(Cookies.get('file')));
    } catch (err) {
        console.log(`Error:cannot read the real data in cookie.\nCookie:${document.cookie}`);
        getJson();
    }
}
for (let i of document.getElementsByClassName("host")) {
    i.innerHTML = host;
}


/**
 * **********************************
 * 函数名: run
 * 功能: 获取输入并执行命令
 * 调用位置: keydown
 * **********************************
 */
function run() {
    //获取输入的数值
    let script = input.value;
    if (script == "") return "";

    terminal.insertBefore(parseHTML(`<span>${input.value}</span>`), input);
    //按空格分割
    script = script.split(" ");

    //去除空字符串
    script = script.filter((x) => x !== '');

    //输出
    console.log(`Run script:${script}`);

    if (script[0] == "sudo") script = script.slice(1);
    //如果命令不存在
    if (!cmd_head.includes(script[0]) || !script) {
        return `<span style="color: red">Error:</span>
            <span style="color: #FF5555;text-decoration: underline">${script[0]}</span>
            <span style="color: red">is not defined</span><br>`;
    }
    console.log(`return ${script[0]}(script.slice(1))`);
    //return new Function(`return ${script[0]}(script.slice(1))`)();
    return eval(`${script[0]}(script.slice(1))`);
}

/**
 * **********************************
 * 函数名: parseHTML
 * 功能: 把传入的字符串解析为HTML对象
 * 调用位置: run, Render
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
 * 功能: 在失去焦点时再次获取焦点
 * 调用位置: Render
 * **********************************
 */

function refocus(e) {
    let that = this;
    setTimeout(function () {
        //document.getElementById("terminal-input").focus();
    }, 100);

}

/**
 * **********************************
 * 函数名: Render
 * 功能: 在执行命令后渲染新的提示符
 * 调用位置: keydown
 * **********************************
 * @param {String} tag - 运行命令后返回的HTML字符串
 */
function Render(tag) {
    //制作输出内容
    let temp = `<br>${tag}
        <span class="prefix">[<span id="usr">usr</span>@<span class="host">${host}</span> <span
        id="directory">${"/" + directory.join("/")}</span>]<span id="pos">$</span></span>`;
    let div = parseHTML(temp); //解析字符串为HTML
    //console.log(div);
    terminal.insertBefore(div, input);
    html.animate({scrollTop: $(document).height()}, 0);
    //清空
    input.value = "";
}

/**
 * **********************************
 * 函数名: keydown
 * 功能: 处理按键
 * 调用位置: 输入标签的onkeydown
 * **********************************
 * @param {String} tag - 运行命令后返回的HTML字符串
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
 * 函数名: getCurrentDir
 * 功能: 获取相应路径的对象
 * 调用位置: 大部分命令
 * **********************************
 * @param {Object} d - 解析的来源，大部分时候是全局变量dir，仅为方便递归
 * @param {Array} path - 需要获取的路径分割后的数组，仅可为绝对路径(可调用getRealPath来将相对路径转为绝对路径)
 * @param {boolean} noPath - 如果为真，表示可能不存在此路径，需创建
 * @param {boolean} file - 是否为文件
 */
function getCurrentDir(d, path, noPath = false, file = false) {
    //console.log([d,path]);
    if (path.length == 0) return dir;
    let name = getAllName(d["data"]);

    if (name.includes(path[0])) {
        let l = name.indexOf(path[0]);
        console.log(name);
        if ((typeof d["data"][l]["data"] == typeof []) || file) {
            return path.length == 1 ? d["data"][l] : getCurrentDir(d["data"][l], path.slice(1), noPath, file);
        }
        console.log(file)
        return -2;
    }
    if (noPath) {
        let temp = {
            "name": path.slice(-1)[0],
            "data": []
        };
        d["data"].push(temp);
        return d["data"][temp];
    }
    return -1;

}

/**
 * **********************************
 * 函数名: getRealPath
 * 功能:将相对路径及字符串转为绝对路径
 * 调用位置: 大部分命令
 * **********************************
 * @param d - 需转换的字符串或数组
 */
function getRealPath(d) {
    if (typeof d == typeof "") {
        //相对路径
        if (d[0] != "/") {
            d = directory.concat(d.split("/"));
        } else {
            d = d.split("/")
        }
        d = d.filter((x) => x !== '');
    }


    while (d.includes("..")) {
        d.splice(d.indexOf("..") - 1, 2);
    }
    return d;
}


//获取所有名称
function getAllName_Data(data) {
    let name = {};
    for (let l = 0; l < data.length; l++) {
        name[data[l]["name"]] = data[l];
    }
    return name;
}

function getAllName(data) {
    let name = [];
    for (let l = 0; l < data.length; l++) {
        name.push(data[l]["name"]);
    }
    return name;
}


function cd(argv) {
    if (argv.length != 1) {
        return `<span style="color: red">Error: too many arguments to cd</span><br>`
    }
    let dirl = getRealPath(argv[0]);

    let cdir = getCurrentDir(dir, dirl);
    console.log(`cd: Currentdir-return ${cdir}`);
    if (cdir == -1) {
        return `<span style="color: red">Error: No such file or directory.</span><br>`;
    } else if (cdir == -2) {
        return `<span style="color: red">Error "${argv[0]}" is not a folder.</span><br>`
    } else {
        directory = dirl;
        return "";
    }
}


function ls(argv) {
    let Cdir = getCurrentDir(dir, directory);
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
    let text = getCurrentDir(dir, p, false, true)['data'];
    return `<span style="white-space: pre;">${text}</span><br>`;
}

function mkdir(argv) {
    getCurrentDir(dir, getRealPath(argv[0]), true)
    return "";
}

function update(argv) {
    getJson();
    directory = [];
    return "<span>Updating data.json!</span><br>";
}

function vim(argv) {
    let extensions = {
        "md": "markdown",
        "py": "python"
    };
    let mode = argv[0].split(".").slice(-1)[0];
    mode = (mode in extensions) ? extensions[mode] : "null";
    console.log(mode);

    //隐藏其他界面
    terminal.setAttribute("style", "display:none;");
    CodeMirror.commands.save = function (e) {
        terminal.setAttribute("style", "");
        getCurrentDir(dir, getRealPath(argv[0]), true, true)["data"] = editor.getValue();
        $(".CodeMirror").remove();
    };

    let editor = CodeMirror(document.body,
        {
            value: getCurrentDir(dir, getRealPath(argv[0]), false, true)['data'], //获取文件内容
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
    return "<br>"
}