import { Socket } from 'socket.io';
import { QuizManager } from './QuizManager';
const ADMIN_PASSWORD = 'admin123'; // Example admin password, should be stored securely 

export class UserManager{
    
    private  quizManager;
    constructor() {
        this.quizManager = new QuizManager;
    
}
addUser( socket: Socket) {
    // Logic to add a user to a room
   
    this.createHandlers(socket);
}
private createHandlers( socket: Socket) {
    // Logic to create handlers for the user
  socket.on('join', (data) => {
    const userId =  this.quizManager.addUser(data.roomId,data.name);
    socket.emit('init', {
        userId,
       state : this.quizManager.getCurrentState(data.roomId) 
   });
   socket.join(data.roomId);
  })
  socket.on('joinAdmin', (data) => {
    if(data.password !== ADMIN_PASSWORD){
        return
    }
   

    socket.on("create_quiz", (data) => {

     this.quizManager.addQuiz(data.roomId); 
    
})


   socket.on("create_problem", (data) => {
     this.quizManager.addProblem(data.roomId,data.problem) ;
    
  });

  socket.on("next", (data) => {
     this.quizManager.next(data.roomId) ;
    
  });

});
  socket.on('submit ', (data) => {
    const userId = data.userId;
    const problemId = data.problemId;
    const submission = data.submission;
    const roomId = data.submission;


    if(submission !=0 || submission !=1 || submission !=2 || submission !=3  ){
        console.error('Invalid submission value'+ submission);
        return
    }
    this.quizManager.submit(userId,roomId, problemId, submission);
  })

}

}