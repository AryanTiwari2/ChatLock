const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const app = express();
const Port = 4500;
app.use(cors());
app.get("/",(req,res)=>{
    res.send("<h1>Hello World</h1>");
})

const Users = [{}];
const server = http.createServer(app);

const io = socketIO(server);
io.on("connection",(socket)=>{
    console.log("New Connection");

    socket.on("joined",(data)=>{
        Users[socket.id] = data.User;
        socket.emit('welcome',{id:socket.id,User:`${Users[socket.id]}`,mesg:'Welcome to the chat'});
    })
    socket.on('message',({id,mesg,User})=>{
        io.emit('sendMessage',{id,User,mesg});
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{id:socket.id,User:`${Users[socket.id]}`,mesg:`${Users[socket.id]} left the chat`});
        console.log("user left");
    });
})





server.listen(Port,(req,res)=>
{
    console.log(`server is working on ${Port}`);
})
