const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true, lowercase: true, trim: true },
  definition: { type: String, required: true },
  example: { type: String },
  partOfSpeech: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'other'],
    default: 'noun'
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Word', WordSchema);