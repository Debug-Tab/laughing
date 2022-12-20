//定义命令
const cmd_head = ["help", "cat", "ls", "cd"]

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


//运行命令
function run() {
    //获取输入的数值
    var script = input.value;
    if (script=="") return "";
    //按空格分割
    script = script.split(" ");
    //去除空字符串
    script = script.filter((x) => x !== '');

    //输出
    console.log(`Run script:${script}`);

    //如果命令不存在
    if (!cmd_head.includes(script[0]) || !script) {
        return `<span style="color: red">Error:</span>
            <span style="color: #FF5555;text-decoration: underline">${input.value}</span>
            <span style="color: red">is not defined</span>`;
    }
    return eval(`${script[0]}(script.slice(1))`);
}

function getJson() {
    $.ajax({
        url: "data.json",
        type: "GET",
        dataType: "json",
        success:
            function (data) {
                //console.log(data);
                dir = data;
            }
    });
}

function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content;
}

//保持聚焦
function refocus(e) {
    var that = this;
    setTimeout(function () {
        //console.log(that);
        document.getElementById("terminal-input").focus();
    }, 100);

}

//渲染
function Render(tag) {
    //制作输出内容
    let temp = `<span>${input.value}</span><br>${tag}<br>
        <span class="prefix">[<span id="usr">usr</span>@<span class="host">${host}</span> <span
        id="directory">${"/" + directory.join("/")}</span>]<span id="pos">$</span></span>`;
    var div = parseHTML(temp); //解析字符串为HTML
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
    }

    // Ctrl+U 清空输入
    if (e.keyCode == 85 && e.ctrlKey == true) {
        input.value = "";
    }
}

getJson()
for (let i of document.getElementsByClassName("host")) {
    i.innerHTML = host;
}


function getCurrentDir(d, path) {
    console.log([d,path]);
    if(path.length==0) return dir;
    var name = Object.keys(getAllName(d["data"]));
    if (name.includes(path[0])) {
        let l=name.indexOf(path[0])
        if (d["data"][l]["type"] == "dir") {
            if (path.length != 1) {
                return getCurrentDir(d["data"][l], path.slice(1))
            } else {
                return d["data"][l]
            }

        }
        return -2;
    }
    return -1;

}

function cd(argv) {
    if (argv.length != 1) {
        return `<span style="color: red">Error: too many arguments to cd</span>`
    }
    let dirl = argv[0].split("/");
    //去除空字符串
    dirl = dirl.filter((x) => x !== '');
    while (dirl.includes("..")){
        dirl.splice(dirl.indexOf("..")-1, 2);
    }

    let cdir = getCurrentDir(dir, dirl);
    console.log(dirl);
    if(cdir==-1 || cdir==-2){
        return `<span style="color: red">Error: No such file or directory</span>`;
    }
    else{
        directory = dirl;
        return "";
    }
}

function findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
}

function ls(argv) {
    let dirl = getCurrentDir(dir,directory);
    let name = getAllName(dirl["data"]);
    console.log(findKey(name,"dir"))
    console.log(findKey(name,"file"))
    return `<span>${Object.keys(name).join(" ")}</span>`
}

//获取所有名称
function getAllName(data,type=-1) {
    let name = {};
    for (let l=0; l < data.length; l++) {
            name[data[l]["name"]] = data[l]["type"];
    }
    return name;
}