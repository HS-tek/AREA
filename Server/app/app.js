const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const bodyParser = require('body-parser');

// enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const checkJwt = require('./jwt')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNSTRING)


var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

const User = require('./models/User')

const githubRouter = require('./github')
const googleRouter = require('./google')
const debugRouter = require('./debug_routes')
const servicesRouter = require('./services')
const workflowsRouter= require('./workflows')
app.use('/github', githubRouter)
app.use('/google', googleRouter)
app.use('/debug', debugRouter)
app.use('/services', servicesRouter)
app.use('/workflows', workflowsRouter)

app.get('/', checkJwt, async (req, res) => {
  console.log(req.user)
  res.send(`Hello, World!`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})