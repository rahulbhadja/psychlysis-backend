const express = require('express')
let router = express.Router()

router.get('/user', (req, res) => {
  if (req.user) {
    return res.status(200).send({ success: true, user: req.user })
  } else {
    return res
      .status(404)
      .send({ success: false, message: 'user is not authenticated' })
  }
})
router.get('/logout', (req, res) => {
  if (req.user) {
    req.session.destroy()
    return res.status(200).send({ success: true, message: 'user logged out' })
  } else {
    return res
      .status(404)
      .send({ success: false, message: 'user is not logged in' })
  }
})

module.exports = router
