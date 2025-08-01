import { title } from "process";
import { AllowedsubmissionType, Quiz } from "../Quiz";
import { IoManager } from "./IoManager";
let globalProblemId=0;

export class QuizManager{
    private quizes: Quiz[]; // Assuming Quiz is a defined type or class
constructor() {
        this.quizes = [];
    }   
    public start(roomId: string) {
     const quiz = this.getQuiz(roomId);
     if (!quiz) {
         return;
     }
     quiz.start();
    }
    public addProblem(roomId: string,problem:{
        title : string;
        description:  string;
        image?:  string;
        options: {
            id: number,
            title: string,
        }[];
        answer : AllowedsubmissionType 
    }){
     const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem({
            ...problem,
            id: (globalProblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: [],
            
        });
    }




    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);
     if (!quiz) {
         return;
     }
        quiz.next();
       }
    addUser(roomId: string, name: string) {
        this.getQuiz(roomId)?.addUser(name);
    }

    submit(roomId: string, userId: string, problemId: string, submission: 0|1|2|3) {
        this.getQuiz(roomId)?.submit(roomId, userId, problemId, submission);
     

    }
    getQuiz(roomId: string){
        return this.quizes.find(q => q.roomId === roomId)?? null;
    }

    getCurrentState(roomId: string): {
        type : "leaderboard",
        leaderboard: any,
    }|{
        type: "problem",
        problem: any,
    }{

     const quiz = this.quizes.find(q => q.roomId === roomId);
     if (!quiz) {
         return null
     }else{
        quiz.getCurrentState();
     }
    }
    addQuiz(roomId: string) {
        if(this.getQuiz(roomId)){
            return; // Quiz already exists for this room
        }
        const quiz = new Quiz(roomId);
        this.quizes.push(quiz);
    }

}

