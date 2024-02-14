const express = require('express'),
  app = express()

app.get('/breeds', (req, res) => {
  res
    .contentType('application/json')
    .status(200)
    .send({
      message: {
        african: [],
        airedale: [],
        australian: ['shepherd'],
        buhund: ['norwegian'],
        bulldog: ['boston', 'english', 'french'],
        hound: []
      }
    })
})

const images = {
  african: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
  airedale: ['1.jpg', '2.jpg', '3.jpg'],
  australian: {
    shepherd: ['1.jpg', '2.jpg', '3.jpg']
  },
  buhund: {
    norwegian: ['1.jpg', '2.jpg']
  },
  bulldog: {
    boston: ['1.jpg', '2.jpg', '3.jpg'],
    english: ['1.jpg', '2.jpg', '3.jpg'],
    french: ['1.jpg', '2.jpg', '3.jpg']
  },
  hound: ['1.jpg', '2.jpg', '3.jpg', '4.jpg']
}

app.get('/image/:breed', (req, res) => {
  const { breed } = req.params
})

app.listen(3000, () => {
  console.log('Listening on port 3000: http://localhost:3000')
})
