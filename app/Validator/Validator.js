import expressValidator from 'express-validator'

// parallel processing
const Validator = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)))

        const errors = expressValidator.validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        res.status(400).json({ status: false, errors: errors.array() })
    }
}

export default Validator