const listHelper = require('../utils/list_helper')
const { listEmptyBlog, listWithOneBlog, listBlogs } = require('./helpers')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listEmptyBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listBlogs)
    expect(result).toBe(41)
  })
})

describe('favorite Blog', () => {
  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog(listEmptyBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(listBlogs)
    expect(result).toEqual(listBlogs.filter(b => b.likes === 12))
  })
})

describe('most author Blogs', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostBlogs(listEmptyBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(listBlogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('favorite author', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostLikes(listEmptyBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(listBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 20 })
  })
})
