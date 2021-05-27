const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'smartbrain',
  },
});

// db.select('*').from('users').then(console.log);

const app = express();

app.use(express.json()); // so that body in post request is parsed
app.use(cors());

app.get('/', (req, res) => {
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('user not found please register'));
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => res.status(400).json('Please register and then sign in.'));
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  // bcrypt.compareSync("bacon", hash); // true
  // bcrypt.compareSync("veggies", hash); // false

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
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
    .catch((err) =>
      res.status(400).json('There is an error in getting the user')
    );
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(404).json('user not found');
      }
    })
    .catch((err) => res.status(400).json('Unable to get entries'));
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
