"use strict";
let url = "http://spezifisch-hangman.herokuapp.com/?test";
async function wakeServer() {
    await fetch(url);
}
window.open("index.html?test", "_self");
window.close();
//# sourceMappingURL=script.js.map