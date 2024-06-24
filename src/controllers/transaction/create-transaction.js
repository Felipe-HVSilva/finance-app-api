import {
    created,
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    validateRequiredFiled,
    requiredFieldsIsMissingResponse,
    checkIsAmountIsValid,
    checkIsTypeIsValid,
    invalidTypeResponse,
    invalidPasswordResponse,
} from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFiled(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return requiredFieldsIsMissingResponse(missingField)
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const amountIsValid = checkIsAmountIsValid(params.amount)

            if (!amountIsValid) {
                invalidPasswordResponse
            }

            const type = params.type.trim().toUpperCase()

            const typeIsValid = checkIsTypeIsValid(type)

            if (!typeIsValid) {
                invalidTypeResponse
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            })

            return created(transaction)
        } catch (e) {
            console.error(e)
            return serverError()
        }
    }
}
