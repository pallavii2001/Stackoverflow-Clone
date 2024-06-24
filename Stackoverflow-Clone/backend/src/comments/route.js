const express = require('express');
const app = express();
const router=express.Router();
//const {validateCommentSchema}=require('../utils/validation')
const {insertComments}=require('./controllers')
const {updateComments}=require('./controllers')
const {deleteComments}=require('./controllers')
const authenticate=require('../utils/auth')

app.use('/',router);

router.post('/createcomment',authenticate,insertComments)
router.patch('/updatecomment',authenticate,updateComments)
router.delete('/deletecomment',authenticate,deleteComments)

module.exports=router;