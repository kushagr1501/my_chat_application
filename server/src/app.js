import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from "cors";
import cookieParser from 'cookie-parser';
import routes from './routes/index.routes.js';
import { userInfo } from 'os';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/", routes);

// 404 Handler for missing routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Socket.IO setup using the **same server**
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  },
});

const userSocketMap = {};  // { userId: socketId }

export function getReceiverSocketId(recId){
  return userSocketMap[recId]
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const { userId } = socket.handshake.query;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} connected with socket ${socket.id}`);
  }

  io.emit("getOnlineUsers",Object.keys(userSocketMap))

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers",Object.keys(userSocketMap)) 
    }
  });
});


export { io, app, server }; 
