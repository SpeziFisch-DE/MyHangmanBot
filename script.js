"use strict";
function getSubpage() {
    return window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
}
let url = "https://spezifisch-hangman.herokuapp.com/?test";
async function wakeServer() {
    await fetch(url);
}
wakeServer().catch(() => {
    console.log("something went wrong!");
});
//# sourceMappingURL=script.js.map