const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

/*const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};*/

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.

const fs = require("fs");
const dataBase = "database.json";

//Function
function getMessages() {
  let rawdata = fs.readFileSync(dataBase);
  return JSON.parse(rawdata);
};

function saveMessages(arr) {
  let data = JSON.stringify(arr, null, 2);
  fs.writeFileSync(dataBase, data);
};

function getAllMessages(req, res) {
  let message = getMessages();
  res.send(message);
};

function getAllMessagesById(req, res) {
  let message = getMessages();
  let resultOfArray = message.filter((item) => {
    if (item.id == req.params.id) {
      return true;
    }
  });
  res.send(resultOfArray);
};

function postMessageSave(req, res) {
  if (req.body.from == "") {
    res.status(400).send("you have to provide a from");
  }
  if (req.body.text == "") {
    res.status(400).send("you have to provide a text");
  }
  if (req.body.text != "" && req.body.text != "") {
    let message = getMessages();
    let newMessage = req.body;
    newMessage.id = message.length;
    message.push(req.body);
    saveMessages(message);
    res.send(newMessage);
  }
};

function deleteMessage(req, res) {
  let message = getMessages();
  let messageToBeDeleted = req.params.id;

  let resultOfArray = message.filter((item) => {
    if (item.id != messageToBeDeleted) {
      return true;
    }
  });
  saveMessages(resultOfArray);
  res.send(newMessage);
};

function getAllMessagesLast(req, res) {
  let message = getMessages();
  let resultOfArray = message.slice(0, 9);

  res.send(resultOfArray);
};

function getAllMessagesSearch(req, res) {
  let searchText = req.query.text;
  let message = getMessages();
  let resultOfArray = message.filter((item) => {
    if (item.text.includes(searchText)) {
      return true;
    }
  });
  res.send(resultOfArray);
};

//Middleware
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get('/messages', getAllMessages)
app.get('/messages/:id', getAllMessagesById)
app.get('/messages/:latest', getAllMessagesLast)
app.get('/messages/:search', getAllMessagesSearch)
app.post('/messages', postMessageSave)
app.delete('/messages/:id', deleteMessage)


app.listen(3000, () => {
  console.log("Listening on port 3000");
});
