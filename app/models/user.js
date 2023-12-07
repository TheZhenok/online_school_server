const BaseORM = require('../db/orm')
const { DatabaseError } = require('pg')
const db = require("../db/core");
const { v4: uuidv4 } = require('uuid');
const teacherModel = require("./teacher")
const studentModel = require("./student")
const ValidationError = require("../utils/errors/validation");


class Person extends BaseORM {

    constructor() {
        super()
        this.fields = [
            "first_name",
            "last_name",
            "email",
            "password",
            "birthdate",
            "is_active",
            "image"
        ]
    }

    async teacherOrStudent(user_id) {
        let teacher = await teacherModel.filter({user_id: user_id})
        let student = await studentModel.filter({user_id: user_id})
        let currentUser
        let result
        if (teacher.length != 0) {
            currentUser = await db.query(
                `SELECT * FROM Person
                INNER JOIN Teacher ON Person.id = Teacher.user_id
                WHERE Person.id = $1;`, [user_id]
            )
            result = currentUser.rows[0]
            result["type"] = "teacher"
            return result
        } else if (student.length != 0) {
            currentUser = await db.query(
                `SELECT * FROM Person
                INNER JOIN Student ON Person.id = Student.user_id
                WHERE Person.id = $1;`, [user_id]
            )
            result = currentUser.rows[0]
            result["type"] = "student"
            return result
        } else {
            result = {type: "null"}
        }
        return result
    }

    async checkAuthorization(req) {
        let token = req.headers['authorization']
        if (token) {
            let csrf = await db.query(
                `SELECT * FROM csrf_token WHERE token = $1;`, [token]
            )
            csrf = csrf.rows
            if (csrf.length == 0) {
                throw ValidationError("Token is not current")
            }
            csrf = csrf[0]
            
            let user_id = csrf["user_id"]
            let fullUser = await this.teacherOrStudent(user_id)
            return fullUser
        } else {
            throw ValidationError("No token!")
        }
    }

    authorization = async (email, password) => {
        let currentUser = await this.filter({
            email: email,
            password: password
        });
        if (currentUser.length == 0) {
            return
        }
        currentUser = currentUser[0];

        await db.query(
            `DELETE FROM csrf_token WHERE user_id = $1`, [currentUser.id]
        )

        let userUUID = uuidv4();
        await db.query(
            `INSERT INTO csrf_token (token, user_id) VALUES ($1 , $2);`, [userUUID, currentUser["id"]]
        )
        let type = await this.teacherOrStudent(currentUser["id"])
        return {"token": userUUID, "type": type["type"]}
    }

    validate(obj) {
        const uniqueValidate = {
            "email": function() {
                let email = obj['email']
                let emailParts = email.split("@")
                if (emailParts.length != 2) {
                    return {
                        "email": "Not valid format!"
                    }
                }
            },
            "password": function() {
                let pass = obj['password']
                if (pass.length < 8) {
                    return {
                        "password": "Length great 8 symbols!"
                    }
                }
            }
        }
        const requireFields = [
            "first_name",
            "last_name",
            "email",
            "password"
        ]
        const dataTypes = {
            first_name: "string",
            last_name: "string",
            email: "string",
            birthdate: "string",
            password: "string"
        }
        let errors = super.validate(obj, uniqueValidate, requireFields, dataTypes)
        return errors
    }
}

module.exports = new Person()