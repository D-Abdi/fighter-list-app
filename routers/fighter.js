const express = require('express')
const Fighter = require('../models/fighter')
const Coach = require('../models/coach')
const auth = require('../middleware/auth')
const router = express.Router()

// Add new Fighter

router.post('/fighters', auth, async (req, res) => {
    const fighter = new Fighter({
        ...req.body,
        coach: req.coach._id
    })

    try {
        await fighter.save()
        res.status(201).send(fighter)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Show all fighters connected to coach

router.get('/fighters', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.competitive) {
        match.competitive = req.query.competitive === "true"
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.coach.populate({
            path: 'fighters',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.coach.fighters)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Find one Fighter

router.get('/fighters/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const fighter = await Fighter.findOne({ _id, coach: req.coach._id })

        if (!fighter) {
            return res.status(400).send()
        }

        res.send(fighter)
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }

// Patch fighter

router.patch('/fighters/:id', auth, async (req, res) => {
    // Update params
    const updates = Object.keys(req.body)
    // What fields are allowed to change
    const allowedUpdates = ['name', 'age', 'weightclass', 'discipline', 'competitive', 'win', 'loss', 'draw']
    // Check every update made. if (1 is invalid) return false
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // Check if update is invalid
    if (!isValidOperation) {
        res.status(400).send()
    }

    try {
        const fighter = await Fighter.findOne({ _id: req.params.id, coach: req.coach._id })

        if (!fighter) {
            res.status(404).send()
        }

        updates.forEach((update) => fighter[update] = req.body[update])
        await fighter.save()
        res.send(fighter)
    } catch (e) {
        res.status(404).send(e)
    }
})
})

// Delete single fighter

router.delete('/fighters/:id', auth, async (req, res) => {
    try {
        const fighter = await Fighter.findOne({ _id: req.params.id, coach: req.coach._id })

        if (!fighter) {
            res.status(404).send()
        }

        await fighter.remove()
        res.send(fighter)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete all fighters from coach

router.delete('/fighters', auth, async (req, res) => {
    try {
        const coach = { coach: req.coach._id }
        const fighter = await Fighter.deleteMany(coach)

        res.send("All fighters have been deleted!")
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router