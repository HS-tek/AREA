const mongoose = require('mongoose')

/*





*/

/*
documents:
    - liste action
    - liste reactions
    - liste service




user:
    email
    google_access_token
    github_access_token
    workflows:
        [
            [redis_state, action_id = "gh_last_commit", reaction_id = "gmail_send_report", list_parameters]
            ...
        ]

executeActions() {
    if (actions_id == "gh_last_commit") {
        last_commit = call_api_github
        if (last_saved_commit == last_commit) {
            redis.do_it = false
        }
    }
}

executeREActions() {
    if (reactions_id == "gmail_send_report") {
        if redis.do_it == true

            GMail.send(redis.summary) 
        end
    }
}


const user
const workflow
setInterval(5000, async () => {
    if (existe_en_db)
    {
        a = fetch_state(redis_state)
        Actions.execute(action_id, redis_state)
        Reactions.execute(reaction_id, redis_state)
    } else {
        clearInterval(this)
    }
})


        */

/*
name	"Tanguy Andreani"
email	"dev@tanguy.space"
credentials	
access_token	"ya29.A0ARrdaM_iDasg7Hr7B7WOJKmrOfVoMH3VQBScIkPUpxbkeHrGPEEEVdLvV-07WyMJopgkYrLfd5YL0pRLJ_4RUapEOYiH9yDdECYjfADcL7yMkbse4odXDm1CiTjPkc_F8znXoHfYR0gP_ARvEofT4UUcX3HS"
scope	"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.compose openid https://www.googleapis.com/auth/userinfo.profile"
token_type	"Bearer"
id_token	"eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkZDZjYTJhODFkYzJmZWE4YzM2NDI0MzFlN2UyOTZkMmQ3NWI0NDYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1MTE5MzUxMzAwNDAtNWo3Nm81a2xoczBuZHVtaDNnMGhzdWRrNWwzZjlybWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI1MTE5MzUxMzAwNDAtNWo3Nm81a2xoczBuZHVtaDNnMGhzdWRrNWwzZjlybWQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA2OTkyOTUyOTYxMDQxNTY4NzMiLCJlbWFpbCI6ImRldkB0YW5ndXkuc3BhY2UiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Imk1SnhiZnRmaElORVBTZ09KTXlLTlEiLCJuYW1lIjoiVGFuZ3V5IEFuZHJlYW5pIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBVFhBSnlubEpLa003VkZaM1BOVjB5Yk1rX3l6eTlURTdaZ3dRZkVod2pDPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlRhbmd1eSIsImZhbWlseV9uYW1lIjoiQW5kcmVhbmkiLCJsb2NhbGUiOiJmciIsImlhdCI6MTY0NjU3ODgwNywiZXhwIjoxNjQ2NTgyNDA3fQ.lwhDda-i8oG9VK1GDRT-qwd5oC2TK07Ge6G8L2yfmuNzLmXarXONssD92cSRKrBH1MAHR3BxAc5mwO7cf50milb8m8rGbKx2OcUVHQAk7dnZBQjAhBDqSwRfFFZglBO9aJOSJwXdTtEUN7_U_Dr5f10TlAYuPhJffM2_h3c12VR2bi--2ESQVr3j_1wBl3cH64oCZDgeNfZS_OoMmOOXqO-Y80WjI0OfrwDdflEdI8AZns7yW3hb0mHgdBOH6G74u2VBmhK_ViLQ0coiXUobKAw7rzegC8oRF-dvle-czYWDqkau5Kx4YXgxQ1I18ZfFabFBq54pQJXoheDuVvBbQw"
expiry_date	1646582406800
*/

const userSchema = new mongoose.Schema({
    email: {
        type: 'string',
        index: true,
        required: true,
        unique: true,
        dropDups: true 
    },
    workflows: {
        type: [String],
        default: []
    },
    google: {
        name: String,
        email: String,
        credentials: {
            access_token: String,
            scope: String,
            token_type: String,
            id_token: String,
            expiry_date: Number
        }
    },
    github: {
        "credentials": {
          "access_token": {
            "type": "String"
          },
          "scope": {
            "type": "String"
          },
          "token_type": {
            "type": "String"
          }
        },
        "body": {
          "login": {
            "type": "String"
          },
          "id": {
            "type": "Number"
          },
          "node_id": {
            "type": "String"
          },
          "avatar_url": {
            "type": "String"
          },
          "gravatar_id": {
            "type": "String"
          },
          "url": {
            "type": "String"
          },
          "html_url": {
            "type": "String"
          },
          "followers_url": {
            "type": "String"
          },
          "following_url": {
            "type": "String"
          },
          "gists_url": {
            "type": "String"
          },
          "starred_url": {
            "type": "String"
          },
          "subscriptions_url": {
            "type": "String"
          },
          "organizations_url": {
            "type": "String"
          },
          "repos_url": {
            "type": "String"
          },
          "events_url": {
            "type": "String"
          },
          "received_events_url": {
            "type": "String"
          },
          "type": {
            "type": "String"
          },
          "site_admin": {
            "type": "Boolean"
          },
          "name": {
            "type": "String"
          },
          "company": {
            "type": "Mixed"
          },
          "blog": {
            "type": "String"
          },
          "location": {
            "type": "String"
          },
          "email": {
            "type": "String"
          },
          "hireable": {
            "type": "Boolean"
          },
          "bio": {
            "type": "String"
          },
          "twitter_username": {
            "type": "Mixed"
          },
          "public_repos": {
            "type": "Number"
          },
          "public_gists": {
            "type": "Number"
          },
          "followers": {
            "type": "Number"
          },
          "following": {
            "type": "Number"
          },
          "created_at": {
            "type": "Date"
          },
          "updated_at": {
            "type": "Date"
          }
        }
      },
    role: 'string'
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User