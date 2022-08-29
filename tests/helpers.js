const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/Blog')

const listEmptyBlog = []

const listWithOneBlog = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const initialBlogs = [
  {
    title: 'El túnel',
    author: 'Sabato Ernesto',
    url: 'www.loquelvientosellevo.com',
    likes: 10
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 8
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 12
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

const ValidNonExistingId = async () => {
  const blog = new Blog({
    title: 'Non exiting valid id',
    author: 'Mati test',
    url: 'N/A',
    likes: 2
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

module.exports = {
  api,
  listEmptyBlog,
  listWithOneBlog,
  initialBlogs,
  ValidNonExistingId
}
