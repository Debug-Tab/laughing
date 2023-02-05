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