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
  con.query('SELECT * FROM customer WHERE active = 1;', (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/customername', (req, res) => {
  const name = req.body.name;
  con.query(`Select * from Customer Where customer.first_name Like "%${name}%" AND active = 1 OR customer.last_name Like "%${name}%" AND active = 1;`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})


app.post('/customerid', (req, res) => {
  const id = req.body.id;
  con.query(`Select * from Customer Where customer.customer_id = ${id} AND active = 1;`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/actornamemovie', (req, res) => {
  const actorname = req.body.actorname;
  con.query(`SELECT film.title FROM film JOIN film_actor ON film.film_id = film_actor.film_id JOIN actor ON film_actor.actor_id = actor.actor_id WHERE actor.first_name Like "%${actorname}%" OR actor.last_name Like "%${actorname}%";`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/movienamemovie', (req, res) => {
  const moviename = req.body.moviename;
  con.query(`SELECT title FROM film WHERE title LIKE "%${moviename}%";`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/genremovie', (req, res) => {
  const genre = req.body.genre;
  con.query(`SELECT film.title FROM film JOIN film_category ON film.film_id = film_category.film_id JOIN category ON film_category.category_id = category.category_id WHERE category.name LIKE "%${genre}%";`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/moviedetail', (req, res) => {
  const film = req.body.film;
  con.query(`SELECT * FROM film WHERE title = '${film}';`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})

app.post('/customerdetails', (req, res) => {
  const customerdetails = req.body.customerdetails;
  con.query(`SELECT * FROM customer WHERE customer_id = ${customerdetails};`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})


app.post('/addcustomer', (req, res) => {
  const fname = req.body.firstname
  const lname = req.body.lastname
  const email = req.body.email
  const addressid = req.body.addressid
  con.query(`INSERT INTO customer (store_id, first_name, last_name, email, address_id, active, create_date, last_update) VALUES ( 1, '${fname}', '${lname}', '${email}', ${addressid}, 1, NOW(), NOW() );`, (err, rows) => {
    if (err) alert(err.json)
    res.json("Added User")
  })
})

app.post('/deletecustomer', (req, res) => {
  const customerid = req.body.customerid
  con.query(`UPDATE customer SET active = 0 WHERE customer_id = ${customerid}; `, (err, rows) => {
    if (err) throw err
    res.json("Deleted User")
  })
})

app.get('/rentedfilms', (req, res) => {
  con.query(`SELECT DISTINCT customer.customer_id, customer.first_name, customer.last_name FROM customer JOIN rental ON customer.customer_id = rental.customer_id JOIN inventory ON rental.inventory_id = inventory.inventory_id JOIN film ON inventory.film_id = film.film_id;`, (err, rows) => {
    if (err) throw err
    res.json(rows)
  })
})


app.post('/rentmovie', (req, res) => {
  const customerid = req.body.customerid;
  con.query(`INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id) VALUES ( NOW(), 1, ${customerid}, 1);`, (err, rows) => {
    if (err) throw err
    res.json("Rented Film!")
  })
})