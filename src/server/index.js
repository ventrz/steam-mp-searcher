const express = require('express')
const apiRouter = require('./apiRouter')

const PORT = 8000

const app = express()

app.use('/api', apiRouter)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
