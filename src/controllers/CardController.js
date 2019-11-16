const mongoose = require('mongoose');

const CardInit = require('../models/Card');

const Card = mongoose.model('Card');
const List = mongoose.model('List');

function validate(name, description, list) {
  let errors = [];

  if (!name || name.trim().length === 0) {
    errors = [...errors, 'Um nome deve ser dado ao quadro.'];
  }
  if (name && name.length > 100) {
    errors = [...errors, 'O nome deve ter ao máximo 100 caracteres.'];
  }
  if (name && name.length < 5) {
    errors = [...errors, 'O nome deve ter ao mínimo 5 caracteres.'];
  }
  if (description && description.length > 250) {
    errors = [...errors, 'A descrição deve ter ao máximo 250 caracteres.'];
  }
  if (!list) {
    errors = [...errors, 'A lista deve pertencer a um quadro'];
  }

  return errors;
}

module.exports = {
  async index(req, res) {
    const cards = await Card.find();
    return res.render('card.list.handlebars', {
      title: 'Cartões',
      cards,
    });
  },
  async show(req, res) {
    const card = await Card.findById(req.params.idcard);
    const currentList = await List.findById(req.params.idlist);
    const allLists = await List.find({ board: currentList.board });

    const lists = allLists.map((list) => {
      const newList = { ...list._doc };
      newList.isCardList = card._list.equals(newList._id);
      return newList;
    });

    return res.render('card.create.handlebars', {
      title: `Editar: ${card.name}`,
      formAction: `/cards/${card.id}`,
      card,
      lists,
    });
  },
  form(req, res) {
    return res.render('card.create.handlebars', {
      title: 'Novo cartão',
      formAction: '/cards/new',
      list: req.params.id,
    });
  },
  async store(req, res) {
    // Find List
    const list = await List.findById(req.body._list);
    // Validation
    const errors = validate(req.body.name, req.body.description, list);
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('back');
    }
    // Create card
    const card = await Card.create(req.body);
    // Verify if card was created
    if (!card) {
      req.flash('error', ['Ocorreu um erro ao salvar o cartão. Tente novamente.']);
      return res.redirect('back');
    }
    // Update list
    list.cards.push(card);
    list.save();

    return res.redirect(`/boards/${list._board}`);
  },
  async update(req, res) {
    const listId = req.body.list;
    const cardId = req.params.id;
    const card = await Card.findById(cardId);
    const list = await List.findById(listId);

    // Validation
    const errors = validate(req.body.name, req.body.description, list);
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('back');
    }
    if (!card) {
      req.flash('error', ['O cartão não foi encontrado.']);
      return res.redirect('back');
    }
    // Change card's list
    if (!card._list.equals(listId)) {
      const oldList = await List.findById(card._list);
      const newList = await List.findById(listId);

      oldList.cards = oldList.cards.filter((item) => !item.equals(cardId));
      oldList.save();

      newList.cards.push(cardId);
      newList.save();
    }
    // Update Card
    const cardUpdate = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // Check update
    if (!cardUpdate) {
      req.flash('error', ['O cartão não foi atualiza. Tente novamente.']);
      return res.redirect('back');
    }

    return res.redirect(`/boards/${list._board}`);
  },
  async destroy(req, res) {
    // Delelete card
    const card = await Card.findByIdAndRemove(req.params.idcard);
    // Delete from list
    const list = await List.findOne({ cards: card.id });
    list.cards = list.cards.filter((item) => !item.equals(req.params.idcard));
    list.save();

    return res.redirect(`/boards/${list._board}`);
  },
};
