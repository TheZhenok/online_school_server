const express = require('express')
const router = express.Router()
const appController = require('../controllers/userController')
const userController = require('../controllers/authController')
const upload = require('../media/upload')


router.get('/', appController.getUser)
router.get('/profile', appController.getMyProfile)
router.get('/:id', appController.retriaveUser)
router.post('/', appController.createUser)
router.put('/', upload.single('img'), appController.updateUser)
router.delete('/:id', appController.deleteUser)
router.post('/login', userController.login)

module.exports = router
