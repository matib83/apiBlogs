const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try {
    const { body } = request
    const { username, name, password } = body

    if (password === undefined) response.status(400).send({ error: 'password is required' })

    if (password.length < 3) response.status(400).send({ error: 'password must be contain more than 2 caracters' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    // console.error({ error })
    response.status(400).json(error)
  }
})

module.exports = usersRouter
