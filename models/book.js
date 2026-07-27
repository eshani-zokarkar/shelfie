const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, default: 'Uncategorized' },
  pages: { type: Number },
  status: { type: String, enum: ['want to read', 'reading', 'finished'], default: 'want to read' },
  mood: { type: String },
  coverImage: { type: String },
  notes: { type: String },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);