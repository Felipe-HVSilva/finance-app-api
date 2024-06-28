import {
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const deletedUser =
                await this.deleteTransactionUseCase.execute(userId)
            if (!deletedUser) {
                return notFound()
            }
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return badRequest({ message: 'Internal server error' })
        }
    }
}
