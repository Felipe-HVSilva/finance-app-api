import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const isIdValid = checkIfIdIsValid(transactionId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const deletedUser =
                await this.deleteTransactionUseCase.execute(transactionId)
            if (!deletedUser) {
                return notFound()
            }
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
