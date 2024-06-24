const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const express=require('express')
const app = express();
const cors = require('cors');

const user=require('./users/route');
const question=require('./questions/route')
const answer=require('./answers/route')
const comment=require('./comments/route')
const {errorHandler}=require('./utils/errorHandler')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/user',user)
app.use('/question',question)
app.use('/answer',answer)
app.use('/comment',comment)

app.use(errorHandler) 

app.listen(3007, (err) => {
    if (err) {
        throw err;
    } else {
        console.log('Server running on port 3007');
    }
});

app.get('/', (req, res) => {
    res.send('hello world');
});