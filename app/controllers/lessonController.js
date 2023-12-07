const { DatabaseError } = require("pg");
const user = require("../models/user");
const teacher = require("../models/teacher");
const student = require("../models/student");
const lesson = require("../models/lesson")
const errorResponse = require("../utils/errors/errorRequest");
const ValidationError = require("../utils/errors/validation");

class LessonController {
}

module.exports = new LessonController()
