require('dotenv').config(); 
const Discord = require("discord.js");
const client = new Discord.Client();
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");

let word = 'word';

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.author.bot) return;
  // The process.env.PREFIX is your bot's prefix in this case.
  if (message.content.indexOf(process.env.PREFIX) !== 0) return;

  // This is the usual argument parsing we love to use.
  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let param;
  if (args.length > 0) {
      param = args.shift().toLowerCase();
  }

  // And our 2 real basic commands!
  if(command === 'ping') {
    message.channel.send('Pong!');
  } else
  if (command === 'link') {
    let myEmbed;
    myEmbed.addField("","wake me up [here](spezifisch-de.github.io/MyHangmanBot/index.html)")
    message.channel.send(myEmbed);
  } else
  if (command === 'hangman'){
    async function loadWordList() {
        let wordlist = JSON.parse(JSON.stringify(await words.findOne({ "words": "words" })));
        word = wordlist.word[(Math.round(Math.random() * (wordlist.word.length - 1)))];
    }
    loadWordList().then(() => {
        message.channel.send(word);
    });
  }
  else if (command === "addword") {
      async function addword() {
          let wordlist = JSON.parse(JSON.stringify(await words.findOne({ "words": "words" })));
          let allwords = wordlist.word;
          if (param != undefined) {
              allwords.push(param);
              wordlist.word = allwords;
              await words.findOneAndReplace({ "words": "words" }, wordlist).then(() => {
                message.channel.send("word added!");
              });
          }
      }
      addword().catch(() => {
        console.log("something went wrong!");
    });
  }
});

let words;
let users;
let port = Number(process.env.PORT);
if (!port)
    port = 8100;
let databaseUrl = "mongodb+srv://Fabian:Fabian@specificcluster.n4qe3.mongodb.net/Test?retryWrites=true&w=majority";
startServer(port);
connectToDatabase(databaseUrl);
function startServer(_port) {
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(_port);
}
async function connectToDatabase(_url) {
    let options = { useNewUrlParser: true, useUnifiedTopology: true };
    let mongoClient = new Mongo.MongoClient(_url, options);
    await mongoClient.connect();
    users = mongoClient.db("Test").collection("hangman");
    words = mongoClient.db("Test").collection("words");
    console.log("Database connected: " + users != undefined);
}
function handleListen() {
  console.log("Listening");
}
function handleRequest() {
  console.log("request send");
}

// There's zero need to put something here. Discord.js uses process.env.CLIENT_TOKEN if it's available,
// and this is what is being used here. If on discord.js v12, it's DISCORD_TOKEN
client.login();