const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

const listWithManyBlogs = [
      {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
          __v: 0
        },
        {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
          __v: 0
        }
  ]

const listWithManyBlogs2 = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 9,
        __v: 0
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 9,
        __v: 0
      }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithManyBlogs)
        assert.strictEqual(result, 24)
    })
  })

describe('favorite blog', () => {
    test('empty list returns a string', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, 'The given list is empty')
    })

    test('list with one blog returns the blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.strictEqual(result.title, 'Go To Statement Considered Harmful')
        assert.strictEqual(result.author, 'Edsger W. Dijkstra')
        assert.strictEqual(result.likes, 5)
    })

    test('list with many blogs returns the right blog', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        assert.strictEqual(result.title, 'Canonical string reduction')
        assert.strictEqual(result.author, 'Edsger W. Dijkstra')
        assert.strictEqual(result.likes, 12)
    })

    test('list with many blogs with the same likes returns the first blog', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs2)
        assert.strictEqual(result.title, 'Go To Statement Considered Harmful')
        assert.strictEqual(result.author, 'Edsger W. Dijkstra')
        assert.strictEqual(result.likes, 9)
    })
})