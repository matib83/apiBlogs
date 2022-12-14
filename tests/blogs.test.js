const mongoose = require('mongoose')
const { server } = require('../index')
const Blog = require('../models/Blog')
const { api, initialBlogs, ValidNonExistingId, blogsInDb } = require('./helpers')

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

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
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

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd[initialBlogs.length].likes).toBe(0)
  })

  test('blog without title is not added and 400 is returned', async () => {
    const newBlog = {
      author: 'Mati test',
      url: 'N/A',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('blog without url is not added and 400 is returned', async () => {
    const newBlog = {
      title: 'Prueba blog sin url',
      author: 'Mati test',
      likes: 23
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(resultBlog.body).toEqual(processedBlogToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await ValidNonExistingId()
    console.log({ validNonexistingId })
    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })
})

test('a blog can be deleted', async () => {
  const firstResponse = await blogsInDb()
  const blogToDelete = firstResponse[0]
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const secondResponse = await blogsInDb()
  expect(secondResponse).toHaveLength(initialBlogs.length - 1)

  const titles = secondResponse.map(blog => blog.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog that do not exist can not be deleted', async () => {
  const validNonexistingId = await ValidNonExistingId()
  await api
    .delete(`/api/blogs/${validNonexistingId}`)
    .expect(204)

  const blogs = await blogsInDb()

  expect(blogs).toHaveLength(initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
