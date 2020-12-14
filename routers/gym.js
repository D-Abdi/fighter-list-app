const express = require('express')
const Gym = require('../models/gym')
const Coach = require('../models/coach')
const auth = require('../middleware/auth')
const router = express.Router()

// Create Gym and limit to 1 per coach (Not finished)

/***************/

router.post('/gym', auth, async (req, res) => {
    const gym = new Gym({
        ...req.body,
        coach: req.coach._id
    })
 
    try {
        await gym.save()
        res.status(201).send(gym)
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

/***************/

// Show Gym 

router.get('/gym', auth, async (req, res) => {
    try {
        await req.coach.populate({
            path: 'gym'
        }).execPopulate()
        res.send(req.coach.gym)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Patch Gym

router.patch('/gym/edit', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'discipline', 'adress', 'city']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.foreach((update) => req.coach[update] = req.body[update])

        await req.coach.save()
        res.send(req.coach)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete Gym

router.delete('/gym/delete', auth, async (req, res) => {
    try {
        const coach = { coach: req.coach._id }
        const gym = await Gym.deleteOne(coach)

        if (!gym) {
            res.status(400).send()
        }

        res.send('Gym has been removed!')
    } catch (e) {
        res.status(500).send(e)
        console.log(e);
    }
})

module.exports = router