import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidPasswordResponse = () => {
    return badRequest({ message: 'Password must be at least 6 characters.' })
}

export const requiredFieldsIsMissingResponse = (field) => {
    badRequest({
        message: `The field ${field} is required`,
    })
}

export const checkIsString = (value) => typeof value === 'string'

export const validateRequiredFiled = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]
        const fieldIsEmpty =
            checkIsString(params[field]) &&
            validator.isEmpty(params[field], {
                ignore_whitespace: true,
            })
        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            }
        }
    }
    return {
        ok: true,
        missingField: undefined,
    }
}
