const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const user = request.user

  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: [],
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const returnedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
  response.status(201).json(returnedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user

  const blogGettingDeleted = await Blog.findById(id)

  if (user._id.toString() === blogGettingDeleted.user.toString()) {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'no right to delete this blog' })
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    comments: body.comments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
  }).populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', userExtractor, async (request, response) => {
  const id = request.params.id
  const comment = request.body.comment
  const blog = await Blog.findById(id)
  const newComments = blog.comments.concat(comment)

  const blogWithNewComments = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    comments: newComments
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blogWithNewComments, {
    new: true,
    runValidators: true,
  }).populate('user', { username: 1, name: 1 });

  response.json(updatedBlog)
})

module.exports = blogsRouter
