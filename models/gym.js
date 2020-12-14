const mongoose = require('mongoose')

const gymScema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    discipline: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Coach'
    }
}, {
    timestamps: true
})

const Gym = mongoose.model('Gym', gymScema) 

module.exports = Gym