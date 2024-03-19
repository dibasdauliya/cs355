const express = require('express') // load express module
const nedb = require('nedb-promises') // load nedb module

const app = express() // init app
const db = nedb.create('users.jsonl') // init db

app.use(express.static('public')) // enable static routing to "./public" folder

// automatically decode all requests from JSON and encode all responses into JSON
app.use(express.json())

// create route to get all user records (GET /users)
//   use db.find to get the records, then send them
//   use .catch(error=>res.send({error})) to catch and send errors

app.get('/users', (req, res) => {
  db.find({})
    .then((records) => res.send(records))
    .catch((error) => res.send({ error }))
})

// create route to get user record (GET /users/:username)
//   use db.findOne to get user record
//     if record is found, send it
//     otherwise, send {error:'Username not found.'}
//   use .catch(error=>res.send({error})) to catch and send other errors

app.get('/users/:username', (req, res) => {
  db.findOne({ _id: req.params.username })
    .then((record) => {
      if (record) {
        res.send(record)
      } else {
        res.send({ error: 'Username not found.' })
      }
    })
    .catch((error) => res.send({ error }))
})

// create route to register user (POST /users)
//   ensure all fields (username, password, email, name) are specified; if not, send {error:'Missing fields.'}
//   use findOne to check if username already exists in db
//     if username exists, send {error:'Username already exists.'}
//     otherwise,
//       use insertOne to add document to database
//       if all goes well, send returned document
//   use .catch(error=>res.send({error})) to catch and send other errors

app.post('/users', (req, res) => {
  if (
    req.body.username &&
    req.body.password &&
    req.body.email &&
    req.body.name
  ) {
    db.findOne({ _id: req.body.username })
      .then((record) => {
        if (record) {
          res.send({ error: 'Username already exists.' })
        } else {
          req.body._id = req.body.username
          delete req.body.username

          db.insertOne(req.body)
            .then((record) => res.send(record))
            .catch((error) => res.send({ error }))
        }
      })
      .catch((error) => res.send({ error }))
  } else {
    res.send({ error: 'Missing fields.' })
  }
})

// create route to update user doc (PATCH /users/:username)
//   use updateOne to update document in database
//     updateOne resolves to 0 if no records were updated, or 1 if record was updated
//     if 0 records were updated, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors

app.patch('/users/:username', (req, res) => {
  db.updateOne({ _id: req.params.username }, { $set: req.body })
    .then((numReplaced) => {
      if (numReplaced === 0) {
        res.send({ error: 'Something went wrong.' })
      } else {
        res.send({ ok: true })
      }
    })
    .catch((error) => res.send({ error }))
})

// create route to delete user doc (DELETE /users/:username)
//   use deleteOne to update document in database
//     deleteOne resolves to 0 if no records were deleted, or 1 if record was deleted
//     if 0 records were deleted, send {error:'Something went wrong.'}
//     otherwise, send {ok:true}
//   use .catch(error=>res.send({error})) to catch and send other errors

app.delete('/users/:username', (req, res) => {
  db.deleteOne({ _id: req.params.username })
    .then((numReplaced) => {
      if (numReplaced === 0) {
        res.send({ error: 'Something went wrong.' })
      } else {
        res.send({ ok: true })
      }
    })
    .catch((error) => res.send({ error }))
})

// default route
app.all('*', (req, res) => {
  res.status(404).send('Invalid URL.')
})

// start server
app.listen(3000, () => console.log('Server started on http://localhost:3000'))
