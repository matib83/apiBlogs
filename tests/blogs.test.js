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

describe('GET all blogs', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Go To Statement Considered Harmful')
  })

  test('the unique identification property from the blogs are id', async () => {
    const response = await api.get('/api/blogs')
    console.log(response.body)
    // console.log(response.body.toJSON())
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })
})

describe('Create a Blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Sobre héroes y tumbas',
      author: 'Sabato Ernesto',
      url: 'www.sabato/sobreheroesytumbas.com',
      likes: 8
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('Sobre héroes y tumbas')
  })

  /* test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Sabato Ernesto',
      url: 'www.sabato/unknown.com',
      likes: 0
    }

    await api
      .post('/api/notes')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
  }) */
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
