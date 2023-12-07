const db = require("./core");
const ValidationError = require("../utils/errors/validation")

class BaseORM {
    constructor() {
        this.fields = []
        this.className = this.constructor.name
    }

    select = async (...columns) => {
        let query_string = ""
        if(columns.length == 0) {
            query_string = `SELECT * FROM ${this.className};`
        } else {
            query_string = `SELECT ${columns.join(", ")} FROM ${this.constructor.name};`
        }
        let objects = await db.query(query_string)
        return objects.rows
    }

    get = async (id) => {
        let object = await db.query(
            `SELECT * FROM ${this.className} WHERE id = ${id};`
        )
        return object.rows[0]
    }

    filter = async (obj) => {
        if(typeof obj != "object") {
            throw Error("Not object!")
        }

        let rules = ""
        for (const property in obj) {
            if (typeof obj[property] == "string") {
                rules += `${property} = '${obj[property]}' AND `
            } else {
                rules += `${property} = ${obj[property]} AND `
            }
        }
        rules = rules.slice(0, -4)
        let objects = await db.query(
            `SELECT * FROM ${this.className} WHERE ${rules};`
        )
        return objects.rows
    }

    create = async (obj) => {
        if(typeof obj != "object") {
            throw Error("Not object!")
        }
        let columns = ""
        let values = ""
        for (const property in obj) {
            columns += `${property}, `
            if (typeof values == "string") {
                values += `'${obj[property]}', `
            } else {
                values += `${obj[property]}, `
            }
        }
        columns = columns.slice(0, -2)
        values = values.slice(0, -2)
        let object = await db.query(
            `INSERT INTO ${this.className}(${columns}) VALUES (${values}) RETURNING *;`
        )
        return object.rows
    }

    // obj - {field: value}
    // uniqueValidate = {key: Callable}
    // requireFields - Array[fields]
    // dataTypes - {field: data type}
    validate(obj, uniqueValidate, requireFields, dataTypes){
        let errors = []
        let objKeys = Object.keys(obj)
        let checkKeys = Object.keys(obj)
        for (let index = 0; index < requireFields.length; index++) {
            const element = requireFields[index];
            if (checkKeys.includes(element)) {
                if (typeof obj[element] != dataTypes[element]) {
                    errors.push({
                        [element]: `has been ${dataTypes[element]} data type`
                    })
                }
                let i = objKeys.indexOf(element)
                objKeys.splice(i, 1)
            } else {
                errors.push({
                    [element]: "has reqiered!"
                })
            }
        }
        if (objKeys.length != 0) {
            for (let index = 0; index < objKeys.length; index++) {
                const element = objKeys[index];
                errors.push({
                    [element]: "Field not found!"
                })
            }
        }

        for (let index = 0; index < checkKeys.length; index++) {
            const element = checkKeys[index];
            if (uniqueValidate[element]) {
                let err = uniqueValidate[element]()
                if (err) {
                    errors.push(err)
                }
            }
        }

        return errors
    }

    delete = async (id) => {
        let object = await db.query(
            `DELETE FROM ${this.className} WHERE id = ${id} RETURNING *;`
        )
        return object.rows 
    }

    edit = async (id, obj) => {
        if(typeof obj != "object") {
            throw Error("Not object!")
        }
        let rules = ""
        let errors = []
        for (const property in obj) {
            if (!this.fields.includes(property)) {
                errors.push(`Field ${property} does not exists!`)
            }
            if (typeof obj[property] == "string") {
                rules += `${property} = '${obj[property]}', `
            } else {
                rules += `${property} = ${obj[property]}, `
            }
        }
        if (errors.length != 0) {
            throw new ValidationError(errors)
        }
        rules = rules.slice(0, -2)

        try {
            let object = await db.query(
                `UPDATE ${this.className} SET ${rules} WHERE id = ${id} RETURNING *;`
            )
            return object.rows[0]
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = BaseORM
