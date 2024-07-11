const mongoose = require('mongoose');

const tftOrderSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide a coach name'] },
  game: { type: String, required: [true, 'Please provide a game'] },
  rank: { type: String, required: [true, 'Please provide a coach rank'] },
  lanes: [{ type: String }],
  champions: [{ type: String }],
  rating: { type: Number, required: [true, 'Please provide a rating'] },
  language: [{ type: String, required: [true, 'Please provide a language'] }],
  recommended: { type: Boolean },
  image: { type: String },
  price: { type: Number, required: [true, 'Please provide a price'] },
});

const TftOrder = mongoose.model('TftOrder', tftOrderSchema);
module.exports = TftOrder;
