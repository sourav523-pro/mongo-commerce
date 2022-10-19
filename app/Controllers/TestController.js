import { Router } from 'express'
import request from 'request'
import { body, check } from 'express-validator'
import Validator from '../Validator/Validator.js'
import Unit from '../Model/Unit.js'



const TestController = () => {
    const router = Router()
    router.get('/bulk-unit', (req, res) => {
        try {
            let url = 'http://localhost:5000/api/unit'
            let options = {
                'method': 'POST',
                'url': url,
                'headers': {
                    'Authorization': 'Bearer $2b$10$ga68OwpvZZn3LCn6eW2DlekeVEp3DgLAWi7brcsJt6yEGebq8Qbwq-63503f2e6f6a50df4d11a357',
                    'Content-Type': 'application/json'
                },
                body: null

            }
            const units = [{ "unit": "m", "type": "dimension" },
            { "unit": "mm", "type": "dimension" },
            { "unit": "inch", "type": "dimension" },
            { "unit": "cm", "type": "dimension" },
            { "unit": "lb", "type": "weight" },
            { "unit": "oz", "type": "weight" },
            { "unit": "lb", "type": "weight" },
            { "unit": "kg", "type": "weight" },
            { "unit": "g", "type": "weight" },
            { "unit": "pound", "type": "inventory" },
            { "unit": "ml", "type": "inventory" },
            { "unit": "l", "type": "inventory" },
            { "unit": "g", "type": "inventory" },
            { "unit": "kg", "type": "inventory" },
            { "unit": "pice", "type": "inventory" }]
            units.forEach((item) => {
                options.body = JSON.stringify(item)
                request(options, function (error, response) {
                    if (error) throw new Error(error)
                    console.log(response.body)
                })
            })

            res.status(201).json({
                status: true,
                message: "Unit inserted",
                data: units
            })
        } catch (err) {
            res.status(500).json({
                status: false,
                message: err.message
            })
        }

    })
    return router
}

export default TestController