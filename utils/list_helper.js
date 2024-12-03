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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}