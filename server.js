const express = require('express')
const cors = require('cors')
const app = express()
const port = 8384
const axios = require('axios')

const mysql = require('mysql2')
require('dotenv').config()

const corsOptions = { origin: 'http://localhost:3000' }
app.use(cors(corsOptions))
app.use(express.json())
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

app.get('/top5films', (req, res) => {
  con.query('Select film.title as FilmTitle From film Join inventory on film.film_id = inventory.film_id Join rental on inventory.inventory_id = rental.inventory_id Group By FilmTitle Order By COUNT(rental.rental_id) Desc Limit 5;', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})


let postData = null
app.post('/film', (req, res) => {
  postData = req.body;
  res.status(200).json({ message: 'Data Receieved'});
})

app.get('/top5actors', (req, res) => {
  con.query('SELECT actor.actor_id, actor.first_name, actor.last_name, COUNT(film.film_id) AS film_count FROM actor JOIN film_actor ON actor.actor_id = film_actor.actor_id JOIN film ON film_actor.film_id = film.film_id GROUP BY actor.actor_id, actor.first_name, actor.last_name ORDER BY film_count DESC LIMIT 5;', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})