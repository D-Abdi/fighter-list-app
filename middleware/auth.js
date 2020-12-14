const jwt = require('jsonwebtoken')
const Coach = require('../models/coach')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'BiggusDickus')
        const coach = await Coach.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!coach) {
            throw new Error("Non existent")
        }

        req.token = token
        req.coach = coach
        next()
    } catch (e) {
        res.status(401).send({ error: "Please authenticate"})
        console.log(e);
    }
}

module.exports = auth 