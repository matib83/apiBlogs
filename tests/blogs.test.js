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

  test('all blogs are returned', async () => {
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
    response.body.forEach(blog => expect(blog.id).toBeDefined())
  })
})

describe('Create a Blog', () => {
  test('wiht a valid blog can be added', async () => {
    const newBlog = {
      title: 'Pruebo creando un nuevo blog válido',
      author: 'Mati test',
      url: 'N/A',
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
    expect(titles).toContain('Pruebo creando un nuevo blog válido')
  })

  test('without likes is added with default likes=0', async () => {
    const newBlog = {
      title: 'Pruebo blog sin likes',
      author: 'Mati test',
      url: 'N/A'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')
    // console.log('PRUEBO SIN LIKES')
    // console.log(initialBlogs.length)
    // console.log(response.body)
    // console.log(response.body[initialBlogs.length].id)
    expect(response.body[initialBlogs.length].likes).toBe(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Mati test',
      url: 'N/A',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Prueba blog sin url',
      author: 'Mati test',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
