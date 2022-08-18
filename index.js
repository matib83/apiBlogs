require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
require('./mongo')
const notesRouter = require('./controllers/blogs')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>API Blogs</h1>')
})

app.use('/api/blogs', notesRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
