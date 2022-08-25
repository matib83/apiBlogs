const mongoose = require('mongoose')
const supertest = require('supertest')
const { app, server } = require('../index')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are seven blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(7)
})

test('the first blog is about HTTP methods', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].author).toBe('Sabato Ernesto')
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
