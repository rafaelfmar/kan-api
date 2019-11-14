const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors());

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
});

app.use('/api', routes);

app.listen(process.env.PORT, () => console.log(`Escutando em ${process.env.PORT}...`));
