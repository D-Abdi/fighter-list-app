const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Gym = require('./gym')
const Fighter = require('./fighter')

const coachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is not valid!')
            }
        }
    },
    password: {
        type: String,
        minLength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Password can't contain the word password!")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
{
    timestamps: true
})

// Link Coach with Fighters

coachSchema.virtual('fighters', {
    ref: 'Fighter',
    localField: '_id',
    foreignField: 'coach'
})

// Link Coach with Gym

coachSchema.virtual('gym', {
    ref: 'Gym',
    localField: '_id',
    foreignField: 'coach'
})

// Negate certain fields from the users view 

coachSchema.methods.toJSON = function () {
    const coach = this
    const coachObject = coach.toObject()

    delete coachObject.password
    delete coachObject.tokens

    return coachObject
}

// Generate a new token

coachSchema.methods.generateAuthToken = async function () {
    const coach = this
    const token = jwt.sign({ _id: coach._id.toString()}, 'BiggusDickus')

    coach.tokens = coach.tokens.concat({ token })
    await coach.save()

    return token
}

// Match email and pw with a DB result

coachSchema.statics.findByCredentials = async (email, password) => {
    const coach = await Coach.findOne({ email })

    if (!coach) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password, coach.password)

    if (!isMatch) {
        throw new Error('Wrong password!')
    }

    return coach
}

// Hash password

coachSchema.pre('save', async function(next) {
    const coach = this

    if (coach.isModified('password')) {
        coach.password = await bcrypt.hash(coach.password, 8)
    }

    next()
})

// Cascade Fighters if Coach is deleted 

coachSchema.pre('remove', async function(next) {
    const coach = this
    await Fighter.deleteMany({
        coach: coach._id
    })
    await Gym.deleteMany({
        coach: coach._id
    })

    next()
})
 
const Coach  = mongoose.model('Coach', coachSchema)

module.exports = Coach 