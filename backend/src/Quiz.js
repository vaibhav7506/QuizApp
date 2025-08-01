"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
var IoManager_1 = require("./managers/IoManager");
var PROBLEM_TIME_S = 20; // Time in seconds for each problem
var Quiz = /** @class */ (function () {
    function Quiz(roomId) {
        var _this = this;
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.currentProblemIndex = 0;
        this.users = [];
        this.currentState = "not_started"; // Initialize current state to null
        setInterval(function () {
            _this.debug();
        }, 10000);
    }
    Quiz.prototype.debug = function () {
        console.log("-----debug-----");
        console.log(this.roomId);
        console.log("Problems: ", JSON.stringify(this.problems));
        console.log("Users: ", this.users);
        console.log(this.currentState);
        console.log("Current Problem Index: ", this.currentProblemIndex);
    };
    Quiz.prototype.addProblem = function (problem) {
        this.problems.push(problem);
        console.log(this.problems);
    };
    Quiz.prototype.start = function () {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]); // Reset current problem index
    };
    Quiz.prototype.setActiveProblem = function (problem) {
        var _this = this;
        this.currentState = "problem"; // Set current state to problem
        problem.startTime = new Date().getTime();
        problem.submissions = []; // Reset submissions for the new problem
        IoManager_1.IoManager.getIo().emit('change_problem', {
            problem: problem
        });
        setTimeout(function () {
            _this.sendLeaderboard();
        }, PROBLEM_TIME_S * 1000); // Set a timeout for the problem duration
    };
    Quiz.prototype.sendLeaderboard = function () {
        console.log("Sending leaderboard");
        this.currentState = "leaderboard"; // Set current state to problem
        var leaderboard = this.getLeaderboard(); // Get top 10 users
        IoManager_1.IoManager.getIo().to(this.roomId).emit('leaderboard', {
            leaderboard: leaderboard,
        });
    };
    Quiz.prototype.next = function () {
        this.currentProblemIndex++;
        var problem = this.problems[this.currentProblemIndex];
        if (problem) {
            this.setActiveProblem(problem); // Reset current problem index
        }
        else {
            //SEND FINAL RESULTS
            // IoManager.getIo().emit('quiz_finished', {
            //     message: 'Quiz has finished'
            // });
        }
    };
    Quiz.prototype.genRandonString = function (length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        var charsLength = chars.length;
        var result = '';
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return result;
    };
    Quiz.prototype.addUser = function (name) {
        var id = this.genRandonString(8);
        this.users.push({
            id: id,
            name: name,
            points: 0 // Initialize points to 0
        });
        return id;
    };
    Quiz.prototype.submit = function (roomId, userId, problemId, submission) {
        var problem = this.problems.find(function (q) { return q.id === problemId; });
        var user = this.users.find(function (q) { return q.id === userId; });
        if (!problem || !user) {
            return;
        }
        var existingSubmission = problem.submissions.find(function (q) { return q.userId === userId; });
        if (existingSubmission) {
            return;
        }
        else {
            problem.submissions.push({
                problemId: problemId,
                userId: userId,
                isCorrect: problem.answer === submission, // Optional, can be used to indicate if the submission was correct
                optionSelected: submission // The option selected by the user
            });
        }
        user.points += 1000 - 500 * (new Date().getTime() - problem.startTime) / 20; // Calculate points based on time taken to answer
    };
    Quiz.prototype.getLeaderboard = function () {
        return this.users.sort(function (a, b) { return a.points < b.points ? 1 : -1; }).slice(0, 20);
    };
    Quiz.prototype.getCurrentState = function () {
        if (this.currentState === "not_started") {
            return {
                type: "not_started",
                message: "Quiz has not started yet"
            };
        }
        if (this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard()
            };
        }
        if (this.currentState === "problem") {
            var problem = this.problems[this.currentProblemIndex];
            return {
                type: "problem",
                problem: problem
            };
        }
    };
    return Quiz;
}());
exports.Quiz = Quiz;
// 2hr 48 min pr stop tha last time
