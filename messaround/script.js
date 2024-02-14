const express = require('express'),
  app = express()

app.get('/', (req, res) => {
  res.send('hey')
})

app.get('*', (req, res) => {
  res.status(404)
  res.send({ message: '404 not found' })

  // res.status(404).send(...)
})

// app.all -> for all methods

app.listen(3000, () => {
  console.log('Listening at http://localhost:3000')
})
