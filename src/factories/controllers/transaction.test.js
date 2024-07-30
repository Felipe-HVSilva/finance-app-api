import {
    CreateTransactionController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeUpdateTransactionController,
} from './transaction'

describe('Transaction Controller Factories', () => {
    it('Should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('shoudl return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })
})
