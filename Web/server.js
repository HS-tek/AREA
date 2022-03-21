const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
var bodyParser = require('body-parser')
var ip = require("ip");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//const {info :info} = require('./public/js/app.js');
/*
var info = {
  type : null,
  title : null,
  value : null,
  score : null
};
*/

const MongoClient = require('mongodb').MongoClient;
const url ="mongodb+srv://auth0-custom-db-user:Passpass@cluster0.xbd8y.mongodb.net/db-name?retryWrites=true&w=majority"; 
 MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  const dbo = db.db("widget");  
  const youtubeCollection = dbo.collection('youtube')
  //var myobj = { typeOfWidget : null, channelName: null, value: null };

   app.post('/youtube', (req, res) => {
     console.log("app.post youtube");
     console.log(req.body);
     youtubeCollection.insertOne(req.body, function (err, res) {
       if (err) throw err;
       console.log("Document inserted:"+ req.body.title);
     });
   });

   app.get('/youtube', (req, res) => {
     console.log("app.get channel");
     youtubeCollection.find().sort({ _id: -1 }).toArray()
       .then(quotes => {
         console.log(quotes[0]);
         res.send(quotes[0]);
       })
       .catch()
/*
     let val = youtubeCollection.find().sort({ _id: -1 }).limit(1);
     console.log("channel:"+ val);
     res.send(val);
     */
      /*
       .then(channel => {
         console.log("channel:"+channel);
         res.send(channel);
         //res.render('index.ejs', { channel: channel })
       })
       .catch()
       */

     //db.collection('youtube').find().sort({ _id: 1 });
     /*
     db.collection('youtube').find().toArray()
       .then(channels => {
         res.render('index.ejs', { channels: channels })
       })
       .catch()
       */
   });

});

// About.jspn
app.get('/about.json', function(req, res) {
  var time = (new Date).getTime()
  res.json({
     "client": {
         "host": ip.address()
        },
      "server": {
        "current_time": time,
        "services": [
        {
          "name":"Youtube",
          "actions": [{
            "name":"New video on a channel",
            "description":"You choose to receive alert everytime there are a New video on a channel"
            } , {
            "name":"New comment on a video",
            "description":"You choose to receive alert everytime there are a New comment on a video"
            } , {
            "name":"Last sub on your account",
            "description":"You choose to receive a message with your last subscription"
          }] ,
        }, 
        {
          "name":"Github",
          "actions": [{
            "name":"Last commit on a repo",
            "description":"You choose to receive alert everytime there are a new commit in the repository"
            }, {
            "name":"New stars on a repo",
            "description":"You choose to receive alert everytime there are a new stars in the repository"
            }, {
            "name":"Last ticket on a repo",
            "description":"You choose to receive alert with the last ticket in the repository"
            }, {
            "name":"New follower on your account",
            "description":"You choose to receive alert when you have a new follower on your account"
            }],
          "reactions": [{
            "name":"Create a ticket on a repo",
            "description":"The user likes a message"
          }]
        },
        {
          "name":"Calendar",
          "reactions": [{
            "name":"Create a event",
            "description":"the user get a event in his calendar"
          },
          ]
        },
        {
          "name":"Timer",
          "actions": [{
            "name":"time",
            "description":"repeat a reaction all x second"
            }],
        },
        {
          "name":"Gmail",
          "reactions": [{
            "name":"Send a email",
            "description":"The user receive a email"
          }]
        },
        {
          "name":"Google Drive",
          "actions": [{
            "name":"last document uploaded",
            "description":"A message is receive at everytime a modification is done on a document or a new document is create"
          }]
        },
        {
          "name":"Gist",
          "actions": [{
            "name":"Get last gist",
            "description":"Get last gist"
            }, {
            "name":"Get last issue",
            "description":"Get last issue"
            }],
            "reactions": [{
              "name":"Create gist",
              "description":"create a gist"
            }],
        }
        ]
        }
    })
})


// YOUTUBE PART GET CHANNEL INFO
const ytch = require('yt-channel-info')


/*
const channelId = 'UCXuqSBlHAE6Xw-yeJA0Tunw'
const channelIdType = 'UCXuqSBlHAE6Xw-yeJA0Tunw'

ytch.getChannelInfo(channelId).then((response) => {
  console.log(response)
}).catch((err) => {
  console.log(err)
})
*/

//RSS PART
let Parser = require('rss-parser');
const { type } = require("os");
const { title } = require("process");
let parser = new Parser();

(async () => {

  let feed = await parser.parseURL('https://www.reddit.com/.rss');
  //console.log(feed.title);

  feed.items.forEach(item => {
  //  console.log(item.title + ':' + item.link)
  });

})();
/*END OF RSS PART*/
app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname,"public")));

app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname,"auth_config.json"));
});

app.get("/", (req, res) => {
  console.log("app.get:*"+req.query.id);
  res.sendFile(join(__dirname,"public/html/index.html"));
});

process.on("SIGINT", function() {
  process.exit();
});


module.exports = app;