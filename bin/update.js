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
const crypto = require('./../app/models/crypto')

// get input from command line
// node bin/place/update.js 123423432 country USA
const cryptoUserInput = process.argv[2]
const amountUserInput = process.argv[3]
const exchangeUserInput = process.argv[4]

// open connection to db
db.once('open', function () {
  // save place to mongodb
  crypto.findById(cryptoUserInput)
    // printing success or failure
    .then(crypto => {
      // update the place object with the passed in key and value
      crypto[userInputKey] = userInputValue

      // then save the place document in the database
      return crypto.save()
    })
    .then(crypto => {
      console.log(crypto.toJSON())
    })
    .catch(console.error)
    // close connection to db
    .finally(() => db.close())
})
