import validator from 'validator'
import { badRequest } from './http.js'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidPasswordResponse = () => {
    return badRequest({ message: 'Password must be at least 6 characters.' })
}

export const requiredFieldsIsMissingResponse = (field) => {
    return badRequest({
        message: `The field ${field} is required`,
    })
}
