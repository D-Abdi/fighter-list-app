const express = require('express')
const Coach = require('../models/coach')
const auth = require('../middleware/auth')
const router = express.Router()

// Create new Coach

router.post('/coach', async (req, res) => {
    const coach = new Coach(req.body)

    try {
        await coach.save()
        const token = await coach.generateAuthToken()
        res.status(201).send({ coach, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

// Login 

router.post('/coach/login', async (req, res) => {
    try {
        const coach = await Coach.findByCredentials(req.body.email, req.body.password)
        const token = await coach.generateAuthToken()
        res.send({ coach, token })
    } catch (e) {
        res.status(400).send('Something went wrong!')
        console.log(e);
    }
})

// Show logged in Coach

router.get('/coach/me', auth, async (req, res) => {
    try {
        res.send(req.coach)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Logout

router.post('/coach/logout', auth, async (req, res) => {
    try {
        req.coach.tokens = req.coach.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.coach.save()

        res.send('Logout succes!')
    } catch (e) {
        res.status(500).send(e)
    }
})

// Logout all tokens

router.post('/coach/logoutAll', auth, async (req, res) => {
    try {
        req.coach.tokens = []

        await req.coach.save()

        res.send('Logout from all devices succes!')
    } catch (e) {
        res.status(500).send(e)
    }
})

// Patch Coach

router.patch('/coach/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates! '})
    }

    try {
        updates.forEach((update) => req.coach[update] = req.body[update])

        await req.coach.save()
        res.send(req.coach)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete Coach

router.delete('/coach/me', auth, async (req, res) => {
    try {
        await req.coach.remove()
        res.send(req.coach)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router