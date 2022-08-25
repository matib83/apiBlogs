const mongoose = require('mongoose')
const { server } = require('../index')
const Blog = require('../models/Blog')
const { api, initialBlogs } = require('./helpers')

beforeEach(async () => {
  await Blog.deleteMany({})

  // sequential (para asegurar que los datos traidos de mi BD vengan en el mismo orden, pero es mas lento)
  for (const blog of initialBlogs) {
    const blogsObjects = new Blog(blog)
    await blogsObjects.save()
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain('Go To Statement Considered Harmful')
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
