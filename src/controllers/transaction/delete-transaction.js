import {
    checkIfIdIsValid,
    invalidIdResponse,
    notFound,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js'
import { TransactionNotFoundError } from '../../errors/index.js'
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

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            if (!deletedTransaction) {
                return notFound()
            }
            return ok(deletedTransaction)
        } catch (error) {
            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse()
            }
            console.error(error)
            return serverError()
        }
    }
}
