import express from 'express'
import nedb from 'nedb-promises'

const app = express(),
  db = nedb.create('data/hits.jsonl')

app.use(express.static('public'))

app.get('/hits', async (req, res) => {
  try {
    db.findOne({ hits: { $exists: true } }).then((data) => {
      if (!data) {
        db.insert({ hits: 1 })
        res.contentType('text/plain').status(200).send('1')
      } else {
        let newHits = data.hits + 1
        db.updateOne({ _id: data._id }, { $set: { hits: newHits } })
        res.contentType('text/plain').status(200).send(newHits.toString())
      }
    })
  } catch (error) {
    res.status(500).send('Error occurred. Check the database settings')
  }
})

app.listen(3000, () => console.log('running on http://localhost:3000'))
