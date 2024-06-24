import validator from 'validator'
import { badRequest } from './http.js'

export const checkIsAmountIsValid = (amount) => {
    if (typeof amount === 'number') {
        return false
    }

    return validator.isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
    })
}

export const checkIsTypeIsValid = (type) =>
    ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

export const invalidAmountResponse = () => {
    return badRequest({
        message: 'Them amount must be a valid currency',
    })
}

export const invalidTypeResponse = () => {
    return badRequest({
        message: 'The type must be EARNING, EXPENSE or INVESTMENT',
    })
}
