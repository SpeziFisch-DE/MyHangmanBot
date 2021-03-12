function getSubpage(): string {
    return window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
}

let url: string = "http://spezifisch-hangman.herokuapp.com/?test";
async function wakeServer(): Promise<void> {
    await fetch(url);
}
if (getSubpage() == "index.html") {
    window.open("index.html?test", "_self");
}
if (getSubpage() == "index.html?test") {
    window.close();
}