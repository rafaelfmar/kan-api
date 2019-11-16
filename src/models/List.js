const mongoose = require('mongoose');

const { Schema } = mongoose;

const ListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Card',
  }],
  _board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
}, { timestamps: true });

mongoose.model('List', ListSchema);
