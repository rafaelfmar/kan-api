const mongoose = require('mongoose');

const HTTPCode = require('../utils/HTTPCode');
const BoardInit = require('../models/Board');
const ListInit = require('../models/List');
const CardInit = require('../models/Card');

const Board = mongoose.model('Board');
const List = mongoose.model('List');
const Card = mongoose.model('Card');

module.exports = {
  async index(req, res) {
    const boards = await Board.find();
    return res.json(boards);
  },
  async store(req, res) {
    // Create Board
    const board = await Board.create(req.body);
    // Verify if the board is saved
    if (!board) {
      return res.sendStatus(HTTPCode.BAD_REQUEST);
    }

    return res.status(HTTPCode.CREATED).json(board);
  },
  async show(req, res) {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.sendStatus(HTTPCode.NOT_FOUND).json(board);
    }
    return res.json(board);
  },
  async update(req, res) {
    // Update Board
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // Verify if the board is saved
    if (!board) {
      return res.status(HTTPCode.BAD_REQUEST).json(board);
    }

    return res.json(board);
  },
  async destroy(req, res) {
    await Board.findByIdAndRemove(req.params.id);
    const lists = await List.find({ _board: req.params.id });
    lists.map(async list => await Card.deleteMany({ _list: list._id }));
    await List.deleteMany({ _board: req.params.id });

    return res.sendStatus(HTTPCode.OK);
  },
  async all(req, res) {
    const boards = await Board.findById(req.params.id)
      .populate({
        path: 'lists',
        populate: {
          path: 'cards'
        }
      });
    return res.json(boards);
  },
};
