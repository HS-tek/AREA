const express = require('express')
const router = express.Router()

const Workflow = require('./models/Workflow')
const User = require('./models/User')

const axios = require('axios')

const checkJwt = require('./jwt')

const verifFn = {
    gh_last_commit: (current_commit, state, action) => {
        if (!state.last_commit) {
            state.last_commit = current_commit
            return true;
        }
        const {sha} = state.last_commit
        state.last_commit = current_commit
        return (sha != current_commit.sha)
    },
    gh_last_issue: (current_commit, state, action) => {
        if (!state.last_commit) {
            state.last_commit = current_commit
            return true;
        }
        const {id} = state.last_commit
        state.last_commit = current_commit
        return (id != current_commit.id)
    },
    gh_last_gist: (current_commit, state, action) => {
        if (!current_commit)
            return false;
        if (!state.last_commit) {
            state.last_commit = current_commit
            return true;
        }
        const {id} = state.last_commit
        state.last_commit = current_commit
        return (id != current_commit.id)
    },
    gh_last_comment: (current_commit, state, action) => {
        if (!current_commit)
            return false;
        if (!state.last_commit) {
            state.last_commit = current_commit
            return true;
        }
        const {id} = state.last_commit
        state.last_commit = current_commit
        return (id != current_commit.id)
    },
    timer_secondes: (data, state, action) => {
        if (!data.last_date)
            return false
        const {last_date} = state
        const {current_date} = data
        state.last_date = current_date
        return (current_date > last_date + action.interval)
    },
    youtube_last_video: (data, state, action) => {
        if (!state.last_video) {
            state.last_video = data
            return true
        }
        const last_date = state.last_video.snippet.publishedAt
        const current_date = data.snippet.publishedAt
        console.log(last_date, current_date)
        state.last_video = data
        return (last_date != current_date)
    },
    youtube_last_comment: (data, state, action) => {
        if (!state.last_video) {
            state.last_video = data
            return true
        }
        const last_date = state.last_video.snippet.publishedAt
        const current_date = data.snippet.publishedAt
        console.log(last_date, current_date)
        state.last_video = data
        return (last_date != current_date)
    },
    youtube_last_sub: (data, state, action) => {
        if (!state.last_video) {
            state.last_video = data
            return true
        }
        const last_date = state.last_video.snippet.publishedAt
        const current_date = data.snippet.publishedAt
        console.log(last_date, current_date)
        state.last_video = data
        return (last_date != current_date)
    },
    drive_last_file: (data, state, action) => {
        if (!state.last_video) {
            state.last_video = data
            return true
        }
        const last_date = state.last_video.modifiedDate
        const current_date = data.modifiedDate 
        console.log(last_date, current_date)
        state.last_video = data
        return (last_date != current_date)
    },
    gh_last_star: (data, state, action) => {
        if (!state.last_list) {
            state.last_list = data.list
            return true
        }
        let newFollowers = [] 
        data.list.forEach(element => { 
            if (state.last_list.indexOf(element) == -1) {
                newFollowers.push(element)
            }
        });
        state.last_list = data.list

        return (newFollowers.length > 0)
    }, 
    gh_last_follower: (data, state, action) => {
        if (!state.last_list) {
            state.last_list = data.list
            return true
        }
        let newFollowers = []
        data.list.forEach(element => {
            if (state.last_list.indexOf(element) == -1) {
                newFollowers.push(element)
            }
        });
        state.last_list = data.list

        return (newFollowers.length > 0)
    },
    gh_time: (data, state, action) => {
        if (!state.last_time) { 
            state.last_time = data
            return true
        }
        const {ts} = state.last_time
        const s1 = Math.floor(ts/1000)
        const s2 = Math.floor(data.ts/1000)
        console.log(s1, s2, s2 - s1)
        if (s2 - s1 > parseInt(action.interval)) { 
            state.last_time = data
            return true
        }
        return false
    }
}

const services = {
    gh_last_commit: 'github',
    gmail_send_mail: 'google',
    gh_create_issue: 'github',
    youtube_last_video: 'google',
    youtube_last_comment: 'google',
    youtube_last_sub: 'google',
    calendar_create_event: 'google',
    drive_last_file: 'google',
    gh_last_star: 'github',
    gh_last_follower: 'github', 
    gh_last_gist: 'github',
    gh_last_issue: 'github',
    gh_create_gist: 'github',
    gh_time: 'github',
    gh_last_comment: 'github'
}

const make_callback = (action, reaction, email, identifiant) => {
    let state = { hello: 'world' };
    return async () => {
        // youpi
        const {workflows} = await User.findOne({email})
        if (workflows.indexOf(identifiant)) {
            clearInterval(this)
        }
        axios({
            method: 'get',
            url: 'http://localhost:3000/' + services[action.id] + '/action', // /timer_secondes -> la date en seconde
            params: {
                email: email,
                action: action
            }
        })
        .then(async (res) => {
            if (verifFn[action.id](res.data, state, action)) {
                axios({
                    method: 'post',
                    url: 'http://localhost:3000/' + services[reaction.id] + '/reaction',
                    params: {
                        email,
                        action,
                        reaction,
                        input: res.data
                    }
                })
                .then((res) => {
                    console.log("reaction effectuée")
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

router.post('/add', checkJwt, async (req, res) => {
    // parameters (as json):
    // - user email (stored in JWT)
    // - action_id
    // - reaction_id
    // - parameters as json

    console.log(req.body)
    console.log(req.params)

    console.log(req.user)

    const {action, reaction} = req.body
    const {email} = req.user


    const identifiant = action.workflow_name

    const user = await User.findOneAndUpdate(
        { email: email },
        {
            $push: {
                workflows: {
                    $each: [
                        identifiant
                    ]
                }
            }
        },
        {
            new: true,
            upsert: true // Make this update into an upsert
        }
    )

    setInterval(make_callback(action, reaction, email, identifiant), 10000)

    res.send('hello')
})

module.exports = router