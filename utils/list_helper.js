//import _ from 'lodash'
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}
  
const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, item) => sum + item.likes, 0)
  return likes
}

const favoriteBlog = (blogs) => {
  var favorite = blogs.reduce((previous, current) => {
    return previous.likes >= current.likes ? previous : current
  }, blogs[0])

  if (favorite === undefined) {
    return 'The given list is empty'
  } else {
    return {title: favorite.title, author: favorite.author, likes: favorite.likes}
  }
}

const mostBlogs = (blogs) => {
  const groupedBlogs = _.groupBy(blogs, 'author')
  const authorsAndBlogs = _.map(groupedBlogs, (blogs, author) => ({ author: author, blogs: blogs.length}))
  const authorWithMostBlogs = _.maxBy(authorsAndBlogs, 'blogs')

  if (authorWithMostBlogs === undefined) {
    return 'The given list is empty'
  } else {
    return authorWithMostBlogs
  }
}

const mostLikes = (blogs) => {
  const groupedBlogs = _.groupBy(blogs, 'author')
  const authorsAndLikes = _.map(groupedBlogs, (blogs, author) => ({ author: author, likes: _.sumBy(blogs, 'likes')}))
  const authorWithMostLikes = _.maxBy(authorsAndLikes, 'likes')

  if (authorWithMostLikes === undefined) {
    return 'The given list is empty'
  } else {
    return authorWithMostLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}