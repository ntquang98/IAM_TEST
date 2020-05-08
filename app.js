const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('express-async-errors');
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({msg: "Hello!"});
});

app.get('/api/', (req, res) => {
  res.status(200).json({msg: "end point at /auth and /users"});
});

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/user.route'));

app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).send('View Error log on console');
});

const PORT = 4040;
app.listen(PORT, _ => {
  console.log(`IAM service is on air at http://localhost:${PORT}/`);
});
