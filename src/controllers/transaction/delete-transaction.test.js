import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
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

    it('should return 404 when transaction is not found', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )

        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()

        jest.spyOn(deleteTransactionUseCase, 'execute').mockImplementationOnce(
            () => {
                throw new Error()
            },
        )

        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        const transactionId = faker.string.uuid()

        await sut.execute({ params: { transactionId } })

        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
