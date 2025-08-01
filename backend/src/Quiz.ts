import { IoManager } from "./managers/IoManager";
export type AllowedsubmissionType =0|1|2|3; // Assuming these are the possible submission types
const PROBLEM_TIME_S = 20; // Time in seconds for each problem



interface User {
    name: string;
    id : string;
    points?: number; // Optional, can be used to track user points
}

interface Submission {
    problemId: string;
    userId: string;
    isCorrect?: boolean; // Optional, can be used to indicate if the submission was correct
    optionSelected:AllowedsubmissionType; // The option selected by the user
}
interface Problem{
    id: string;
    title: string;
    description: string;
    startTime: number; // Optional, can be used to indicate when the problem starts
    endTime?: number; // Optional, can be used to indicate when the problem ends
    image?: string;
    answer:AllowedsubmissionType; // The correct answer option
    options: {
        id: number,
        title: string,
    }[]
    submissions : Submission[]
}

export class Quiz{
    public roomId: string;
    private problems: Problem[];
    private hasStarted: boolean;
    private currentProblemIndex: number;
    private users : User[];
    private currentState : "leaderboard"| "problem" | "not_started"|"ended"; // Current state of the quiz, can be "leaderboard" or "problem"

    constructor(roomId: string) {
       this.roomId = roomId;
       this.hasStarted = false;
       this.problems = [];
       this.currentProblemIndex = 0;
       this.users = [];
       this.currentState = "not_started"; // Initialize current state to null
       setInterval(() => {
        this.debug();
       },10000)
    }
    debug(){
        console.log("-----debug-----");
        console.log(this.roomId);
        console.log("Problems: ", JSON.stringify(this.problems));
        console.log("Users: ", this.users);
        console.log(this.currentState);
        console.log("Current Problem Index: ", this.currentProblemIndex);

    }
    addProblem(problem: Problem){
      this.problems.push(problem);
      console.log(this.problems);
    }
    start(){
        this.hasStarted = true;
        
        this.setActiveProblem(this.problems[0]) // Reset current problem index

        
    }
    setActiveProblem(problem : Problem) {
        this.currentState = "problem"; // Set current state to problem

        problem.startTime = new Date().getTime();
        problem.submissions = []; // Reset submissions for the new problem
        IoManager.getIo().to(this.roomId).emit('problem', {
            problem
        })
        setTimeout(() => {
           this.sendLeaderboard();
        }, PROBLEM_TIME_S * 1000); // Set a timeout for the problem duration
    }

    sendLeaderboard() {
        console.log("Sending leaderboard");
        this.currentState = "leaderboard" // Set current state to problem

      const leaderboard = this.getLeaderboard(); // Get top 10 users
      IoManager.getIo().to(this.roomId).emit('leaderboard', {
            leaderboard,
      });
    }


    next() {
        this.currentProblemIndex++;
        const  problem = this.problems[this.currentProblemIndex];

        if(problem){
        this.setActiveProblem(problem) // Reset current problem index


           
        }else{
            this.currentProblemIndex--;
     
        }
    }
    genRandonString(length: number){
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        var charsLength = chars.length;
        var result = '';
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charsLength));
        }
        return result;
    }

    addUser(name: string) {
        const id = this.genRandonString(8);
       this.users.push({
          id,
          name,
          points: 0 // Initialize points to 0
    })  
    return id;
}
            
submit(roomId: string, userId: string, problemId: string, submission:AllowedsubmissionType) {
    const problem = this.problems.find(q => q.id === problemId);
    const user = this.users.find(q => q.id === userId);     
    if(!problem|| !user){
        return;
    }
        const existingSubmission = problem.submissions.find(q => q.userId === userId);
        if(existingSubmission){
            return
        }else{
            problem.submissions.push({
                problemId,
                userId,
                isCorrect : problem.answer === submission, // Optional, can be used to indicate if the submission was correct
                optionSelected: submission // The option selected by the user
                
            })
            
        }
        user.points +=1000 - 500 * (new Date().getTime() - problem.startTime)/20; // Calculate points based on time taken to answer
    }
    getLeaderboard() {
        return this.users.sort((a, b )=> a.points < b.points ? 1 : -1).slice(0, 20)
     }

     getCurrentState(){
        if(this.currentState === "not_started"){
            return {
                type: "not_started",
                message: "Quiz has not started yet"
        }
     }
      if(this.currentState === "ended"){
            return {
                type: "ended",
                leaderboard : this.getLeaderboard()
            }
        }
        if(this.currentState === "leaderboard"){
            return {
                type: "leaderboard",
                leaderboard : this.getLeaderboard()
            }
        }
        if(this.currentState === "problem"){
        const  problem = this.problems[this.currentProblemIndex];

            return {
                type: "problem",
               problem 
            }
        }
    }
}
// 2hr 48 min pr stop tha last time