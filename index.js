const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sam1811harper:ila!1801@cluster0.2wrrnxn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
require('dotenv').config()

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var Schema = mongoose.Schema
const userSchema = new Schema({
  userName: {
    type : String,
    required : true,
    unique: true
  }
});

const logSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  description: {
    type: String, required: true
  },
  duration : {
    type: Number, required: true
  },
  date: {
    type : String
  }
});

var User = mongoose.model('User', userSchema)
var Log = mongoose.model('log', logSchema)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/test", (req, res) => {
  res.json({greet : "Working"})
})

app.post('/api/users', (req,res) => {
  // const user = req.body.username
  // console.log(user)
  var curr_user = new User({ userName : req.body.username });
  curr_user.save((err, data) => {
    if (err) return res.json({error: err})
    // console.log(data)
    res.json({userName: data.userName, _id: data._id})
  })
})
app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
    return res.json(users);
  });
});


app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date = new Date() } = req.body;
  const id = req.params._id;
  const new_date = new Date(date)
  const dayOfWeek = daysOfWeek[new_date.getDay()];
  const month = monthsOfYear[new_date.getMonth()];
  const dayOfMonth = new_date.getDate();
  const year = new_date.getFullYear();
  const formattedDate = `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
  User.findById(id, (err, user) => {
    // const user_n = user.userName;
    const uName = user.userName;
    if (err) return console.log(err);
    var arr = { 'userName': uName,  "description": description, "duration": duration, "date": formattedDate }
    console.log(arr);
    const curr_log = new Log( arr )
    // console.log(curr_log);
    curr_log.save((err, data) => {
      if (err) return res.json({error: err})
      // data["_id"] = id;
      // data["userName"] = user.userName;
      console.log(data)
      // res.json(data)
    })
    // console.log(user)
    arr["_id"] = id;
    res.json(arr)
  })
})


app.get('/api/users/:_id/logs', (req, res) => {
  const ID = req.params._id;
  User.findById(ID, (err, user) => {
    const uName = user.userName;
    if (err) return console.log(err);
    Log.find({"userName": uName}, (err, logs) => {
      if (err) return console.log(err);
      const out = []
      for (let i=0; i<logs.length; i++){
        const arr = {"description":logs[i].description, "duration": logs[i].duration, "date": logs[i].date}
        out.push(arr)
        // console.log(logs[i].description)
      }
      // console.log(out)
      res.json({'_id': ID, 'userName': uName,'count': out.length,'logs':out})
    })
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
