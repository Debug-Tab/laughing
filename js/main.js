//定义命令
var cmd_head = ["help","cat", "ls", "cd"]

//定义目录
var directory = []

//定义元素
var terminal = $("#terminal")[0];
var input = $("#terminal-input")[0];
var html = $('body,html');

//定义当前URL
var host = window.location.hostname;
if (host == "") host = "localhost";

//运行命令
function run() {
    //获取输入的数值
    var script = input.value;
    //if(script==null) return 0;
    //按空格分割
    script = script.split(" ")
    //去除空字符串
    script = script.filter((x) => x !== '');
    //输出
    console.log(script);
    var o;

    if(!cmd_head.includes(script[0])) {
        o = ""
        return -1;
    }



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
function Render() {
    let temp = `<span>${input.value}</span><br><span class="prefix">[<span id="usr">usr</span>@<span class="host">${host}</span> <span
        id="directory">${"/"+directory.join("/")}</span>]<span id="pos">$</span></span>`;
    var div = parseHTML(temp);
    console.log(div);
    terminal.insertBefore(div, input); //Error
    html.animate({scrollTop: $(document).height()}, 0);
    //清空
    input.value = "";
}


for (let i of document.getElementsByClassName("host")) {
    i.innerHTML = host;
}

//处理按键信息
function keydown(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        run();
        Render();
    }

    // Ctrl+U 清空输入
    if (e.keyCode == 85 && e.ctrlKey == true) {
        input.value = "";
    }
}
