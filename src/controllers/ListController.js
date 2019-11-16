const mongoose = require('mongoose');

const ListInit = require('../models/List');
const CardInit = require('../models/Card');
const BoardInit = require('../models/Board');

const List = mongoose.model('List');
const Board = mongoose.model('Board');
const Card = mongoose.model('Card');

function validate(name, description, board) {
  let errors = [];

  if (!name || name.trim().length === 0) {
    errors = [...errors, 'Um nome deve ser dado à lista.'];
  }
  if (name && name.length > 100) {
    errors = [...errors, 'O nome deve ter ao máximo 100 caracteres.'];
  }
  if (name && name.length < 2) {
    errors = [...errors, 'O nome deve ter ao mínimo 2 caracteres.'];
  }
  if (description && description.length > 250) {
    errors = [...errors, 'A descrição deve ter ao máximo 250 caracteres.'];
  }
  if (!board) {
    errors = [...errors, 'A lista deve pertencer a um quadro'];
  }

  return errors;
}

module.exports = {
  async index(req, res) {
    const lists = await List.find()
      .populate('cards');

    return res.render('lists', {
      title: 'Listas',
      lists,
    });
  },
  async show(req, res) {
    const list = await List.findById(req.params.idlist);
    return res.render('list.create.handlebars', {
      title: `Editar: ${list.name}`,
      boardId: req.params.idboard,
      formAction: `/lists/${req.params.idlist}`,
      list,
    });
  },
  form(req, res) {
    return res.render('list.create.handlebars', {
      title: 'Nova lista',
      boardId: req.params.id,
      formAction: '/lists/new',
    });
  },
  async store(req, res) {
    // Find Board
    const board = await Board.findById(req.body._board);
    // Validation
    const errors = validate(req.body.name, req.body.description, board);
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('back');
    }
    // Create List
    const list = await List.create(req.body);
    if (!list) {
      req.flash('error', ['Ocorreu um erro ao salvar a lista. Tente novamente.']);
      return res.redirect('back');
    }
    // Update Board
    board.lists.push(list);
    board.save();

    return res.redirect(`/boards/${board._id}`);
  },
  async update(req, res) {
    // Find Board
    const board = await Board.findById(req.body._board);
    const listCheck = await List.findById(req.params.id);
    // Validation
    const errors = validate(req.body.name, req.body.description, board);
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('back');
    }
    if (!board._id.equals(listCheck.id)) {
      req.flash('error', ['Não é possível trocar o quadro de uma lista.']);
      return res.redirect('back');
    }
    // Create List
    const list = await List.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!list) {
      req.flash('error', ['Ocorreu um erro ao salvar a lista. Tente novamente.']);
      return res.redirect('back');
    }
    return res.redirect(`/boards/${req.body._board}`);
  },
  async destroy(req, res) {
    const list = await List.findByIdAndRemove(req.params.idlist);
    await Card.deleteMany({ _list: req.params.idlist });

    // Delete from board
    const board = await Board.findOne({ lists: list.id });
    board.lists = board.lists.filter((item) => !item.equals(req.params.idlist));
    board.save();

    return res.redirect(`/boards/${board.id}`);
  },
};
