import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const API_URL = "http://api.mediastack.com/v1/news?access_key=d617cc4c7d24401d55661168751f19b2&keywords=wellness &limit=1&categories=health&languages=en";
const app = express();
const port = 3000;
var taskList = [];
var taskListW = [];
const { connectToMongoDB } = require('./db');
connectToMongoDB();
const { client } = require('./db');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
/*app.get("/", (req, res) =>{
  res.render("index.ejs", { tasks: taskList});
});*/
app.get('/', async (req, res) => {
  const tasksCollection = client.db('local').collection('tasks');

  try {
    const tasks = await tasksCollection.find().toArray();
    res.render('index.ejs', { tasks: tasks.map(task => task.task) });
  } catch (error) {
    console.error('Error fetching tasks from MongoDB:', error);
  }
});
/*app.get("/work", (req, res) => {
  res.render("work.ejs", { wTasks: taskListW});
});*/
app.get("/work", async (req, res) => {
  const tasksCollectionW = client.db('local').collection('wTasks');

  try {
    const workTasks = await tasksCollectionW.find().toArray();
    res.render("work.ejs", { wTasks: workTasks.map(task => task.task) });
  } catch (error) {
    console.error('Error fetching work tasks from MongoDB:', error);
  }
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});
app.get("/zentips", async (req, res) => {
  //res.render("zentips.ejs");
  //const searchId = req.body.id;
  
  try {
    const result = await axios.get(API_URL);
    res.render("zentips.ejs", { title: (result.data.data[0].title), author: (result.data.data[0].author), description: (result.data.data[0].description), link: (result.data.data[0].url), image: (result.data.data[0].image) });

  } catch (error) {
    //res.render("zentips.ejs", { content: JSON.stringify(error.response.data)});
    res.render("zentips.ejs", { title: JSON.stringify("An error occured. Pleae try again.")});
  }
});
/*app.post("/submit", (req, res) => {
  console.log(req.body);
  taskList.push(req.body["task"]);
  res.render("index.ejs", { tasks: taskList});
});*/
app.post('/submit', async (req, res) => {
  const newTask = req.body.task;
  const tasksCollection = client.db('local').collection('tasks');

  try {
    const result = await tasksCollection.insertOne({ task: newTask });
    console.log('Task added to MongoDB:', result.ops[0]);
    res.render('index.ejs', { tasks: taskList });
  } catch (error) {
    console.error('Error adding task to MongoDB:', error);
  }
});
/*app.post("/wsubmit", (req, res) => {
  console.log(req.body);
  taskListW.push(req.body["task"]);
  res.render("work.ejs", { wTasks: taskListW});
});*/
app.post("/wsubmit", async (req, res) => {
  const newWorkTask = req.body.task;
  const tasksCollectionW = client.db('local').collection('wTasks');

  try {
    const result = await tasksCollectionW.insertOne({ task: newWorkTask });
    console.log('Work task added to MongoDB:', result.ops[0]);
    res.redirect('/work');
  } catch (error) {
    console.error('Error adding work task to MongoDB:', error);
  }
});
app.post("/delete", (req, res) => {
  console.log("delete req body");
  console.log(req.body.entries);
  //var found = taskList.find(element => element == 0); 
  for(var j = 0; j < taskList.length; j++){
    //debug command
    taskList = [];
    console.log("one iteration of the delete loop just ran.");

    var criteria = "theTask" + j;
    //if(criteria == theTask ){
    //taskList.splice(j, 1);
    //}
    
  }
  res.render("index.ejs", { tasks: taskList});
});
app.post("/wdelete", (req, res) => {
  console.log("delete req body");
  console.log(req.body.entries);
  //var found = taskList.find(element => element == 0); 
  for(var j = 0; j < taskListW.length; j++){
    //debug command
    taskListW = [];
    console.log("one iteration of the delete loop just ran.");

    var criteria = "theTask" + j;
    //if(criteria == theTask ){
    //taskList.splice(j, 1);
    //}
    
  }
  res.render("work.ejs", { wTasks: taskListW});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
