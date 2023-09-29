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
  con.query('SELECT film.film_id, film.title AS FilmTitle, film.description, film.release_year, film.language_id, film.rental_duration, film.rental_rate, film.length, film.rating, film.special_features, COUNT(rental.rental_id) AS RentalCount FROM film JOIN inventory ON film.film_id = inventory.film_id JOIN rental ON inventory.inventory_id = rental.inventory_id GROUP BY film.film_id, film.title, film.description, film.release_year, film.language_id, film.rental_duration, film.rental_rate, film.length, film.rating, film.special_features ORDER BY RentalCount DESC LIMIT 5;', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})


app.post('/actordetail', (req, res) => {
  const id = req.body.id
  con.query(`SELECT film.film_id, film.title, film.description, film.release_year, film.language_id, film.original_language_id, film.rental_duration, film.rental_rate, film.length, film.replacement_cost, film.rating, film.special_features FROM film JOIN film_actor ON film.film_id = film_actor.film_id WHERE film_actor.actor_id = ${id} GROUP BY film.film_id ORDER BY COUNT(*) DESC LIMIT 5;`, (err, rows) => {
    if (err) throw err
    console.log(rows)
    res.json(rows)
  })
})

app.get('/top5actors', (req, res) => {
  con.query('SELECT actor.actor_id, actor.first_name, actor.last_name, COUNT(film.film_id) AS film_count FROM actor JOIN film_actor ON actor.actor_id = film_actor.actor_id JOIN film ON film_actor.film_id = film.film_id GROUP BY actor.actor_id, actor.first_name, actor.last_name ORDER BY film_count DESC LIMIT 5;', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.get('/customers', (req, res) => {
  con.query('Select * From Customer;', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/customername', (req, res) => {
  const name = req.body.name;
  console.log(name)
  con.query(`Select * from Customer Where customer.first_name Like "%${name}%" OR customer.last_name Like "%${name}%";`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})


app.post('/customerid', (req, res) => {
  const id = req.body.id;
  console.log(id)
  con.query(`Select * from Customer Where customer.customer_id = ${id};`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})