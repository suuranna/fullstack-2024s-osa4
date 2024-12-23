const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')

const initialUsers = [
  {
    username: 'Käyttäjä1',
    name: 'Kari',
    password: 'salasana',
  },
  {
    username: 'Käyttäjä2',
    name: 'Hikari',
    password: 'ParempiSalasana',
  },
]

beforeEach(async () => {
  await User.deleteMany({})
  let userObject = new User(initialUsers[0])
  await userObject.save()
  userObject = new User(initialUsers[1])
  await userObject.save()
})

describe('testing get method', () => {
  test('the right amount of users is returned', async () => {
    const response = await api.get('/api/users')
    const users = response.body

    assert.strictEqual(users.length, initialUsers.length)
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('testing adding a new user', () => {
  test('user can be added', async () => {
    const newUser = {
      username: 'UusiKäyttäjä',
      name: 'Nimi Hyvä',
      password: 'YeetinTeetin',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    const users = response.body
    const savedUser = users.find((user) => user.username === newUser.username)

    assert.strictEqual(users.length, initialUsers.length + 1)
    assert.strictEqual(newUser.username, savedUser.username)
    assert.strictEqual(newUser.name, savedUser.name)
    assert(!('password' in savedUser))
  })

  test('user with too short username will not be added', async () => {
    const newUser = {
      username: 'U',
      name: 'Nimi Hyvä',
      password: 'YeetinTeetin',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('user with too short password will not be added', async () => {
    const newUser = {
      username: 'UusiKäyttäjä',
      name: 'Nimi Hyvä',
      password: 'Y',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('user with no password will not be added', async () => {
    const newUser = {
      username: 'UusiKäyttäjä',
      name: 'Nimi Hyvä',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('user with no username will not be added', async () => {
    const newUser = {
      password: 'salasana',
      name: 'Nimi Hyvä',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
