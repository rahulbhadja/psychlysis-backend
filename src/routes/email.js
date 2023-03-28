const express = require('express')
let router = express.Router()
const ethers = require('ethers')
const passport = require('passport')
const crypto = require('crypto')
const initializeLocal = require('../services/emailConfig')
const EmailUser = require('../models/EmailUser')

initializeLocal(passport)

async function LocalUserExists(req, res, next) {
  try {
    const emailUser = await EmailUser.findOne({ email: req.body.email })

    if (emailUser) {
      return res.json({
        success: false,
        message:
          'Opps !! Email already Registered, Please login or use another email.',
      })
    } else {
      next()
    }
  } catch (error) {
    console.log(error)
  }
}
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex')
  var genhash = crypto
    .pbkdf2Sync(password, salt, 10000, 60, 'sha512')
    .toString('hex')
  return { salt: salt, hash: genhash }
}
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(404).send({ message: 'User is not authenticated' })
}

router.post('/register', LocalUserExists, async (req, res) => {
  try {
    const name = req.body.name
    const saltHash = genPassword(req.body.password)
    const salt = saltHash.salt
    const hash = saltHash.hash
    const userId = crypto.randomBytes(16).toString('hex')

    const emailUser = new EmailUser()
    emailUser.email = req.body.email
    emailUser.name = name
    emailUser.hash = hash
    emailUser.salt = salt
    emailUser.provider = 'email'
    emailUser.userId = userId

    await emailUser.save()

    if (emailUser) {
      return res
        .status(200)
        .send({ success: true, message: 'Email Registered successfully' })
    }
  } catch (error) {
    console.log(error)
    return res.send({ message: error.message })
  }
})
router.post('/change-password', checkAuthenticated, async (req, res) => {
  try {
    const saltHash = genPassword(req.body.newPassword)
    const salt = saltHash.hash
    const hash = saltHash.hash

    const emailUser = await EmailUser.findOneAndUpdate(
      { email: req.body.email },
      { hash, salt }
    )
    await emailUser.save()

    if (emailUser) {
      return res
        .status(200)
        .send({ success: true, message: 'Password Changed successfully' })
    }
  } catch {
    console.log(error)
    return res.status(404).send({ message: error.message })
  }
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    return res.status(200).send({
      success: true,
      user: req.user,
      message: 'User logged in successfully',
    })
  } else {
    if (req.user) {
      return res
        .status(404)
        .send({ success: false, message: 'user is not authenticated' })
    }
  }
})

module.exports = router
