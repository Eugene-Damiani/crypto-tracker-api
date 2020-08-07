const mongoose = require('mongoose')

const cryptoSchema = new mongoose.Schema({
  asset: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  exchange: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Crypto', cryptoSchema)
