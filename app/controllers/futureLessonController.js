const { DatabaseError } = require("pg");
const user = require("../models/user");
const teacher = require("../models/teacher");
const student = require("../models/student");
const lesson = require("../models/lesson")
const errorResponse = require("../utils/errors/errorRequest");
const ValidationError = require("../utils/errors/validation");
const futureLesson = require("../models/futureLesson");
const times = require("../models/enums/times");
const daysOfWeek = require("../models/enums/daysOfWeek");

class FutureLessonController {
    async getFutureLessons(req, res) {
        function format (date) {  
            let dateParts = date.split("T")[0]
            return dateParts
        }

        let start = req.query['start']
        let end = req.query['end']
        if (!start || !end) {
            return errorResponse.raise(
                res,
                {
                    "start": "Is requied!",
                    "end": "Is requied!",
                }
            )
        }
        start = format(start)
        end = format(end)
        start = new Date(`${start} 00:00`)
        end = new Date(`${end} 00:00`)
        let finallyStart = new Date(`${format(req.query['start'])} 00:00`)

        if (start == "Invalid Date" || end == "Invalid Date") {
            return errorResponse.raise(res, "Uncurrent date format (DD-MM-YYYY)")
        }

        let lessons = await futureLesson.getByPeriod(start, end)

        let response = {"lessons": {}}
        let dayIndex
        for (let index = 0; index < lessons.length; index++) {
            const element = lessons[index]['start_datetime'];
            let day = element.getDate()
            let month = element.getMonth() + 1
            let year = element.getFullYear()
            let hour = element.getHours()
            let minutes = element.getMinutes()
            dayIndex = element.getUTCDay();

            if (day < 10) {
                day = `0${day}`
            }
            if (month < 10) {
                month = `0${month}`
            }
            if (hour < 10) {
                hour = `0${hour}`
            }
            if (minutes < 10) {
                minutes = `0${minutes}`
            }
            let key = `${day}-${month}-${year}`
            if (!response['lessons'][key]) {
                response['lessons'][key] = {
                    day_of_week: daysOfWeek[dayIndex]
                }
            }
            let time = `${hour}:${minutes}`
            if (!response['lessons'][key][time]) {
                response['lessons'][key][time] = {
                    type: "Затяно",
                    student: lessons[index]["student_id"]
                }
            }
        }
        while (start < end) {
            let day = start.getDate()
            let month = start.getMonth() + 1
            let year = start.getFullYear()
            if (day < 10) {
                day = `0${day}`
            }
            if (month < 10) {
                month = `0${month}`
            }
            let key = `${day}-${month}-${year}`
            dayIndex = start.getUTCDay();

            if (!response['lessons'][key]) {
                response['lessons'][key] = {
                    day_of_week: daysOfWeek[dayIndex]
                }
            }
            for (let t = 0; t < times.length; t++) {
                const element = times[t];
                if (!response['lessons'][key][element]) {
                    response['lessons'][key][element] = {
                        type: "Свободно",
                        student: undefined
                    }
                }
            }
            start.setDate(start.getDate() + 1)
        }

        let lessonsResponse = {"lessons": {}}
        while (finallyStart < end) {
            let day = finallyStart.getDate()
            let month = finallyStart.getMonth() + 1
            let year = finallyStart.getFullYear()
            if (day < 10) {
                day = `0${day}`
            }
            if (month < 10) {
                month = `0${month}`
            }
            let key = `${day}-${month}-${year}`
            lessonsResponse['lessons'][key] = response['lessons'][key]
            finallyStart.setDate(finallyStart.getDate() + 1)
        }
        return res.json(lessonsResponse)

    }

    async createFutureLesson(req, res) {
        let err = futureLesson.validate(req.body)
        if (err.length != 0) {
            return errorResponse.raise(res, err)
        }

        let lessons = await futureLesson.filter({
            start_datetime: req.body["start_datetime"],
            teacher_id: req.body["teacher_id"]
        })
        if (lessons.length != 0) {
            return errorResponse.raise(res, "У данного учителя уже есть урок на это время!")
        }
        let newFutureLesson
        try {
            newFutureLesson = await futureLesson.create(req.body)
            newFutureLesson = newFutureLesson[0]
        } catch (e) {
            if (e instanceof DatabaseError) {
                if (e.constraint == 'future_lesson_teacher_id_fkey') {
                    return errorResponse.raise(res, "Такого учителя не существует!", 404)
                }
            }
            console.log(e);
            return errorResponse.raise(res, "FATAL")
        }
        res.status(201).json(newFutureLesson)
    }
}

module.exports = new FutureLessonController()
