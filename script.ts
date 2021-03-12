let url: string = "http://spezifisch-hangman.herokuapp.com/?test";
async function wakeServer(): Promise<void> {
    await fetch(url);
}
window.open("index.html?test", "_self");
window.close();