const { test, after, beforeEach, describe } = require('node:test')
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

describe('testing get method', () => {
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

  test('blogs have id, not _id', async () => {
    const response = await api.get('/api/blogs')

    const firstBlog = response.body[0]
    const secondBlog = response.body[1]
    assert("id" in firstBlog)
    assert("id" in secondBlog)
  })
})

describe('testing post method', () => {
  test('A blog can be added', async () => {
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

  test('Added blog has the right attributes', async () => {
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
})

describe('testing likes validation', () => {
  test('if likes are not given, likes will be set to 0', async () => {
    const newBlog = {
      title: "Uusi aihe",
      author: "Uusi kirjoittaja",
      url: "wwww.uusi.com"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const blog = response.body.find(blog => blog.title === newBlog.title)

    assert.strictEqual(blog.likes, 0)
  })

  test('if likes are given, likes will not be set to 0', async () => {
    const newBlog = {
      title: "Uusi aihe",
      author: "Uusi kirjoittaja",
      url: "wwww.uusi.com",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const blog = response.body.find(blog => blog.title === newBlog.title)

    assert.strictEqual(blog.likes, 10)
  })
})

describe('testing title and url validation', () => {
  test('if url and title are not given, return 400 status code', async () => {
    const newBlog = {
      author: "Uusi kirjoittaja",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('if url or title is not given, return 400 status code', async () => {
    const newBlog1 = {
      title: "Aihe",
      author: "Uusi kirjoittaja",
    }

    const newBlog2 = {
      author: "Uusi kirjoittaja",
      url: "wwww.ijij.com"
    }

    await api
      .post('/api/blogs')
      .send(newBlog1)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('testing delete method', () => {
  test('delete blog deletes the right blog', async () => {
    let response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]
    const blogThatStays = response.body[1]
    const blogsAtStart = response.body.length

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    response = await api.get('/api/blogs')
    const blogsAtTheEnd = response.body.length
    const titles = response.body.map(blog => blog.title)

    assert.strictEqual(blogsAtStart - 1, blogsAtTheEnd)
    assert.strictEqual(blogThatStays.title, response.body[0].title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('testing put method', () => {
  test('update existing blogs likes', async () => {
    let response = await api.get('/api/blogs')
    const blogToUpdate = response.body[0]
    const blogsAtStart = response.body.length

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 100 })
      .expect(200)
    
    response = await api.get('/api/blogs')
    const blogsAtTheEnd = response.body.length
    const updatedBlog = response.body.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(blogsAtStart, blogsAtTheEnd)
    assert.notStrictEqual(blogToUpdate.likes, 100)
    assert.notStrictEqual(blogToUpdate.likes, updatedBlog.likes)
    assert.strictEqual(updatedBlog.likes, 100)
  })
})


after(async () => {
  await mongoose.connection.close()
})