const express = require('express')
const router = express.Router()

const axios = require('axios')

const User = require('./models/User')

const github = require('octonode')
const querystring = require("querystring")

const reactionsFn = {
    gh_create_issue: async (githubProfile, email, action, reaction, input, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        console.log(reaction)

        var ghrepo = client.repo(reaction.repo)

        ghrepo.issue({
            "title": "Found a bug",
            "body": "```\n"+ JSON.stringify(input) +"```\n"
          }, (err, data, headers) => {
              console.log(err, data, headers)
              res.json('hello')
          }); //issue
    },
    gh_create_gist: async (githubProfile, email, action, reaction, input, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        console.log(reaction)

        var ghrepo = client.gist()

        ghrepo.create({
            description: "Automatic gist",
            files: {
                "README.md": {
                    "content": "```\n"+ JSON.stringify(input) +"```\n"
                }
            }
          }, (err, data, headers) => {
              console.log(err, data, headers)
              res.json('hello')
          }); //issue
    }
}

const actionsFn = {
    gh_last_commit: (githubProfile, email, data, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        var ghrepo = client.repo(data.repo)

        ghrepo.commits((err, data, headers) => {
            console.log("Got commits!")
            //console.log(err, data)
            if (!data) {
                res.json([])
            }
            res.json(data[0])
        })
    },

    gh_time: (githubProfile, email, data, res) => {
        res.json({ts: Date.now()})
    },

    gh_last_issue: (githubProfile, email, data, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        var ghrepo = client.repo(data.repo)

        ghrepo.issues((err, data, headers) => {
            console.log("Got commits!")
            //console.log(err, data)
            if (!data) {
                res.json(null)
            }
            res.json(data[0])
        })
    },
    gh_last_gist: (githubProfile, email, data, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        var ghgist = client.gist()

        ghgist.list((err, data, headers) => {
            console.log("Got gist!")
            //console.log(err, data)
            if (!data) {
                res.json(null)
            }
            res.json(data[0])
        })
    },

    gh_last_comment: (githubProfile, email, data, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        var ghgist = client.gist()

        ghgist.comments(data.gist, (err, data, headers) => {
            console.log("Got gist!")
            //console.log(err, data)
            if (!data) {
                res.json(null)
            }
            data = data.reverse()
            res.json(data[0]) 
        })
    },
    gh_last_star: (githubProfile, email, data, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        var ghrepo = client.repo(data.repo)

        ghrepo.stargazers((err, data, headers) => {
            console.log("Got stars!")
            console.log(err, data)
            if (!data) {
                res.json([])
            }
            res.json({
                list: data.map((user) => {
                    return user.login
                })
            })
        })
    },
    gh_last_follower: (githubProfile, email, data, res) => {
        var client = github.client(githubProfile.credentials.access_token)

        var ghme = client.me()

        ghme.followers((err, data, headers) => {
            console.log("Got stars!")
            console.log(err, data)
            if (!data) {
                res.json([])
            }
            res.json({
                list: data.map((user) => {
                    return user.login
                })
            })
        })
    }
}

router.post('/reaction', async (req, res) => {
    console.log("REACTION TRIGGER!!!")
    console.log(req.query)

    const {email, action, reaction, input} = req.query
    actionParsed = JSON.parse(action)
    reactionParsed = JSON.parse(reaction)
    inputParsed = JSON.parse(input)

    const user = await User.findOne({ email: email })

    const githubProfile = user.github

    reactionsFn[reactionParsed.id](githubProfile, email, actionParsed, reactionParsed, inputParsed, res)
})

router.get('/action', async (req, res) => {
    console.log('hello', req.query)

    const {email, action} = req.query
    const actionParsed = JSON.parse(action)

    const user = await User.findOne({ email: email })

    const githubProfile = user.github

    console.log(actionsFn[actionParsed.id])

    actionsFn[actionParsed.id](githubProfile, email, actionParsed, res)
})

router.get('/oauth', (req, res) => {
    console.log(req.query.code)

    axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token',
        data: {
            client_id: process.env.GITHUB_CLIENTID,
            client_secret: process.env.GITHUB_SECRET,
            code: req.query.code
        }
    })
    .then((github_res) => {
        const query_string = github_res.data
        const parsedObject = querystring.parse(query_string)

        var client = github.client(parsedObject.access_token)

        client.get('/user', {}, async function (err, status, body, headers) {
            const githubProfile = {
                credentials: parsedObject,
                body: body
            }

            const user = await User.findOneAndUpdate(
                { email: githubProfile.body.email },
                { github: githubProfile },
                {
                    new: true,
                    upsert: true // Make this update into an upsert
                }
            )

            res.json(user); //json object

        });
    })
    .catch((github_err) => {
        res.json(github_err.message)
    })
})

router.get('/request_id/:email', (req, res) => {
    res.redirect(
        'https://github.com/login/oauth/authorize'
        + `?client_id=${process.env.GITHUB_CLIENTID}`
        + "&redirect_uri=http://localhost:3000/github/oauth"
        + `&login=${req.params.email}`
        + "&state=hello"
        + "&scope=repo%20user%20gist%20read:user"
        + "&allow_signup=true"
    ) 
})

module.exports = router