const express = require('express');

const routes = express.Router();

const BoardController = require('./controllers/BoardController');

routes.get('/', (req, res) => res.send('Kan API'));

// Board
routes.get('/boards', BoardController.index);
routes.post('/boards', BoardController.store);
routes.get('/boards/:id', BoardController.show);
routes.patch('/boards/:id', BoardController.update);
routes.delete('/boards/:id', BoardController.destroy);

module.exports = routes;
