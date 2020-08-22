// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Crypto = require('../models/crypto')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /examples
// $ TOKEN="5d2e6d74702a0be341dc3cba0f19a83b" sh curl-scripts/cryptos/index.sh
router.get('/cryptos', requireToken, (req, res, next) => {
  Crypto.find({ owner: req.user.id })
    .then(crypto => {
      return crypto.map(crypto => crypto.toObject())
    })
    .then(crypto => res.status(200).json({ crypto: crypto }))
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
// ID="5f3e4cec6ad9530a5d205557" TOKEN="5d2e6d74702a0be341dc3cba0f19a83b" sh curl-scripts/cryptos/show.sh
router.get('/cryptos/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Crypto.findById(id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(crypto => res.status(200).json({ crypto: crypto.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /examples
// $ TOKEN="5d2e6d74702a0be341dc3cba0f19a83b" ASSET='ETH' AMOUNT='8' EXCHANGE='BINANCE'  sh curl-scripts/cryptos/create.sh
router.post('/cryptos', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.crypto.owner = req.user.id
  const crypto = req.body.crypto
  Crypto.create(crypto)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(crypto => {
      res.status(201).json({ crypto: crypto.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
// ID="5f3e4cec6ad9530a5d205557" TOKEN="5d2e6d74702a0be341dc3cba0f19a83b" ASSET='BTC' AMOUNT='8' EXCHANGE='BINANCE'  sh curl-scripts/cryptos/update.sh
router.patch('/cryptos/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.crypto.owner
  const id = req.params.id
  const data = req.body.crypto
  Crypto.findById(id)
    .then(handle404)
    .then(crypto => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, crypto)

      // pass the result of Mongoose's `.update` to the next `.then`
      return crypto.updateOne(data)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
// ID="5f3e4cec6ad9530a5d205557" TOKEN="5d2e6d74702a0be341dc3cba0f19a83b" sh curl-scripts/cryptos/destroy.sh
router.delete('/cryptos/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Crypto.findById(id)
    .then(handle404)
    .then(crypto => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, crypto)
      // delete the example ONLY IF the above didn't throw
      crypto.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
