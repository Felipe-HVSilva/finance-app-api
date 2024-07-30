import { CreateTransactionController } from '../../controllers'
import { makeCreateTransactionController } from './transaction'

describe('Transaction Controller Factories', () => {
    it('Should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
