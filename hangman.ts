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
client.on("message", message => {
    if (message.author.bot) return;
    // The process.env.PREFIX is your bot's prefix in this case.
    if (message.content.indexOf(process.env.PREFIX) !== 0) return;

    // This is the usual argument parsing we love to use.
    const args: any = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const command: string = args.shift().toLowerCase();

    // And our 2 real basic commands!
    if (command === "ping") {
        message.channel.send("Pong!");
    } else
        if (command === "blah") {
            message.channel.send("Meh.");
        } else
            if (command === "hangman") {
                async function loadWordList(): Promise<void> {
                    let wordlist: WordList = JSON.parse(JSON.stringify(await words.findOne({ "words": "words" })));
                    word = wordlist.word[0];
                }
                loadWordList().then(() => {
                    message.channel.send(word);
                });
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