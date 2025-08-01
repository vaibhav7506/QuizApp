"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IoManager_1 = require("./managers/IoManager");
var UserManager_1 = require("./managers/UserManager");
var io = IoManager_1.IoManager.getIo();
io.listen(5173);
var userManager = new UserManager_1.UserManager();
io.on('connection', function (socket) {
    userManager.addUser(socket);
});
// io.listen(3000);
