const crypto = require('crypto')
const EmailUser = require('../models/EmailUser')
const LocalStrategy = require('passport-local').Strategy

function initializeLocal(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const emailUser = await EmailUser.findOne({ email })

      if (!emailUser) {
        return done(null, false)
      }
      const isValid = validPassword(password, emailUser.hash, emailUser.salt)
      const user = {
        email: emailUser.email,
        address: emailUser.address,
        provider: emailUser.provider,
        name: emailUser.name,
        userId: emailUser.userId,
      }
      if (isValid) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (e) {
      return done(e)
    }
  }
  passport.use(
    'local',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      authenticateUser
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 60, 'sha512')
    .toString('hex')
  return hash === hashVerify
}

module.exports = initializeLocal
