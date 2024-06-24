import validator from 'validator'
import { badRequest } from './http.js'

export const emailIsAlreadyInUseResponse = () =>
    badRequest({ message: 'Invalid e-mail. Please provide a valid one.' })

export const invalidIdResponse = () =>
    badRequest({ message: 'The provided id is invalid.' })

export const checkIsPasswordIsValid = (password) => password.length >= 6

export const checkIsEmailIsValid = (email) => validator.isEmail(email)
