require('dotenv').config()
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
require('./mongo')
const notesRouter = require('./controllers/blogs')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>API Blogs</h1>')
})

app.use('/api/blogs', notesRouter)

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
