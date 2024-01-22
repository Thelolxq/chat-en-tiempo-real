const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin: 'http://localhost:5173',
        methods: ["GET","POST"]
    }
})

//socket.io------------------------------------------------------

io.on('connection', (socket)=>{
        console.log(`usuario actual ${socket.id}`)

        socket.on ('join_room',(data)=>{
            socket.join(data)
            console.log(`usuario con id: ${socket.id} se unio a la sala ${data}`)
        })
        socket.on ('send_message',(data)=>{
            socket.to(data.room).emit('receive_message', data)
            
        })
        socket.on('disconnect', ()=>{
            console.log("usuario desconectado", socket.id)
        })
})

//long-polling----------------------------------------------------




server.listen(9000, ()=> {
    console.log("servidor corriendo en el puerto 9000")
})