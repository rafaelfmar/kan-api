const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
// Use .env file config
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
});

app.use('/api', routes);

const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Escutando em ${process.env.PORT}...`));
