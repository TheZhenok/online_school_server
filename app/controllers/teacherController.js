const { DatabaseError } = require("pg");
const user = require("../models/user");
const teacher = require("../models/teacher");
const student = require("../models/student");
const lesson = require("../models/lesson")
const errorResponse = require("../utils/errors/errorRequest");
const ValidationError = require("../utils/errors/validation");
const futureLesson = require("../models/futureLesson");

class TeacherController {
    async get(req, res) {
        let teachers = await teacher.select()
        return res.json(teachers)
    }

    async retriave(req, res) {
        let id = req.params.id;
        try {
            let teacherFromDatabase = await teacher.get(id);
            if (teacherFromDatabase) {
                res.json(teacherFromDatabase)
            } else {
                errorResponse.raise(res, "Teacher not found!", 404)
            }
        } catch (e) {
            errorResponse.raise(res, "Error")
        }
    }
}

module.exports = new TeacherController()
