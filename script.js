"use strict";
function getSubpage() {
    return window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
}
let url = "https://spezifisch-hangman.herokuapp.com/?test";
async function wakeServer() {
    await fetch(url);
}
wakeServer();
//# sourceMappingURL=script.js.map