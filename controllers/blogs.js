const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const newBlog = new Blog(request.body)
  // Extraigo el campo likes del post del blog
  if (newBlog.likes === undefined) {
    newBlog.likes = 0
  }
  console.log({ newBlog })
  // Almaceno los datos del blog en la base de datos
  const saveBlog = await newBlog.save()
  response.status(201).json(saveBlog)
})

module.exports = blogsRouter
