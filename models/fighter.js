const mongoose = require('mongoose')

const fighterSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    weightclass: {
        type: String,
        required: true
    },
    discipline: {
        type: String,
        required: true
    },
    competitive: {
        type: Boolean,
        default: false
    },
    win: {
        type: Number,
        default: 0
    },
    loss: {
        type: Number,
        default: 0
    },
    draw: {
        type: Number,
        default: 0
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Coach'
    }
}, {
    timestamps: true
})

const Fighter = mongoose.model('Fighter', fighterSchema)

module.exports = Fighter