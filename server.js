const express= require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const server = require("http").Server(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
server.listen(port);
app.use(express.static("build"));
const io = require("socket.io")(server);
const mongoose = require('mongoose');

mongoose.connect('mongodb://207.148.67.200:27017/baitaptuan2',{ useNewUrlParser: true ,useUnifiedTopology: true});
const todoListSchema = new mongoose.Schema({
    name:String,
    level:Number,
});

const todoListInfos = mongoose.model('todoListInfos', todoListSchema);

// todoListInfos.create({
//     name:'test1',
//     level:1,
// })

// todoListInfos.create({
//     name:'test2',
//     level:2,
// })

// todoListInfos.create({
//     name:'test3',
//     level:3,
// }) 

io.on('connection',async function(socket){
    const todoList = await todoListInfos.find({})
    socket.emit('get-data',todoList);
    socket.on('delete-task',taskID=>{
        todoListInfos.findByIdAndDelete(taskID,(err)=>{
            socket.emit('deleted-task',taskID)
        })
    })
    socket.on('add-task',data=>{
        console.log(data)
        todoListInfos.create({
            name:data.name,
            level:data.level
        },function(err,task){
            socket.emit('add-task-success',task)
        })
    })
    socket.on('edit-task',data=>{
        console.log(data)
        todoListInfos.findByIdAndUpdate(
            data.taskID,
            {
                name:data.name,
                level:data.level
            },  
            {upsert: true, new: true, runValidators: true},
            function(err){socket.emit('edit-success')},
        )
    })
})


app.get('/',(req,res)=>{
    res.sendFile('./build/index.html')
})