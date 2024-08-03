/*********************************************/
/*    File names: main.js                    */
/*    Function: MAIN                         */
/*    Last update: 2024.8.3                  */
/*    depend:       jQuery, Js-cookie        */
/*********************************************/


class ParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = "ParameterError";
    }
}

class FileError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileError";
    }
}

const System = new (class {
    constructor() {
        this.sysVar = {
            storedData: {}, // 存储数据
            host: window.location.hostname
                ? window.location.hostname
                : "localhost", // 本地名
            language: "zh-cn", // 语言
            env: [["bin"], ["boot"]], // 环境变量
            debugMode: true, // 调试模式
        };
        this._cache = {};
    }

    get debugMode() {
        return this.sysVar.debugMode;
    }

    cache(name) {
        return this._cache[name];
    }

    addCache(name, func) {
        this._cache[name] = func;
    }

    find(relativePath) {
        if (relativePath.constructor == Path) {
            relativePath = relativePath.path;
        }

        for (const i of this.getVar("env")) {
            console.log(i.concat(relativePath));
            let path = new Path(i.concat(relativePath));
            if (path.exist) {
                return path;
            }
        }

        return -1;
    }

    call(command, ...argv) {
        let path = this.find([command + ".js"]);

        if (path === -1)
            return `<span style="color: red">Cannot find the "${command}" !</span><br>`;

        if (!(command in this._cache)) {
            let funcText = this.getData(path, false, true);
            //funcText += `return ${name}(${JSON.stringify(argv)})`;
            this.addCache(command, new Function("argv", funcText));
        }

        if (this.debugMode) return this.cache(command)(argv);

        try {
            return this.cache(command)(argv);
        } catch (e) {
            return `<span style="color: red">${e}</span><br>`;
        }
    }

    setTerminal(term) {
        this.term = term;
    }

    getVar(key) {
        return this.sysVar[key];
    }

    setVar(key, data) {
        this.sysVar[key] = data;
        return 0;
    }

    get storedData() {
        return this.sysVar["storedData"];
    }

    getData(path, noPath = false, file = false, currentDir = this.storedData) {
        if (path.constructor === Path) path = path.path;
        //console.log([currentDir,path]);
        if (path.length == 0) return currentDir;

        if (path[0] in currentDir) {
            // 如果存在目标
            if (currentDir[path[0]].constructor === Object || file) {
                return path.length == 1
                    ? currentDir[path[0]]
                    : this.getData(
                          path.slice(1),
                          noPath,
                          file,
                          currentDir[path[0]]
                      );
            }
            console.log(file);
            return -2;
        }

        if (noPath) {
            if (path.length == 1) {
                currentDir[path[0]] = file ? "" : {}; // 如果是文件则data为字符串
                return currentDir[path[0]];
            } else {
                currentDir[path[0]] = {};
                return this.getData(
                    path.slice(1),
                    noPath,
                    file,
                    currentDir[path[0]]
                );
            }
        }
        return -1;
    }

    writeData(filePath, data, appendMode = false) {
        if (filePath.constructor == Path) {
            filePath = filePath.path;
        }

        if (appendMode) {
            data = this.getData(filePath, false, true) + data;
        }

        this.getData(filePath.slice(0, -1))[filePath[filePath.length - 1]] =
            data;

        return "<br>";
    }

    exist(path, currentDir = this.storedData) {
        if (path.constructor == Path) {
            path = path.path;
        }

        if (path.length == 1) {
            return path[0] in currentDir;
        }

        if (!(path[0] in currentDir)) return false;

        return this.exist(path.slice(1), currentDir[path[0]]);
    }
})();

