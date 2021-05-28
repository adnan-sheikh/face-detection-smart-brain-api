const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const { handleRegister } = require('./controllers/register');
const { handleSignin } = require('./controllers/signin');
const { handleGetProfile } = require('./controllers/getprofile');
const { handleImage } = require('./controllers/image');
const { handleApiCall } = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'smartbrain',
  },
});

const app = express();

app.use(express.json()); // so that body in post request is parsed
app.use(cors());

app.get('/', (req, res) => {
  res.json('success');
});

app.post('/signin', (req, res) => {
  handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  handleGetProfile(req, res, db);
});

app.put('/image', (req, res) => {
  handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

/* 
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user (modified)
*/
