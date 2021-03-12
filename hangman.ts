"https://spezifisch-hangman.herokuapp.com";
require("dotenv").config();
import * as Discord from "discord.js";
const client: Discord.Client = new Discord.Client();
import * as Http from "http";
import * as Mongo from "mongodb";

let word: string = "word";

client.on("ready", () => {
    console.log("I am ready!");
});

interface WordList {
    words: string;
    word: string[];
}

let words: Mongo.Collection;
let users: Mongo.Collection;
let hiddenword: string;
client.on("message", message => {
    if (message.author.bot) return;
    // The process.env.PREFIX is your bot's prefix in this case.
    if (message.content.indexOf(process.env.PREFIX) !== 0) return;

    // This is the usual argument parsing we love to use.
    const args: string[] = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const command: string = args.shift().toLowerCase();
    let param: string;
    if (args.length > 0) {
        param = args.shift().toLowerCase();
    }
    // And our 2 real basic commands!
    if (command === "ping") {
        message.channel.send("Pong!");
    } else
        if (command === "link") {
            message.channel.send("[wake me up](spezifisch-de.github.io/MyHangmanBot/index.html)");
        } else
            if (command === "hangman") {
                async function loadWordList(): Promise<void> {
                    let wordlist: WordList = JSON.parse(JSON.stringify(await words.findOne({ "words": "words" })));
                    word = wordlist.word[(Math.round(Math.random() * (wordlist.word.length - 1)))];
                }
                loadWordList().then(() => {
                    hiddenword = "";
                    for (let i: number = 0; i < word.length; i++) {
                        hiddenword += "?";
                    }
                    message.channel.send(hiddenword);
                });
            } else if (command === "addword") {
                async function addword(): Promise<void> {
                    let wordlist: WordList = JSON.parse(JSON.stringify(await words.findOne({ "words": "words" })));
                    let allwords: string[] = wordlist.word;
                    if (param != undefined) {
                        allwords.push(param);
                        wordlist.word = allwords;
                        await words.findOneAndDelete({ "words": "words" });
                        await words.insertOne(wordlist);
                        message.channel.send("new word added!");
                    } else {
                        message.channel.send("no word was given!");
                    }
                }
                addword();
            } else if (command == "char") {
                if (param != undefined) {
                    ;
                }
            }
});
let port: number = Number(process.env.PORT);
if (!port)
    port = 8100;
let databaseUrl: string = "mongodb+srv://Fabian:Fabian@specificcluster.n4qe3.mongodb.net/Test?retryWrites=true&w=majority";
startServer(port);
connectToDatabase(databaseUrl);
function startServer(_port: string | number): void {
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(_port);
}
async function connectToDatabase(_url: string): Promise<void> {
    let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
    await mongoClient.connect();
    users = mongoClient.db("Test").collection("hangman");
    words = mongoClient.db("Test").collection("words");
    console.log("Database connected: " + users != undefined);
}
function handleListen(): void {
    console.log("Listening");
}
function handleRequest(): void {
    console.log("request send");
}

// There's zero need to put something here. Discord.js uses process.env.CLIENT_TOKEN if it's available,
// and this is what is being used here. If on discord.js v12, it's DISCORD_TOKEN
client.login();