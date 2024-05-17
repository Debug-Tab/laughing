/*********************************************/
/*    File names: main.js                     */
/*    Function: MAIN                         */
/*    Last update: 2024.5.8                  */
/*    dependencies: jQuery, Js-cookie        */
/*********************************************/

//**************************************
//    定义变量
//**************************************

class System{
    constructor() {
        this.sysVar = {
            "storedData": {},   //存储数据
            "host": window.location.hostname?window.location.hostname:"localhost",
            "language": "zh-cn", // 语言
        }
    }

    getVar(key) {
        return this.sysVar[key];
    }
    
    setVar(key, data) {
        this.sysVar[key] = data;
        return 0;
    }

    get storedData(){
        return this.sysVar["storedData"];
    }

    getData(currentDir, path, noPath = false, file = false) {
        //console.log([currentDir,path]);
        if (path.length == 0) return currentDir;
    
        console.log(currentDir);
        if (path[0] in currentDir) { // 如果存在目标
            if ((typeof currentDir[path[0]] == 'object') || file) {
                return path.length == 1 ? currentDir[path[0]] : this.getData(currentDir[path[0]], path.slice(1), noPath, file);
            }
            console.log(file)
            return -2;
        }
    
        if (noPath) {
            if (path.length == 1) {
                currentDir[path[0]] = file ? "" : {}; // 如果是文件则data为字符串
                return currentDir[path[0]];
            } else {
                return this.getData(currentDir[path[0]], path.slice(1), noPath, file);
            }
        }
        return -1;
    }

    writeData(filePath, data, appendMode = false) {
        if (appendMode) {
            data = this.getData(this.storedData, filePath, false, true) + data;
        }
        this.getData(this.storedData, filePath.slice(0, -1))[filePath[filePath.length - 1]] = data;
        return "<br>";
    }
    
}

class Terminal{
    constructor(sys) {
        this.termSet = {
            "cmdHead": ["help", "refresh", "cat", "ls", "cd", "clear", "mkdir", "vim", "help", "cl", "touch", "copy"], // 命令头
            "workPath": [],  //工作路径
            "workingDir": {}, //工作目录
            "include": [],   // 已导入的命令
        }
        this.sys = sys;
    }

    getVar(key) {
        return this.termSet[key];
    }
    
    setVar(key, data) {
        this.termSet[key] = data;
        return 0;
    }

    inputBox = $("#terminal-input")[0];
    
    get inputValue(){
        return this.inputBox.value;
    }

    clearInput() {
        this.inputBox.value = "";
        return 0;
    }

    output(str) {
        $("#terminal")[0].insertBefore(parseHTML(str), this.inputBox);
    }

    refocus() {
        let that = this;
        setTimeout(function () {
            this.inputBox.focus();
        }, 100);
    
    }

    
}

const sys = new System();
const term = new Terminal(sys);

// 定义当前URL，用于提示语
var host = window.location.hostname;
if (host == "") host = "localhost";

// 语言名称
var languageName = ['zh-cn', 'en-us'];

// 已包含的命令
var include = [];

// 多语言支持
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
    },

    'syntaxError': {
        'zh-cn': '语法错误',
        'en-us': 'SyntaxError'
    },

    'parameterError': {
        'zh-cn': '参数异常',
        'en-us': 'Error: Parameter Error'
    },
}

// 启动！
main()

/**
 * **********************************
 * 函数名: main
 * 功能: 主程序，在程序开始时初始化
 * **********************************
 */
function main() {
    // 操控Cookie，使用Js-cookie(已在index.html中引入)
    if (document.location.protocol == "file:") {
        term.output('<br><span style="color: red">WARNING: USING THE FILE PROTOCOL!</span><br>');
    }
    if (Cookies.get('file') == undefined) {
        getJson();
    } else {
        try {
            console.log(languageData['tryCookie'][sys.getVar("language")]);
            sys.setVar("storedData", JSON.parse(decodeURI(Cookies.get('file'))));
        } catch (err) {
            console.log(languageData['tryCookieError'][sys.getVar("language")] + document.cookie);
            getJson();
        }
    }

    //term.inputBox.addEventListener('blur', term.refocus);
    term.inputBox.addEventListener('keydown', keydown);

    Render(""); // 第一个提示符
    /*
    jQuery(function($, undefined) {
        $('#terminal-input').terminal(function(command) {
            if (command !== '') {
                var result = window.eval(command);
                if (result != undefined) {
                    this.echo(String(result));
                }
            }
        }, {
            greetings: 'Javacommand Interpreter',
            names: 'js_demo',
            height: 200,
            width: 450,
            prompt: 'js> '
        });
    });
    */
}

