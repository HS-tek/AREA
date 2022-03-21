const express = require('express')
const router = express.Router()

router.get('/reactions', (req, res) => {
    res.json(
        [
            {
                id: "gmail_send_mail",
                service: "GMail",
                name: "Envoyer un email",
                parameters: [
                    {
                        id: "from",
                        name: "Expéditeur",
                        placeholder: "Ex: dupont@example.com",
                        type: "string"
                    },
                    {
                        id: "to",
                        name: "Destinataire",
                        placeholder: "Ex: dupond@example.com",
                        type: "string"
                    }
                ]
            }
        ]
    )
})

router.get('/actions', (req, res) => {
    res.json(
        [
            {
                id: "gh_last_commit", 
                service: "GitHub",
                name: "Dernière commit",
                parameters: [
                    {
                        id: "repo",
                        name: "Repository", // username/repo
                        placeholder: "Ex: TanguyAndreani/monSuperRepo",
                        type: "string"
                    }
                ]
            }
        ]
    )
})

module.exports = router