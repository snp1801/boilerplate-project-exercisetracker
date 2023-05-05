const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sam1811harper:ila!1801@cluster0.2wrrnxn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
require('dotenv').config()

var Schema = mongoose.Schema
const userSchema = new Schema({
  userName: {
    type : String,
    required : true
  }
});

var User = mongoose.model('User', userSchema)

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req,res) => {
  // const user = req.body.username
  // console.log(user)
  var curr = new User({ userName : req.body.username });
  curr.save((err, data) => {
    if (err) return res.json({error: err})
    // console.log(data)
    res.json({userName: data.userName, _id: data._id})
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
