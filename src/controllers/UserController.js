const mongoose = require('mongoose');
const Bcrypt = require('bcrypt');

const UserInit = require('../models/User');
const BoardInit = require('../models/Board');
const ListInit = require('../models/List');
const CardInit = require('../models/Card');

const User = mongoose.model('User');
const Board = mongoose.model('Board');
const List = mongoose.model('List');
const Card = mongoose.model('Card');

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email)
    .toLowerCase());
}

function validate(name, email, password) {
  let errors = [];

  if (!name || name.trim().length === 0) {
    errors = [...errors, 'Deve-se inserir um nome.'];
  }
  if (name && name.length > 100) {
    errors = [...errors, 'O nome deve ter ao máximo 100 caracteres.'];
  }
  if (name && name.length < 2) {
    errors = [...errors, 'O nome deve ter ao mínimo 2 caracteres.'];
  }
  if (!email || email.trim().length === 0) {
    errors = [...errors, 'Deve-se inserir um e-mail.'];
  }
  if (!validateEmail(email)) {
    errors = [...errors, 'O e-mail inserido é inválido.'];
  }
  if (!password || password.trim().length === 0) {
    errors = [...errors, 'Deve-se inserir uma senha.'];
  }
  if (password && password.length > 15) {
    errors = [...errors, 'A senha deve ter no máximo 15 caracteres.'];
  }
  if (password && password.length < 6) {
    errors = [...errors, 'A senha deve ter no mínimo 6 caracteres.'];
  }
  return errors;
}

module.exports = {
  async store(req, res) {
    // Validation
    const errors = validate(req.body.name, req.body.email, req.body.password);
    if (errors.length > 0) {
      req.flash('error', errors);
      return res.redirect('back');
    }
    const users = await User.find({ email: req.body.email });
    console.log(users);
    if (users && users.length > 0) {
      req.flash('error', ['Já há um email cadastrado neste endereço.']);
      return res.redirect('back');
    }

    req.body.password = Bcrypt.hashSync(req.body.password, 10);
    const user = await User.create(req.body);
    if (!user) {
      return res.render('errror');
    }
    return res.redirect('/boards');
  },
  form(req, res) {
    return res.render('user.create.handlebars', {
      title: 'Novo usuário',
      formAction: '/users/new',
    });
  },
  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email })
        .exec();
      if (!user) {
        return res.status(400)
          .send('The user does not exist');
      }
      if (!Bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400)
          .send('The password is invalid');
      }
      res.send('The username and password combination is correct!');
    } catch (error) {
      res.status(500)
        .send(error);
    }
  },
};
