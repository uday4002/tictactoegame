const express=require("express");
const app=express();
const http=require("http");
const cors=require("cors");
const {Server} =require("socket.io");

app.use(cors());

const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET" , "POST"],
    },
});

io.on("connection",(socket)=>{
    console.log(`USER CONNECTED WITH ID ${socket.id}`);

    socket.on("join_room",(data)=>{
        socket.join(data);
    });

    socket.on("send_move",(data)=>{
        socket.to(data.code).emit("receive_move",data);
    });

    socket.on("disconnect",()=>{
        console.log(`USER DISCONNECTED ${socket.id}`);
    });
});

server.listen(3002,()=>
{
    console.log("SERVER CREATED");
});
