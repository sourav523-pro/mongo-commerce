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

// sequential processing, stops running validations chain if the previous one have failed.
// const Validator = (validations) => {
//     return async (req, res, next) => {
//         for (let validation of validations) {
//             const result = await validation.run(req)
//             if (result.errors.length) break
//         }

//         const errors = expressValidator.validationResult(req)
//         if (errors.isEmpty()) {
//             return next()
//         }

//         res.status(400).json({ errors: errors.array().map((obj) => { return obj['message'] }) })
//     }
// }

export default Validator