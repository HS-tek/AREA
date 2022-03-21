const express = require('express')
const router = express.Router()

const checkJwt = require('./jwt')

router.get('/test_api_call', checkJwt, (req, res) => {
    res.send("Hello, World!")
})

module.exports = router