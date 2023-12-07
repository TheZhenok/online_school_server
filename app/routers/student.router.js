const express = require('express')
const router = express.Router()
const appController = require('../controllers/studentController')
const upload = require('../media/upload')


router.get('/', appController.get)
router.get('/:id', appController.retriave)

module.exports = router
