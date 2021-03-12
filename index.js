require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client();
const Http = require("http");
const Mongo = require("mongodb");

let word = 'word';
let hiddenword;

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
  if (command === 'ping') {
    message.channel.send('Pong!');
  } else
    if (command === 'link') {
      message.channel.send("[wake me up](https://spezifisch-de.github.io/MyHangmanBot/index.html)");
    } else
      if (command === 'hangman') {
        async function loadWordList() {
          let wordlist = JSON.parse(JSON.stringify(await words.findOne({ "words": "words" })));
          word = wordlist.word[(Math.round(Math.random() * (wordlist.word.length - 1)))];
        }
        loadWordList().then(() => {
          hiddenword = "";
          for (let i = 0; i < word.length; i++) {
            hiddenword += "?";
          }
          message.channel.send(hiddenword);
        });
      }
      else if (command === "addword") {
        async function addword() {
          let wordlist = JSON.parse(JSON.stringify(await words.findOne({ "words": "words" })));
          let allwords = wordlist.word;
          if (param != undefined) {
            allwords.push(param);
            wordlist.word = allwords;
            await words.findOneAndDelete({ "words": "words" });
            await words.insertOne(wordlist);
            message.channel.send("new word added!");
          }
          else {
            message.channel.send("no word was given!");
          }
        }
        addword();
      } else if (command == "char" && hiddenword != undefined) {
        if (param != undefined) {
          if (param.length == 1) {
            let newHiddenWord = "";
            for (let i = 0; i < word.length; i++) {
              if (word.charAt(i) == param) {
                newHiddenWord += word.charAt(i);
              }
              else {
                newHiddenWord += hiddenword.charAt(i);
              }
            }
            hiddenword = newHiddenWord;
            message.channel.send(hiddenword);
            if (hiddenword == word) {
                message.channel.send("word is correct!");
                message.channel.send("type !hangman to recieve a new word.");
                hiddenword = undefined;
            }
          }
        }
      }
});

let words;
let users;
let port = Number(process.env.PORT);
if (!port)
  port = 8100;
let databaseUrl = process.env.DBURL;
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