//定义命令
const cmd_head = ["help", "update", "cat", "ls", "cd", "clear", "sudo", "mkdir"]

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
                Cookies.set('file',JSON.stringify(dir));
            }
    });

}

if(Cookies.get('file')==undefined){
    getJson();
}
else {
    try {
        console.log("Try to read the data in cookie")
        dir = JSON.parse(unescape(Cookies.get('file')));
    }
    catch(err) {
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
    if (script=="") return "";
    //按空格分割
    script = script.split(" ");
    //去除空字符串
    script = script.filter((x) => x !== '');

    //输出
    console.log(`Run script:${script}`);

    if(script[0]=="sudo") script = script.slice(1);
        //如果命令不存在
    if (!cmd_head.includes(script[0]) || !script) {
        return `<span style="color: red">Error:</span>
            <span style="color: #FF5555;text-decoration: underline">${input.value}</span>
            <span style="color: red">is not defined</span><br>`;
    }
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
        //console.log(that);
        document.getElementById("terminal-input").focus();
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
    }

    // 历史

}



function getCurrentDir(d, path, nopath=false) {
    //console.log([d,path]);
    if(path.length==0) return dir;
    let name = Object.keys(getAllName(d["data"]));
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
    if (nopath) {
        var temp = {
            "name": path.slice(-1),
            "type": "dir",
            "data": {}
        };
        d["data"].push(temp);
    }
    return -1;

}

function getRealPath(d) {
    if(typeof d==typeof ""){
        //相对路径
        if (d[0] != "/") {
            d = directory.concat(d.split("/"));
        }
        else {
            d = d.split("/")
        }
        d = d.filter((x) => x !== '');
    }


    while (d.includes("..")){
        d.splice(d.indexOf("..")-1, 2);
    }
    return d;
}


function cd(argv) {
    if (argv.length != 1) {
        return `<span style="color: red">Error: too many arguments to cd</span>`
    }
    let dirl = getRealPath(argv[0]);

    let cdir = getCurrentDir(dir, dirl);
    console.log(dirl);
    if(cdir==-1 || cdir==-2){
        return `<span style="color: red">Error: No such file or directory</span><br>`;
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
    let Cdir = getCurrentDir(dir,directory);
    let name = getAllName(Cdir["data"]);
    let dirList=[],fileList=[];
    for(let t in name){
        if (name[t]["type"]=="dir"){
            //dirList.push(name[t]);
            dirList.push(t);
        }
        else {
            //fileList.push(name[t]);
            fileList.push(t);
        }
        //console.log(name[t]["type"])
    }
    //console.log(dirList,fileList);
    return `<span style="color: yellow">${dirList.join(" ")}</span>
            <span style="color: deepskyblue">${fileList.join(" ")}</span><br>`;
}

//获取所有名称
function getAllName(data) {
    let name = {};
    for (let l=0; l < data.length; l++) {
            name[data[l]["name"]] = data[l];
    }
    return name;
}

function clear(argv) {
    var child = terminal.firstChild;
    var last = terminal.lastChild;
    var t;
    while(child != last) {
        t = child;
        child = child.nextSibling;
        if(t.tagName!="INPUT" && t.tagName!="SCRIPT") t.remove();
    }
    return "";
}

function cat(argv) {
    let p=getRealPath(argv[0]);
    let d = getCurrentDir(dir,p.slice(0,-1));
    let name = getAllName(d["data"])
    console.log(p,d,name)
    let text = getAllName(d["data"])[p.slice(-1)]["data"];
    return `<span>${text}</span><br>`;
}

function mkdir(argv) {
    getCurrentDir(dir,getRealPath(argv[0]))
    return "";
}

function update(argv) {
    getJson();
    directory = [];
    return "<span>Updatine data.json!</span><br>";
}