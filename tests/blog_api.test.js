const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "Aihe",
    author: "Kirjoittaja",
    url: "wwww.nanannaa.com",
    likes: 666
  },
  {
    title: "Toinen aihe",
    author: "Eri kirjoittaja",
    url: "wwww.yeeet.com",
    likes: 420
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the right amount of blogs is returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the first blog has right information', async () => {
  const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]
  assert.strictEqual(initialBlogs[0].title, firstBlog.title)
  assert.strictEqual(initialBlogs[0].author, firstBlog.author)
  assert.strictEqual(initialBlogs[0].url, firstBlog.url)
})

test('blogs have id, not_id', async () => {
  const response = await api.get('/api/blogs')

  const firstBlog = response.body[0]
  const secondBlog = response.body[1]
  assert("id" in firstBlog)
  assert("id" in secondBlog)
})

test('A blog can be added', async() => {
  const newBlog = {
    title: "Uusi aihe",
    author: "Uusi kirjoittaja",
    url: "wwww.uusi.com",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  const blogs = response.body.map(blog => blog.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(blogs.includes('Uusi aihe'))
})

test('Added blog has the right attributes', async() => {
  const newBlog = {
    title: "Uusi aihe",
    author: "Uusi kirjoittaja",
    url: "wwww.uusi.com",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const response = await api.get('/api/blogs')
  const blog = response.body.find(blog => blog.title === newBlog.title)

  assert('title' in blog)
  assert('author' in blog)
  assert('url' in blog)
  assert('id' in blog)
  assert('likes' in blog)
})

after(async () => {
  await mongoose.connection.close()
})