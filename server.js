const express = require('express')
const cors = require('cors')
const app = express()
const port = 8384

const mysql = require('mysql2')
require('dotenv').config()

const corsOptions = { origin: 'http://localhost:3000' }
app.use(cors(corsOptions))
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_Pass,
  database: 'sakila',
})

con.connect(function (err) {
  console.log('Connected!')
  if (err) throw err
})

app.get('/t', (req, res) => {
  con.query('Select film.title as FilmTitle From film Join inventory on film.film_id = inventory.film_id Join rental on inventory.inventory_id = rental.inventory_id Group By FilmTitle Order By COUNT(rental.rental_id) Desc Limit 5;', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})
