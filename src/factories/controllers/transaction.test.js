import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from './transaction'

describe('Transaction Controller Factories', () => {
    it('Should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })

    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        )
    })

    it('should return a valid GetTransactionByUserIdController instance', () => {
        expect(makeGetTransactionByUserIdController()).toBeInstanceOf(
            GetTransactionByUserIdController,
        )
    })
})