const Terminal = new (class {
    constructor() {
        this.termSet = {};
        this.inputBox = $("#terminal-input")[0];
        this._workPath = [];
        this._workingDir = {};
        // this.sys = sys;
    }

    get workPath() {
        return this._workPath;
    }

    setWorkPath(arg) {
        this._workingDir = System.getData(arg, false, false);
        this._workPath = arg;
    }

    getVar(key) {
        return this.termSet[key];
    }

    setVar(key, data) {
        this.termSet[key] = data;
        return 0;
    }

    get inputValue() {
        return this.inputBox.value;
    }

    clearInput() {
        this.inputBox.value = "";
        return 0;
    }

    htmlEncode(text) {
        let arrEntities = {
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
        };
        return text.replace(/[<>&"]/g, function (c) {
            return arrEntities[c];
        });
    }

    htmlDecode(str) {
        let arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
            return arrEntities[t];
        });
    }

    output(str) {
        $("#terminal")[0].insertBefore(parseHTML(str), this.inputBox);
    }

    print(text) {
        this.output(
            `<span style="white-space: pre-wrap; word-wrap: break-word">${this.htmlEncode(
                text
            )}</span>`
        );
    }

    refocus() {
        let that = this;
        setTimeout(function () {
            this.inputBox.focus();
        }, 100);
    }

    getRealPath(path) {
        if (path.constructor === String) {
            path = path.split("/");
            if (path[0] != "") path = this.workPath.concat(path); // 相对路径
        }

        if (path.constructor === Path) path = path.path;
        if (path.length == 0) return path;

        path = path.filter((x) => ![" ", "."].includes(x));
        while (path.includes("..")) {
            path.splice(path.indexOf("..") - 1, 2);
        }

        return path;
    }
})();

class Path {
    constructor(path) {
        this.path = Terminal.getRealPath(path);
        this.originalPath = path;
        this.name = this.path[this.path.length - 1];

        console.log(`${path} ${this.path}(${this.name})`);
    }

    get exist() {
        return System.exist(this);
    }

    get data() {
        return System.getData(this.path);
    }

    get extName() {
        return this.name.split(".").slice(-1)[0];
    }

    touch(isFile) {
        System.getData(this, true, isFile);
    }
}

function analysis() {
    let command = Terminal.inputValue;
    if (command == "") return "<br>";

    Terminal.output(`<span>${command}</span><br>`);
    Terminal.clearInput();

    // 按空格分割，并去除空字符串
    command = command.split(" ").filter((x) => x !== "");

    // 输出日志
    console.log("Run: " + command);

    // (暂时)忽略sudo
    if (command[0] == "sudo") command = command.slice(1);

    // try {
    return System.call(command[0], ...command.slice(1));
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
function getStoredDataJson() {
    $.ajax({
        url: "/data.json",
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            console.log(data);
            System.setVar("storedData", data);
            Cookies.set("file", JSON.stringify(System.storedData));
        },
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
    let t = document.createElement("template");
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
    // 合并输出内容
    let temp = `
        ${tag}
        <span class="prefix">[<span id="usr">usr</span>@<span class="host">${System.getVar(
            "host"
        )}</span> <span
        id="directory">${
            "/" + Terminal.workPath.join("/")
        }</span>]<span id="pos">&gt;
        </span></span>`;
    Terminal.output(temp);
    $("body,html").animate(
        {
            scrollTop: $(document).height(),
        },
        0
    );
}

/**
 * **********************************
 * 函数名: keydown
 * 功能: 处理按键
 * **********************************
 */
function keydown(e) {
    e = e /*|| window.event*/;
    if (e.keyCode == 13) {
        Render(analysis());
        Cookies.set("file", JSON.stringify(System.storedData));
    }
}

// 启动！
main();

/**
 * **********************************
 * 函数名: main
 * 功能: 主程序，在程序开始时初始化
 * **********************************
 */
function main() {
    // 操控Cookie，使用Js-cookie(已在index.html中引入)
    if (document.location.protocol == "file:") {
        Terminal.output(
            '<br><span style="color: red">WARNING: USING THE FILE PROTOCOL!</span><br>'
        );
    }

    if (Cookies.get("file") == undefined) {
        getStoredDataJson();
    } else {
        try {
            console.log("Try to load storedData from cookies");
            System.setVar(
                "storedData",
                JSON.parse(decodeURI(Cookies.get("file")))
            );
        } catch (err) {
            console.log("Failed! Cookies: " + document.cookie);
            getStoredDataJson();
        }
    }

    System.setTerminal(Terminal);
    console.log(System.call("boot"));

    //Terminal.inputBox.addEventListener('blur', Terminal.refocus);
    Terminal.inputBox.addEventListener("keydown", keydown);

    Render(""); // 第一个提示符
}
