const express = require('express')
const router = express.Router()
const appController = require('../controllers/futureLessonController')


router.get('/', appController.getFutureLessons)
// router.get('/:id', appController.retriaveUser)
router.post('/', appController.createFutureLesson)
// router.delete('/:id', appController.deleteUser)

module.exports = router
