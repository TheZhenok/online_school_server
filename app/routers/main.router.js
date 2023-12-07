const express = require('express')
const router = express.Router()
const userRouter = require('./user.router')
// const lessonRouter = require('./lesson.router')
const futureLessonRouter = require('./futureLesson.router')
const teacherRouter = require('./teacher.router')
const studentRouter = require('./student.router')
// const homeworkRouter = require('./homework.router')

router.use('/user', userRouter)
router.use('/future-lesson', futureLessonRouter)
router.use('/teacher', teacherRouter)
router.use('/student', studentRouter)

module.exports = router
