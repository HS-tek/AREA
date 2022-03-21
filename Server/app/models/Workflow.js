const mongoose = require('mongoose')

const parameterSchema = new mongoose.Schema({
    id: {
        type: 'string',
        required: 'true'
    },
    value: {
        type: 'string',
        required: 'true'
    }
})

const workflowSchema = new mongoose.Schema({
    username: {
        type: 'string',
        required: true,
    },
    action: {
        type: 'string',
        required: true,
    },
    reaction: {
        type: 'string',
        required: true,
    },
    redis: {
        type: 'string',
        required: true,
        unique: true
    },
    action_params: {
        type: [parameterSchema],
        required: true
    },
    reaction_params: {
        type: [parameterSchema],
        required: true
    }
}, {
    timestamps: true
})

const Workflow = mongoose.model('Workflow', workflowSchema)

module.exports = Workflow