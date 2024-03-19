import nedb from 'nedb-promises'
import express from 'express'

const app = express(),
  db = nedb.create('evs.jsonl')

db.insert({ make: 'tesla', price: 505000 })
