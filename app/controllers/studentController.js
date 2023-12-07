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
        try {
            let authUser = await user.checkAuthorization(req)
            if (authUser['type'] == 'teacher') {
                let students = await student.select(authUser['id'])
                return res.json(students)
            }

            return errorResponse.raise(res, "Permission denied!", 401)
        } catch (e) {
            if (e instanceof ValidationError) {
                return errorResponse.raise(res, e.errors)
            }

            console.log(e);
        }
    }

    async retriave(req, res) {
        let id = req.params.id;
        try {
            let studentFromDatabase = await student.get(id);
            if (studentFromDatabase) {
                res.json(studentFromDatabase)
            } else {
                errorResponse.raise(res, "Teacher not found!", 404)
            }
        } catch (e) {
            errorResponse.raise(res, "Error")
        }
    }
}

module.exports = new TeacherController()
