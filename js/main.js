//定义命令
const cmd_head = ["help", "update", "cat", "ls", "cd", "clear", "sudo", "mkdir", "vim"]

//定义目录
var directory = []
var dir; //目录json

//定义元素
const terminal = $("#terminal")[0];
const input = $("#terminal-input")[0];
const html = $('body,html');

//定义当前URL
var host = window.location.hostname;
if (host == "") host = "localhost";

//命令历史

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


//运行命令
function run() {
    //获取输入的数值
    let script = input.value;
    if (script == "") return "";
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


function parseHTML(html) {
    let t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}

//保持聚焦
function refocus(e) {
    let that = this;
    setTimeout(function () {
        //document.getElementById("terminal-input").focus();
    }, 100);

}

//渲染
function Render(tag) {
    //制作输出内容
    let temp = `<span>${input.value}</span><br>${tag}
        <span class="prefix">[<span id="usr">usr</span>@<span class="host">${host}</span> <span
        id="directory">${"/" + directory.join("/")}</span>]<span id="pos">$</span></span>`;
    let div = parseHTML(temp); //解析字符串为HTML
    //console.log(div);
    terminal.insertBefore(div, input);
    html.animate({scrollTop: $(document).height()}, 0);
    //清空
    input.value = "";
}

//处理按键信息
function keydown(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        Render(run());
        Cookies.set('file', JSON.stringify(dir));
    }

    // 历史

}


function getCurrentDir(d, path, nopath = false) {
    //console.log([d,path]);
    if (path.length == 0) return dir;
    let name = getAllName(d["data"]);
    if (name.includes(path[0])) {
        let l = name.indexOf(path[0]);
        console.log(name);
        if (typeof d["data"][l]["data"] == typeof []) {
            return path.length == 1 ? d["data"][l] : getCurrentDir(d["data"][l], path.slice(1), nopath);
        }
        return -2;
    }
    if (nopath) {
        var temp = {
            "name": path.slice(-1)[0],
            "data": []
        };
        d["data"].push(temp);
    }
    return -1;

}

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


function cd(argv) {
    if (argv.length != 1) {
        return `<span style="color: red">Error: too many arguments to cd</span><br>`
    }
    let dirl = getRealPath(argv[0]);

    let cdir = getCurrentDir(dir, dirl);
    console.log(`cd: Currentdir-return ${cdir}`);
    if (cdir == -1) {
        return `<span style="color: red">Error: No such file or directory.</span><br>`;
    } else if(cdir == -2){
        return `<span style="color: red">Error "${argv[0]}" is not a folder.</span><br>`
    } else{
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
    console.log(dirList,fileList);
    return `<span style="color: yellow">${dirList.join(" ")}</span>
            <span style="color: deepskyblue">${fileList.join(" ")}</span><br>`;
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

function readFile(path) {
    let d = getCurrentDir(dir, path.slice(0, -1));
    let name = getAllName_Data(d["data"]);
    return name[path.slice(-1)]["data"];
}

function cat(argv) {
    let p = getRealPath(argv[0]);
    let text = readFile(p);
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
        "md": "markdown"
    };
    terminal.setAttribute("style","display:none;");
    CodeMirror.commands.save = function (e) {
        console.log(e);
    };
    let editor = CodeMirror(document.body,
        {
            value : readFile(getRealPath(argv[0])),
            lineNumbers : true,
            mode : "text/x-markdown",
            keyMap : "vim",
            matchBrackets : true,
            showCursorWhenSelecting : true,
            inputStyle : "contenteditable",
            theme: "ayu-mirage",
            lineWrapping: true
        });
}