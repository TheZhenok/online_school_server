class ValidationError extends Error {
    constructor(errors) {
        super()
        this.message = "Validation error!"
        this.name = "ValidationError"
        this.errors = errors
    }
}

module.exports = ValidationError