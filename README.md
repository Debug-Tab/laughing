![title](img/README/title.png)


# 说明

本README更新可能会落后源码，如发现问题请自行阅读源码

不过请务必**认真看完README文件**！

更新日志为**update.log**

我的操作系统为Windows，对Linux不熟悉，如有错误，欢迎指正

## 特性

这是一个基于**Javascript**的**仿Linux终端**，支持一点多语言，可以操控文件，支持相对路径

修改数据后会保存在**cookie**里，所以使用修改后，刷新页面修改也不会丢！

目前功能少的可怜，代码凌乱，仅供学习研究。

## 注意！！！请不要直接双击打开index.html，它需要请求文件，会报错！

报错如下

```报错
已拦截跨源请求：同源策略禁止读取位于 file:///XXXX/data.json 的远程资源。（原因：CORS 请求不是 http）。
```


一般**Webstorm**、**Python**、**nodejs**等环境，可以快速在本地搭建服务器

没有这些也没关系，打开项目目录下的**EasyWebSvr.exe**

默认打开后会自动在此目录启动server，浏览器打开**localhost:5739**就可以了

如果出现下面这种端口被占用的情况

![port](img/README/port.png)

按以下步骤做：

![1](img/README/1.png)
![2](img/README/2.png)
![3](img/README/3.png)

接着打开**localhost:你设置的端口号**即可

如果你有问题，自己搜索:[搭建本地server](https://debug-tab.github.io/baiduyx/index.html?搭建本地server)

## 后续优化

- 把Data替换为字典，其中key为文件名，value就为权限、内容等信息实现无序
- 分割main.js，将操作存放在lib.js里，命令单独一个文件夹
- 添加文件权限
- 更多命令


# 功能

## 命令

目前实现命令: 

- ls (列举文件和文件夹)

- cd (进入目录)

- cat (查看文件内容)

- clear (清屏)

- update (更新)

- sudo (存粹好玩)

- mkdir (创建文件夹)

- vim (文件编辑命令，使用Codemirror，仍有问题，请使用:w来退出，不支持另存为和:q)

更多命令正在制作中。


## 文件

作为一个合格的终端，当然能操控文件啦

此项目使用**json**文件模拟文件/文件夹结构，数据存放在**data.json**里

默认会尝试读取**cookie**的**file**属性，如果失败，则会请求data.json后会把它编码放到cookie里。因此，如果你改变了**data.json**，请在浏览器打开**index.html**后，运行**update**命令，它会自动请求更新。

### 文件结构

每个文件(夹)是一个字典，**name**表示名字，**data**表示内容

如果**data**属性是**列表**的话，则认为它是文件夹。否则认为是文件

比如在根目录有一个文件**test.py**和空文件夹**temp**，则这样写json:

```json
{
  "name": "/",
  "data": [
    {
      "name": "test.py",
      "data": "print('Hello World!')\n"
    },
    {
      "name": "temp",
      "data": []
    }
  ]
}
```

### 脚本
为了~~懒~~方便，我写了一个根据现有目录生成**data.json**的Python脚本

就是根目录下的**makeData.py**


语法如下:

```bash
python makeData.py -h //帮助
python makeData.py 目录路径 //将第一个参数转为data.json并输出
python makeData.py 目录路径 --save 保存路径 //将目录转为Json并保存
```

**请谨慎运行，确保指定目录中没有二进制文件(如.exe, .png, .iso)，否则后果自负！**


# 原理

输入由一个无边框的input标签实现

主要程序都在 **/js/main.js** 里

程序主要分为四个部分:

- 定义变量

- 事件处理函数

- 功能性函数

- 命令实现函数

## 运行

当按下任意键时，触发**keydown**函数

**keydown**函数检测按下键是否为回车

如果是，则执行**Render(run())**

**run**函数将获取并分割输入框内容

同时添加一个包含输入内容的**span**标签至**input**标签前，并清空**input**的内容

如果 命令头(第一个空格前的字符串) 包含在**cmd_head**列表里

则执行此函数，并传入参数**argv**(分割后的列表，不包含命令头)

函数运行结束后，会返回一个**HTML**标签字符串

**run**函数返回它，并交给**Render**(渲染)函数处理。

## 渲染

将run函数返回的字符串转换为HTML对象

并在input标签前添加这个HTML对象和新的提示符



## 未完待续。。。(手动狗头)
