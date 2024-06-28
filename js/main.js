/*********************************************/
/*    File names: main.js                    */
/*    Function: MAIN                         */
/*    Last update: 2024.5.25                 */
/*    dependencies: jQuery, Js-cookie        */
/*********************************************/

//**************************************
//    定义变量
//**************************************

const System = new class {
    constructor() {
        this.sysVar = {
            "storedData": {},   //存储数据
            "host": window.location.hostname?window.location.hostname:"localhost",
            "language": "zh-cn", // 语言
        }
    }

    setTerminal(term){
        this.term = term;
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

    exist(path, currentDir = this.storedData) {
        if (path.length == 1) {
            return path[0] in currentDir;
        }
        return (path[0] in currentDir)
            ? this.exist(path.slice(1), currentDir[path[0]])
            : false;
    }
    
}

const Terminal = new class {
    constructor() {
        this.termSet = {
        }
        this._workPath = [];
        this._workingDir = {};
        this._cache = {};
        // this.sys = sys;
    }

    get workPath() {
        return this._workPath;
    }

    setWorkPath(arg) {
        this._workingDir = System.getData(System.storedData, arg, false, false);
        this._workPath = arg;
    }

    cache(name) {
        return this._cache[name];
    }

    addCache(name, func) {
        this._cache[name] = func;
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

    htmlEncode(text) {
        let arrEntities = {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'};
        return text.replace(/[<>&"]/g, function(c){return arrEntities[c];});
    }

    htmlDecode(str) {
        let arrEntities = {'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all,t){return arrEntities[t];});
    }

    output(str) {
        $("#terminal")[0].insertBefore(parseHTML(str), this.inputBox);
    }

    print(text) {
        this.output(`<span style="white-space: pre-wrap; word-wrap: break-word">${this.htmlEncode(text)}</span>`);
    }

    refocus() {
        let that = this;
        setTimeout(function () {
            this.inputBox.focus();
        }, 100);
    
    }

    getRealPath(path) {
        if (typeof path == 'string') {
            path = path.split("/");
            if(path[0]) 
                path = this.workPath.concat(path); // 相对路径
        }

        path = path.filter((x) => x !== '');
        while (path.includes("..")) {
            path.splice(path.indexOf("..") - 1, 2);
        }
        return path;
    }

    runCmd(name, argv){
        if (!System.exist(["bin", name + '.js'])) 
            return `<span style="color: red">Cannot find the "${name}" !</span><br>`;
        if (!(name in this._cache)) {
            let funcText = System.getData(System.storedData, ['bin', name + '.js'], false, true);
            //funcText += `return ${name}(${JSON.stringify(argv)})`;
            this.addCache(name, new Function("argv", funcText));
        }

        return this.cache(name)(argv);
    }
    
}

System.setTerminal(Terminal);

// 语言名称
var languageName = ['zh-cn', 'en-us'];

// 多语言支持(准备废弃)
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
        Terminal.output('<br><span style="color: red">WARNING: USING THE FILE PROTOCOL!</span><br>');
    }
    if (Cookies.get('file') == undefined) {
        getJson();
    } else {
        try {
            console.log(languageData['tryCookie'][System.getVar("language")]);
            System.setVar("storedData", JSON.parse(decodeURI(Cookies.get('file'))));
        } catch (err) {
            console.log(languageData['tryCookieError'][System.getVar("language")] + document.cookie);
            getJson();
        }
    }

    //Terminal.inputBox.addEventListener('blur', Terminal.refocus);
    Terminal.inputBox.addEventListener('keydown', keydown);

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
    let command = Terminal.inputValue;
    if (command == "") return "<br>";

    Terminal.output(`<span>${command}</span><br>`);
    Terminal.clearInput();

    // 按空格分割，并去除空字符串
    command = command.split(" ").filter((x) => x !== '');

    // 输出日志
    console.log(languageData['runCmd'][System.getVar("language")] + command);

    // (暂时)忽略sudo
    if (command[0] == "sudo") command = command.slice(1);
    
    // try {
    return Terminal.runCmd(command[0], command.slice(1));
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
            System.setVar("storedData", data);
            Cookies.set('file', JSON.stringify(System.storedData));
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
    $("#terminal")[0].insertBefore(parseHTML(str), Terminal.inputBox);
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
        <span class="prefix">[<span id="usr">usr</span>@<span class="host">${System.getVar("host")}</span> <span
        id="directory">${"/" + Terminal.workPath.join("/")}</span>]<span id="pos">&gt;
        </span></span>`;
    Terminal.output(temp);
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
        Cookies.set('file', JSON.stringify(System.storedData));
    }
}
