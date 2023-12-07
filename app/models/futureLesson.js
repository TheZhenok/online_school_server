const BaseORM = require('../db/orm')
const db = require('../db/core')
const { DatabaseError } = require('pg')
const times = require("../models/enums/times")
const daysOfWeek = require("../models/enums/daysOfWeek")

class FutureLesson extends BaseORM {

    constructor() {
        super()
        this.fields = [
            "start_datetime",
            "teacher_id",
            "student_id",
            "is_denied",
            "is_conducted"
        ]
        this.className = "future_lesson"
    }

    getByPeriod = async (start, end) => {
        let currentStart = `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`
        let currentEnd = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`
        let futureLessons = await db.query(
            `
            SELECT * FROM ${this.className}
            WHERE start_datetime >= '${currentStart}'
            AND start_datetime <= '${currentEnd}'
            `
        )
        return futureLessons.rows
    }

    validate(obj) {
        const uniqueValidate = {
            start_datetime: function(){
                let start_datetime = obj['start_datetime']
                let date = new Date(start_datetime)
                let time = `${date.getHours()}:0${date.getMinutes()}`
                if (!times.includes(time)) {
                    return {
                        "start_datetime": `Chouse time: ${times}!`
                    }
                }
            }
        }
        const requireFields = [
            "start_datetime",
            "teacher_id",
            "student_id"
        ]
        const dataTypes = {
            start_datetime: "string",
            teacher_id: "number",
            student_id: "number"
        }
        let errors = super.validate(obj, uniqueValidate, requireFields, dataTypes)
        return errors
    }
}

module.exports = new FutureLesson()