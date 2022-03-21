const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_CONNSTRING)

const User = require('./models/User')


User.deleteMany({ username: 'Sam'}, () => console.log("hello"))

const kitty = new User({ username: 'Sam', password: 'hello', role: 'admin' })
kitty.save().then(() => console.log("meaow"))

const a = await User.find({ username: 'Sam' }).exec()


axios({
    method: 'get',
    url: 'https://github.com/login/oauth/authorize',
    data: {
        client_id: process.env.GITHUB_CLIENTID,
        redirect_uri: 'http://localhost:3000/github/completed',
        login: 'TanguyAndreani',
        state: 'hello',
        allow_signup: 'true'
    }
})
.then((github_res) => {
    res.send(github_res.data)
})
.catch((github_err) => {
    res.json(github_err.message)
})