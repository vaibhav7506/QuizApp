"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoManager = void 0;
var http = require("http");
var socket_io_1 = require("socket.io");
var server = http.createServer();
var IoManager = /** @class */ (function () {
    function IoManager() {
    }
    //singletons    
    IoManager.getIo = function () {
        if (!this.io) {
            var io = new socket_io_1.Server(server, {
                cors: {
                    origin: "*", // Allow all origins for simplicity, adjust as needed 
                    methods: ["GET", "POST"],
                }
            });
            this.io = io;
        }
        return this.io;
    };
    return IoManager;
}());
exports.IoManager = IoManager;
