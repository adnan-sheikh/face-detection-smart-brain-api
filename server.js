const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'adnan',
    database: 'smartbrain',
  },
});

// db.select('*').from('users').then(console.log);

const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0, // to track number of images submitted for detection
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0, // to track number of images submitted for detection
      joined: new Date(),
    },
  ],
};

app.use(express.json()); // so that body in post request is parsed
app.use(cors());

app.get('/', (req, res) => {
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password == database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('Error logging in.');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) =>
      res.status(400).json('This user is already registered, try signing in!')
    );
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('user not found');
      }
    })
    .catch((err) => res.status(400).json('There is an error in getting the user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json('user not found');
  }
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
