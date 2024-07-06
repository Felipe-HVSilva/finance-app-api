import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionControllerStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                data: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionController =
            new DeleteTransactionControllerStub()
        const sut = new DeleteTransactionController(deleteTransactionController)

        return { sut, deleteTransactionController }
    }
    it('should return 200 when deleting transaction successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: { transactionId: 'invalid_id' },
        })

        expect(response.statusCode).toBe(400)
    })
})
