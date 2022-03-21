const express = require('express')
const router = express.Router()

const axios = require('axios')

const {google} = require('googleapis');

const User = require('./models/User')

const scopes = [
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtubepartner-channel-audit',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.channel-memberships.creator',
    'https://www.googleapis.com/auth/youtube.third-party-link.creator',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
];

const actionsFn = {
    drive_last_file: async (googleProfile, email, action, res) => {
        //console.log(googleProfile.credentials)
        oauth2Client.setCredentials(googleProfile.credentials)
        const youtube = google.youtube({
            version: 'v3',
            // this header will be present for every request
            auth: oauth2Client
        })

        const drive = google.drive({
            version: 'v2',
            auth: oauth2Client
        })

        drive.files.list({
            orderBy: 'modifiedDate desc'
        }).then((gres) => {
            res.json(gres.data.items[0])
        }).catch((err) => {
            res.json(err)
        })
    },
    youtube_last_sub: async (googleProfile, email, action, res) => {
        //console.log(googleProfile.credentials)
        oauth2Client.setCredentials(googleProfile.credentials)
        const youtube = google.youtube({
            version: 'v3',
            // this header will be present for every request
            auth: oauth2Client
        })

        youtube.subscriptions.list({
            mine: true,
            order: 'relevance',
            part: ['snippet']
        })
        .then((gres) => {
            console.log(gres.data.items[0])
            res.json(gres.data.items[0])
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })
    },
    youtube_last_comment: async (googleProfile, email, action, res) => {
        //console.log(googleProfile.credentials)
        oauth2Client.setCredentials(googleProfile.credentials)
        const youtube = google.youtube({
            version: 'v3',
            // this header will be present for every request
            auth: oauth2Client
        })

        const videoId = action.video_id

        youtube.commentThreads.list({ 
            videoId,
            order: 'time',
            maxResults: 10,
            part: ['snippet']
        })
        .then((gres) => {
            //console.log(gres.data.items[0])

            const {id} = gres.data.items[0]

            youtube.comments.list({
                id,
                order: 'time',
                part: ['snippet']
            })
            .then((gres) => {
                //console.log(id, gres.data.items[0])
                res.json(gres.data.items[0])
            })
            .catch((err) => {
                res.json(err)
            })
        }) 
        .catch((err) => {
            console.log(err)
            res.json(err)
        })
    },
    youtube_last_video: async (googleProfile, email, action, res) => {
        //console.log(googleProfile.credentials)
        oauth2Client.setCredentials(googleProfile.credentials)
        const youtube = google.youtube({
            version: 'v3',
            // this header will be present for every request
            auth: oauth2Client
        })

        const part = ['snippet', 'contentDetails']
        const id = action.channel_id

        youtube.channels.list({
            id,
            part
        })
        .then(async (gres) => {
            let nextPageToken = undefined;
            let videosFetched = 0;

            do {
                const videosResult = await youtube.playlistItems.list({
                  maxResults: 50,
                  pageToken: nextPageToken,
                  part: ['snippet', 'status'],
                  playlistId: gres.data.items[0].contentDetails.relatedPlaylists.uploads
                });
              
                videosFetched += videosResult.data.items.length;
              
                nextPageToken = videosResult.data.nextPageToken;
              
                res.json(videosResult.data.items[0])

                break;
            } while (nextPageToken);
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })
    }
}

router.get('/action', async (req, res) => {
    console.log('hello', req.query)

    const {email, action} = req.query
    const actionParsed = JSON.parse(action)

    const user = await User.findOne({ email: email })

    const googleProfile = user.google

    console.log(actionsFn[actionParsed.id])

    actionsFn[actionParsed.id](googleProfile, email, actionParsed, res)
})

const reactionsFn = {
    calendar_create_event: async (googleProfile, email, action, reaction, input, res) => {
        //console.log(googleProfile.credentials)
        oauth2Client.setCredentials(googleProfile.credentials)
        const youtube = google.youtube({
            version: 'v3',
            // this header will be present for every request
            auth: oauth2Client
        })

        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client
        })

        var event = {
            'summary': `${reaction.event_summary} ${action.id}`,
            'description': JSON.stringify(input),
            'start': {
              'dateTime': reaction.date_start,
              'timeZone': 'America/Los_Angeles',
            },
            'end': {
              'dateTime': reaction.date_end,
              'timeZone': 'America/Los_Angeles',
            },
          };
          

        calendar.events.insert({ 
            calendarId: 'primary',
            resource: event
        })
        .then((gres) => {
            res.json('ok!')
        })
        .catch((err) => {
            res.json(err)
        })
    },
    gmail_send_mail: async (googleProfile, email, action, reaction, input, res) => {
        console.log(googleProfile.credentials)
        oauth2Client.setCredentials(googleProfile.credentials)
        const gmail = google.gmail({
            version: 'v1',
            // this header will be present for every request
            auth: oauth2Client
        })

        // You can use UTF-8 encoding for the subject using the method below.
        // You can also just use a plain string if you don't need anything fancy.
        const subject = '🤘 Hello 🤘';
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: Moi <${reaction.from}>`,
            `To: Toi <${reaction.to}>`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            'This is a message just to say hello.',
            'So... <b>Hello!</b>  🤘❤️😎',
            JSON.stringify(input)
        ];
        const message = messageParts.join('\n');

        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');


        const gres = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
            raw: encodedMessage,
            },
        })

        res.json(gres.data)
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

    const googleProfile = user.google

    reactionsFn[reactionParsed.id](googleProfile, email, actionParsed, reactionParsed, inputParsed, res)
})

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENTID,
    process.env.GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT_URL
)

router.get('/oauth', async (req, res) => {
    console.log([req.params, req.query])
    const {code} = req.query
    oauth2Client.getToken(code)
    .then((tokens) => {
        oauth2Client.setCredentials(tokens.tokens);
        axios(
            {
                url: 'https://www.googleapis.com/oauth2/v3/userinfo',
                method: 'get',
                params: {
                    access_token: oauth2Client.credentials.access_token
                }
            })
        .then(async (ares) => {
            const googleProfile = {
                name: ares.data.name,
                email: ares.data.email,
                credentials: oauth2Client.credentials
            }

            console.log(googleProfile.email)

            const user = await User.findOneAndUpdate(
                { email: googleProfile.email },
                { google: googleProfile },
                {
                    new: true,
                    upsert: true // Make this update into an upsert
                }
            )
            
            res.json(user)
        })
        .catch((err) => {
            res.json(err)
        })
    }).catch((err) => {
        res.json(err)
    })
})

router.get('/request_id', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        
        // If you only need one scope you can pass it as a string
        scope: scopes
    })

    res.redirect(url)
})



module.exports = router