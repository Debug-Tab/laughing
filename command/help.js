/**
 * **********************************
 * 函数名: help
 * 功能: 输出帮助
 * **********************************
 * @param {Array} argv - 参数(无)
 * @returns {String} - HTML文本
 */

function help(argv) {
    Output(
`<span style="white-space: pre-wrap; word-wrap: break-word">
一个简易的Javascript仿写Linux命令行

命令:
    help 显示帮助信息
    refresh 更新Cookie中缓存的data.json数据
    cat &lt;path&gt; 查看文件内容，可使用相对路径
    ls &lt;path&gt; 查看当前文件夹的子文件(夹)
    cd &lt;path&gt; 进入目录，可使用相对路径
    clear 清屏
    mkdir &lt;path&gt; 创建文件夹
    vim &lt;path&gt; 修改文件，请使用 :w 退出(不带q)
</span>`);
    return '<br>';
}