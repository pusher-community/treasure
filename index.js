require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const randomColor = require('randomcolor')

const Pusher = require('pusher')
const pusher = new Pusher({
  appId: process.env.p_app_id,
  key: process.env.p_key,
  secret: process.env.p_secret,
  cluster: process.env.p_cluster,
  encrypted: true
})


app.use(express.static('public'))

// expose public channel config so we don't have to
// hardcode in our frontend
app.get('/config', (req, res) => {
  res.send({
    key: process.env.p_key,
    cluster: process.env.p_cluster
  })
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id
  var channel = req.body.channel_name

  var data = {
    user_id: 'u' + Math.random(), // \o/
    user_info: {
      flag: randomColor()
    }
  }

  var auth = pusher.authenticate(socketId, channel, data)
  res.send(auth)
})

app.listen(process.env.PORT || 3000)
