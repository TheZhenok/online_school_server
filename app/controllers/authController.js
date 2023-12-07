const { DatabaseError } = require("pg");
const user = require("../models/user")
const teacher = require("../models/teacher")
const student = require("../models/student")
const errorResponse = require("../utils/errors/errorRequest")

class AuthController {

    async login(req, res) {
        let obj = req.body
        let email = obj["email"]
        let password = obj["password"]
        if (email && password) {
            let token = await user.authorization(email, password)
            if (token) {
                return res.json({token})
            } else {
                return errorResponse.raise(res, "Неверный логин или пароль!")
            }
        } else {
            return errorResponse.raise(res, "Email and password is required!")
        }
    }
}

module.exports = new AuthController()
