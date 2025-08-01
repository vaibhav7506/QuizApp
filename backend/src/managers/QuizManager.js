"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizManager = void 0;
var Quiz_1 = require("../Quiz");
var globalProblemId = 0;
var QuizManager = /** @class */ (function () {
    function QuizManager() {
        this.quizes = [];
    }
    QuizManager.prototype.start = function (roomId) {
        var quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.start();
    };
    QuizManager.prototype.addProblem = function (roomId, problem) {
        var quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem(__assign(__assign({}, problem), { id: (globalProblemId++).toString(), startTime: new Date().getTime(), submissions: [] }));
    };
    QuizManager.prototype.next = function (roomId) {
        var quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
    };
    QuizManager.prototype.addUser = function (roomId, name) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.addUser(name);
    };
    QuizManager.prototype.submit = function (roomId, userId, problemId, submission) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.submit(roomId, userId, problemId, submission);
    };
    QuizManager.prototype.getQuiz = function (roomId) {
        var _a;
        return (_a = this.quizes.find(function (q) { return q.roomId === roomId; })) !== null && _a !== void 0 ? _a : null;
    };
    QuizManager.prototype.getCurrentState = function (roomId) {
        var quiz = this.quizes.find(function (q) { return q.roomId === roomId; });
        if (!quiz) {
            return null;
        }
        else {
            quiz.getCurrentState();
        }
    };
    QuizManager.prototype.addQuiz = function (roomId) {
        if (this.getQuiz(roomId)) {
            return; // Quiz already exists for this room
        }
        var quiz = new Quiz_1.Quiz(roomId);
        this.quizes.push(quiz);
    };
    return QuizManager;
}());
exports.QuizManager = QuizManager;
