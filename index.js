const express = require('express')
require('./db/mongoose')
const coachRouter = require('./routers/coach')
const gymRouter = require('./routers/gym')
const fighterRouter = require('./routers/fighter')

const app = express()

app.use(express.json()) 

app.use(coachRouter, fighterRouter, gymRouter)

app.listen(8000, () => {
    console.log('Server is up on port 8000');
})