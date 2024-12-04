const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { resource } = require('../app')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password === undefined) {
    response.status(400).json(({ error: 'expected a password' }))
  }

  if (password.length < 3) {
    response.status(400).json(({ error: 'password has to be at leats 3 characters long' }))
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}) 
  response.json(users)
})

module.exports = usersRouter