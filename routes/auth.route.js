const express = require('express');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const config = require('../config/default.json');
const RefreshToken = require('../models/auth.model');

const router = express.Router();

router.post('/', (req, res) => {
  User.findOne({username: req.body.username}, function (err, user) {
    if (err) {
      return res.json({
        authenticated: false
      });
    }

    const hashPwd = user.password_hash;
    if (!bcrypt.compareSync(req.body.password, hashPwd)) {
      return res.json({
        authenticated: false
      })
    }

    const userId = user.id;
    const accessToken = generateAccessToken(userId);
    const refreshToken = randToken.generate(config.auth.refreshTokenSz)

    // Chỗ này phải xóa refreshToken cũ nếu có.
    const rt = new RefreshToken();
    rt.userId = userId;
    rt.refreshToken = refreshToken;
    rt.save(function (err, user) {
      if (err) {
        return res.json({
          authenticated: false
        });
      }

      res.json({
        accessToken,
        refreshToken
      })
    })
  });
});


router.post('/refresh', (req, res) => {
  jwt.verify(req.body.accessToken, config.auth.secret, {ignoreExpiration: true}, function (err, payload) {
    const {userId} = payload;
    RefreshToken.findOne({userId: userId, refreshToken: req.body.refreshToken}, function (err, refreshToken) {
      if (err) {
        throw createError(400, 'Invalid refreshToken');
      }

      const accessToken = generateAccessToken(userId);
      res.json({accessToken});
    });
  })
})

const generateAccessToken = userId => {
  const payload = {userId};
  const accessToken = jwt.sign(payload, config.auth.secret, {
    expiresIn: config.auth.expiresIn
  });

  return accessToken;
}

module.exports = router;
