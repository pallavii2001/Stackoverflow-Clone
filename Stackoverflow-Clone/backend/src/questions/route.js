const express = require('express');
const app = express();
const router=express.Router();

// const {validateQuestionSchema}=require('../utils/validation')
const {insertQuestion}=require('./controllers')
const {updateQuestion}=require('./controllers')
const {deleteQuestion}=require("./controllers")
const {searchQuestion}=require('./controllers')
const {fetchQuestions}=require('./controllers')
const authenticate=require('../utils/auth')

app.use('/',router);
router.get('/viewquestions',fetchQuestions)
router.get('/searchquestion',searchQuestion)
router.post('/createquestion',authenticate,insertQuestion)
router.patch('/updatequestion',authenticate,updateQuestion)
router.delete("/deleteQuestion",authenticate,deleteQuestion)

module.exports=router;