function analysis() {
    let command = term.inputValue;
    if (command == "") return "<br>";

    term.output(`<span>${command}</span><br>`);
    term.clearInput();

    // 按空格分割，并去除空字符串
    command = command.split(" ").filter((x) => x !== '');

    // 输出日志
    console.log(languageData['runCmd'][sys.getVar("language")] + command);

    // (暂时)忽略sudo
    if (command[0] == "sudo") command = command.slice(1);

    // 如果命令不存在
    if (!term.getVar("cmdHead").includes(command[0]) || !command) {
        return `
            <span style="color: red">
                ${languageData['error'][sys.getVar("language")] + languageData['unableFind'][sys.getVar("language")] + command[0]}
            </span><br>`;
    }

    // try {
    let funcText = "";
    if (!(term.getVar("include").includes(command[0]))) {
        console.log(`Load ${command[0] + '.js'}`);
        funcText += sys.getData(sys.storedData, ['bin', command[0] + '.js'], false, true);
    }

    //let result; // 运行结果
    //eval(`result = ${command[0]}(${JSON.stringify(command.slice(1))})`); // 不安全！！！

    //return result; // 返回内容
    funcText += `return ${command[0]}(${JSON.stringify(command.slice(1))})`;
    return Function(funcText)();
    //} catch (err) {
    //    return `<span style="color: red">${err}</span><br>`
    //}
}

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
        success: function (data) {
            //console.log(data);
            sys.setVar("storedData", data);
            Cookies.set('file', JSON.stringify(sys.storedData));
        }
    });

}

/**
 * **********************************
 * 函数名: getData
 * 功能: 获取相应路径的对象
 * **********************************
 * @param {Object} currentDir - 解析的来源，大部分时候是全局变量dir，仅为方便递归
 * @param {Array} path - 需要获取的路径分割后的数组，仅可为绝对路径(可使用getRealPath来将相对路径转为绝对路径)
 * @param {boolean} noPath - 如果为真，表示可能不存在此路径，需创建
 * @param {boolean} file - 是否为文件
 */


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
 * 函数名: Output
 * 功能: 在执行命令后渲染新的提示符
 * **********************************
 * @param {String} str - 需输出的HTML字符串
 */
function Output(str) {
    $("#terminal")[0].insertBefore(parseHTML(str), term.inputBox);
    return 0;
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
        ${tag}
        <span class="prefix">[<span id="usr">usr</span>@<span class="host">${sys.getVar("host")}</span> <span
        id="directory">${"/" + term.getVar("workPath").join("/")}</span>]<span id="pos">&gt;
        </span></span>`;

    term.output(temp);
    $('body,html').animate({
        scrollTop: $(document).height()
    }, 0);
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
        Render(analysis());
        Cookies.set('file', JSON.stringify(sys.storedData));
    }
}

/**
 * **********************************
 * 函数名: getRealPath
 * 功能: 将相对路径及字符串转为绝对路径
 * **********************************
 * @param path - 需转换的字符串或数组
 * @returns {Array} - 转换后的数组
 */
function getRealPath(path) {
    if (typeof path == 'string') {
        path = path.split("/");
        if(path[0]) 
            path = term.getVar("workPath").concat(path); // 相对路径
    }

    path = path.filter((x) => x !== '');
    while (path.includes("..")) {
        path.splice(path.indexOf("..") - 1, 2);
    }
    return path;
}

function exist(path, currentDir = sys.storedData) {
    if (path.length == 1) {
        return path[0] in currentDir;
    }
    return (path[0] in currentDir)
        ? exist(path.slice(1), currentDir[path[0]])
        : false;
}