const { DatabaseError } = require("pg");
const user = require("../models/user");
const teacher = require("../models/teacher");
const student = require("../models/student");
const errorResponse = require("../utils/errors/errorRequest");
const ValidationError = require("../utils/errors/validation");

class UserController {
    async createUser(req, res) {
        let typeUser = req.body['type']
        delete req.body['type']

        let err = user.validate(req.body)
        if (err.length != 0) {
            errorResponse.raise(res, err)
        }

        let newUser
        try {
            newUser = await user.create(req.body)
            newUser = newUser[0]
        } catch (e) {
            if (e instanceof DatabaseError) {
                errorResponse.raise(res, "Пользователь с такой почтой уже существует!", 400)
                return
            } else {
                console.log(e);
                errorResponse.raise(res, "Error")
            }
        }

        if (typeUser == 'teacher') {
            err = teacher.validate({"user_id": newUser["id"]})
            if (err.length != 0) {
                errorResponse.raise(res, err)
            }
            let newTeacher = await teacher.create({"user_id": newUser["id"]})
            newTeacher = newTeacher[0]
            newUser["teacher_id"] = newTeacher["id"]
        } else if (typeUser == "student") {
            err = student.validate({"user_id": newUser["id"]})
            if (err.length != 0) {
                errorResponse.raise(res, err)
            }
            let newStudent = await student.create({"user_id": newUser["id"]})
            newStudent = newStudent[0]
            newUser["student_id"] = newStudent["id"]
        }
        res.status(201).json(newUser)
    }

    async getUser(req, res) {
        let users = await user.select();
        res.json(users)
    }

    async retriaveUser(req, res) {
        let id = req.params.id;
        try {
            let userFromDatabase = await user.get(id);
            if (userFromDatabase) {
                res.json(userFromDatabase)
            } else {
                errorResponse.raise(res, "User not found!", 404)
            }
        } catch (e) {
            errorResponse.raise(res, "Error")
        }
    }

    async updateUser(req, res) {
        try {
            let authUser = await user.checkAuthorization(req)
            let data = req.body
            if (req.file) {
                let filename = req.file.filename
                data['image'] = `/image/${filename}`
            }

            let typeFields
            if (authUser['type'] == 'teacher') {
                typeFields = {
                    'description': data['description'],
                    'subject': data['subject']
                }
                for (const key in typeFields) {
                    if (!typeFields[key]) {
                        delete typeFields[key]
                    }
                }

                await teacher.edit(authUser['id'], typeFields)
                delete data['description']
                delete data['subject']
            }
            
            let editedUser = await user.edit(authUser["user_id"], data)
            return res.json(editedUser)
        } catch (e) {
            if (e instanceof ValidationError) {
                return errorResponse.raise(res, e.errors)
            }
            console.log(e);
            return errorResponse.raise(res, "FATAL", 500)
        }
    }

    async deleteUser(req, res) {
        let id = req.params.id;
        let newUser = await user.delete(id)
        res.json(newUser)
    }

    async getMyProfile(req, res) {
        let currentUser = await user.checkAuthorization(req)
        if (!currentUser) {
            return errorResponse.raise(res, "Token not valid!")
        }

        return res.json(currentUser)
    }
}

module.exports = new UserController()
