const mongoose = require('mongoose');

const { Schema } = mongoose;

const CardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  _list: {
    type: Schema.Types.ObjectId,
    ref: 'List',
    required: true,
  },
}, { timestamps: true });

mongoose.model('Card', CardSchema);
