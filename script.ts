function getSubpage(): string {
    return window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
}

let url: string = "https://spezifisch-hangman.herokuapp.com/?test";
async function wakeServer(): Promise<void> {
    await fetch(url);
}
wakeServer().catch(() => {
    console.log("something went wrong!");
});