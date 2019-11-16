const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'List',
  }],
}, { timestamps: true });

mongoose.model('Board', BoardSchema);
