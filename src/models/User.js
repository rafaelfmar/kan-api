const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: '',
      required: true,
    },
    boards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Board',
      },
    ],
  },
  { timestamps: true }
);

mongoose.model('User', UserSchema);
