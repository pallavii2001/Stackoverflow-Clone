const express = require('express');
const app = express();
const router=express.Router();

//const {validateAnswerSchema}=require('../utils/validation')
const {insertAnswer}=require('./controllers')
const {updateAnswer}=require('./controllers')
const {deleteAnswer}=require('./controllers')
const authenticate=require('../utils/auth')

app.use('/',router);

router.post('/createanswer',authenticate,insertAnswer)
router.patch('/updateanswer',authenticate,updateAnswer)
router.delete('/deleteanswer',authenticate,deleteAnswer)

module.exports=router;