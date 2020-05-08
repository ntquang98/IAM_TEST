const express = require('express');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/', (req, res) => {
  const user = new User(req.body);
  const hash = bcrypt.hashSync(req.body.password_hash, 8);

  user.password_hash = hash;

  user.save(function (err, user) {
    if (err) {
      res.send(err);
    }
    res.status(201).json({
      id: user.id,
    });
  });
});

module.exports = router;
