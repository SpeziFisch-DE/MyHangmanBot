"use strict";
function getSubpage() {
    return window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
}
let url = "http://spezifisch-hangman.herokuapp.com/?test";
async function wakeServer() {
    await fetch(url);
}
if (getSubpage() == "index.html") {
    open("index.html?test", "_self").close();
}
//# sourceMappingURL=script.js.map