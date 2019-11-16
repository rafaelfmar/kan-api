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
  useUnifiedTopology: true,
});

app.use('/api', routes);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
