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

// require place model
const place = require('./../app/models/crypto')

// get input from command line
// node bin/place/create.js Boston 42 -71 "United States"
const cryptoUserInput = process.argv[2]
const amountUserInput = process.argv[3]
const exchangeUserInput = process.argv[4]

// open connection to db
db.once('open', function () {
  // save place to mongodb
  crypto.create({
    crypto: cryptoUserInput,
    latitude: amountUserInput,
    exchange: exchangeUserInput
  })
    // printing success or failure
    .then(console.log)
    .catch(console.error)
    // close connection to db
    .finally(() => db.close())
})
