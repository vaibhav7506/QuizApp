"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
var QuizManager_1 = require("./QuizManager");
var ADMIN_PASSWORD = 'admin123'; // Example admin password, should be stored securely 
var UserManager = /** @class */ (function () {
    function UserManager() {
        this.quizManager = new QuizManager_1.QuizManager;
    }
    UserManager.prototype.addUser = function (socket) {
        // Logic to add a user to a room
        this.createHandlers(socket);
    };
    UserManager.prototype.createHandlers = function (socket) {
        var _this = this;
        // Logic to create handlers for the user
        socket.on('join', function (data) {
            var userId = _this.quizManager.addUser(data.roomId, data.name);
            socket.emit('init', {
                userId: userId,
                state: _this.quizManager.getCurrentState(data.roomId)
            });
        });
        socket.on('joinAdmin', function (data) {
            if (data.password !== ADMIN_PASSWORD) {
                return;
            }
            socket.on("create_quiz", function (data) {
                _this.quizManager.addQuiz(data.roomId);
            });
            socket.on("create_problem", function (data) {
                _this.quizManager.addProblem(data.roomId, data.problem);
            });
            socket.on("next", function (data) {
                _this.quizManager.next(data.roomId);
            });
        });
        socket.on('submit ', function (data) {
            var userId = data.userId;
            var problemId = data.problemId;
            var submission = data.submission;
            var roomId = data.submission;
            if (submission != 0 || submission != 1 || submission != 2 || submission != 3) {
                console.error('Invalid submission value' + submission);
                return;
            }
            _this.quizManager.submit(userId, roomId, problemId, submission);
        });
    };
    return UserManager;
}());
exports.UserManager = UserManager;
