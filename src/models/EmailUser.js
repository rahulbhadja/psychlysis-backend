const mongoose = require('mongoose')

const emailUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    provider: { type: String, default: 'email' },
    userId: { type: String, required: true },
  },
  { timestamps: true }
)
const EmailUser = mongoose.model('EmailUser', emailUserSchema)

module.exports = EmailUser
