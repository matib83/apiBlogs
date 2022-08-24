const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs === null || blogs === undefined || blogs.length === 0) return 0

  return blogs.reduce((sumLikes, b) => sumLikes + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs === null || blogs === undefined || blogs.length === 0) return 0
  const maxLike = Math.max(...blogs.map(b => b.likes))
  return blogs.filter(b => b.likes === maxLike)[0]
}

const mostBlogs = (blogs) => {
  if (blogs === null || blogs === undefined || blogs.length === 0) return 0
  const bestAuthList = blogs.reduce((res, cur) => {
    res[cur.author] ? res[cur.author]++ : res[cur.author] = 1
    return res
  }, [])

  const claves = Object.keys(bestAuthList)
  let maxAuth = bestAuthList[claves[0]]
  let maxAuthIndex = 0
  for (let i = 1; i < claves.length; i++) {
    if (bestAuthList[claves[i]] > maxAuth) {
      maxAuth = bestAuthList[claves[i]]
      maxAuthIndex = i
    }
  }

  return { author: claves[maxAuthIndex], blogs: bestAuthList[claves[maxAuthIndex]] }
}

const mostLikes = (blogs) => {
  if (blogs === null || blogs === undefined || blogs.length === 0) return 0
  const likesAuthList = blogs.reduce((res, cur) => {
    res[cur.author] ? res[cur.author] += cur.likes : res[cur.author] = cur.likes
    return res
  }, [])

  const claves = Object.keys(likesAuthList)
  let maxAuth = likesAuthList[claves[0]]
  let maxAuthIndex = 0
  for (let i = 1; i < claves.length; i++) {
    if (likesAuthList[claves[i]] > maxAuth) {
      maxAuth = likesAuthList[claves[i]]
      maxAuthIndex = i
    }
  }

  return { author: claves[maxAuthIndex], likes: likesAuthList[claves[maxAuthIndex]] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
