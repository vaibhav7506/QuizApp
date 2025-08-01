import * as http from 'http';

import { Server } from "socket.io";

const server = http.createServer();


export class IoManager {
     private static io: Server; // Replace 'any' with the actual type of your Socket.IO instance
//singletons    
   public static getIo(){
      if(!this.io){
        const io = new Server(server,{
          cors :{
            origin: "*", // Allow all origins for simplicity, adjust as needed 
            methods: ["GET", "POST"],
          }
        });
        
        this.io = io;
      }
    
      return this.io;
   }
}