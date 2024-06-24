const express = require('express');
const app = express();
const router=express.Router();

const {createUser}=require('./controllers')
const {loginUser}= require('./controllers')
//const {validateUserSchema}=require('../utils/validation')

app.use('/',router);

router.post('/register',createUser)
router.post('/login/:id',loginUser)

module.exports=router;
