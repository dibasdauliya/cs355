const express = require('express')
const nedb = require('nedb-promises')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const app = express()

const users = nedb.create('users.jsonl')
const posts = nedb.create('posts.jsonl')

app.use(express.static('frontend'))
app.use(express.json())

app.get('/users', (req, res) => {
  users.find({}).then((users) => {
    res.send(users.map((user) => ({ username: user.username })))
  })
})

app.post('/register', (req, res) => {
  const { username, email, password } = req.body

  users.findOne({ username }).then((user) => {
    if (user) {
      res.status(400).send({ message: 'User already exists' })
      return
    }

    const authToken = crypto.randomBytes(32).toString('hex')

    const data = {
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      authToken
    }

    users
      .insertOne(data)
      .then((user) => {
        const { password, ...userWithoutPassword } = user
        res.send(userWithoutPassword)
      })
      .catch((error) => {
        res.status(500).send({ error })
      })
  })
})

app.post('/login', (req, res) => {
  const { username, password: passwordFromReq } = req.body

  users.findOne({ username }).then((user) => {
    if (!user || !bcrypt.compareSync(passwordFromReq, user.password)) {
      res.status(401).send({ error: 'Invalid username or password' })
      return
    }

    const { password, ...userWithoutPassword } = user
    res.send(userWithoutPassword)
  })
})

app.delete('/user/:username/:authCode', (req, res) => {
  const { username, authCode } = req.params

  users.findOne({ username }).then((user) => {
    if (!user || user.authToken !== authCode) {
      res.status(401).send({ message: 'Invalid username or authCode' })
      return
    }

    users.removeOne({ username }).then(() => {
      res.send({ message: 'User deleted' })
    })
  })
})

app.patch('/user/:username/:authToken', (req, res) => {
  const { username, authToken } = req.params
  const { newEmail, newUsername } = req.body

  console.log(username, authToken, newEmail, newUsername)

  console.log(req.body)

  users
    .findOne({ username: username })
    .then((user) => {
      if (user && user.authToken === authToken) {
        users
          .updateOne(
            { username },
            {
              $set: {
                email: newEmail,
                username: newUsername
              }
            }
          )
          .then((update) => {
            if (update === 0) {
              res.send({ error: 'Something went wrong.' })
            } else {
              res.send({ ok: true })
            }
          })
          .catch((error) => res.send({ error }))
      } else {
        res.send({ error: 'Invalid authentication token.' })
      }
    })
    .catch((error) => res.send({ error }))
})

app.post('/post/:username/:authToken', (req, res) => {
  const { username, authToken } = req.params
  const { title, content } = req.body

  console.log(username, authToken, title, content)

  users.findOne({ username }).then((user) => {
    if (!user || user.authToken !== authToken) {
      res.status(401).send({ error: 'Invalid username or authCode' })
      return
    }

    const data = {
      title,
      content,
      username,
      createdAt: new Date().toISOString(),
      likes: 0
    }

    posts
      .insertOne(data)
      .then((post) => {
        res.send(post)
      })
      .catch((error) => {
        res.status(500).send({ error })
      })
  })
})

app.patch('/post/:username/:authToken', (req, res) => {
  const { username, authToken } = req.params
  const { title, content, postID } = req.body

  console.log(username, authToken, title, content, postID)

  users.findOne({ username }).then((user) => {
    if (!user || user.authToken !== authToken) {
      res.status(401).send({ error: 'Invalid username or authCode' })
      return
    }

    posts
      .updateOne(
        { _id: postID },
        {
          $set: {
            title,
            content,
            username,
            createdAt: new Date().toISOString()
          }
        }
      )
      .then((post) => {
        res.send(post)
      })
      .catch((error) => {
        res.status(500).send({ error })
      })
  })
})

app.get('/posts', (req, res) => {
  posts.find({}).then((posts) => {
    res.send(posts)
  })
})

app.patch('/like/:id', (req, res) => {
  const { id } = req.params

  console.log(123)

  posts.findOne({ _id: id }).then((post) => {
    if (!post) {
      res.status(404).send({ error: 'Post not found' })
      return
    }
    posts
      .updateOne({ _id: id }, { $set: { likes: post.likes + 1 } })
      .then(() => {
        res.send({ ok: true })
      })
      .catch((error) => {
        res.status(500).send({ error })
      })
  })
})

app.delete('/post/:id', (req, res) => {
  const { id } = req.params

  posts.findOne({ _id: id }).then((post) => {
    if (!post) {
      res.status(404).send({ error: 'Post not found' })
      return
    }
    posts.removeOne({ _id: id }).then(() => {
      res.send({ message: 'Post deleted' })
    })
  })
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
