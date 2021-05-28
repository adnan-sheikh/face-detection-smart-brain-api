const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        db.select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) =>
            res.status(400).json('user not found please register')
          );
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('Please register and then sign in.'));
};

module.exports.handleSignin = handleSignin;
