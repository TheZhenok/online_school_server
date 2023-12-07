const BaseORM = require('../db/orm')
const { DatabaseError } = require('pg')

class Lesson extends BaseORM {

    constructor() {
        super()
        this.fields = [
            "teacher_id",
            "theme",
            "description",
            "cover",
            "duration",
            "subject",
            "complexity"
        ]
    }

    validate(obj) {
        const uniqueValidate = {}
        const requireFields = [
            "teacher_id",
            "theme",
            "description",
            "cover",
            "duration",
            "subject",
            "complexity"
        ]
        const dataTypes = {
            teacher_id: "number",
            theme: "string",
            description: "string",
            cover: "string",
            duration: "string",
            subject: "string",
            complexity: "string"
        }
        let errors = super.validate(obj, uniqueValidate, requireFields, dataTypes)
        return errors
    }
}

module.exports = new Lesson()