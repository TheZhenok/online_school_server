class ErrorResponse {
    raise(res, detail, code=400) {
        res.status(code).json({
            "error": detail
        })
    }
}

module.exports = new ErrorResponse()
