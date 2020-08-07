'use strict'
// instantiate mongodb and mongoose
const mongoose = require('mongoose')
// telling mongoose to use node's promise
mongoose.Promise = global.Promise
// connecting mongoose to mongodb
mongoose.connect('mongodb://localhost/mongoose-relationships', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// connect the db
const db = mongoose.connection
// require Place model
const Crypto = require('./../app/models/crypto')
// open connection to db
db.once('open', function () {
  // find all person documents in mongodb
  Crypto.find()
    .populate('asset')
    // printing success or failure
    .then(cryptos => {
      // loop through each place document
      cryptos.forEach(crypto => {
        // turning it to json
        console.log(crypto.toJSON())
      })
    })
    .catch(console.error)
    // close connection to db
    .finally(() => db.close())
})
