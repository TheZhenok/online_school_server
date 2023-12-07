const e = require('express')
const BaseORM = require('../db/orm')
const { DatabaseError } = require('pg')
const db = require("../db/core");

class Teacher extends BaseORM {

    constructor() {
        super()
        this.fields = [
            'description',
            'subject'
        ]
    }

    validate(obj) {
        const uniqueValidate = {}
        const requireFields = [
            "user_id"
        ]
        const dataTypes = {
            user_id: "number"
        }
        let errors = super.validate(obj, uniqueValidate, requireFields, dataTypes)
        return errors
    }

    select = async () => {
        let query_string = ""
        query_string = `
            SELECT 
                person.id,
                person.first_name,
                person.last_name,
                person.email,
                person.image,
                ${this.className}.id AS teacher_id,
                ${this.className}.description,
                ${this.className}.subject
            FROM ${this.className}
            INNER JOIN person ON person.id = ${this.className}.user_id;
        `
        let objects = await db.query(query_string)
        return objects.rows
    }

    get = async (id) => {
        let object = await db.query(
            `SELECT
                person.id,
                person.first_name,
                person.last_name,
                person.email,
                person.image,
                ${this.className}.id AS teacher_id,
                ${this.className}.description,
                ${this.className}.subject
            FROM ${this.className}
            INNER JOIN person ON person.id = ${this.className}.user_id
            WHERE id = ${this.className}.${id};`
        )
        return object.rows[0]
    }
}

module.exports = new Teacher()