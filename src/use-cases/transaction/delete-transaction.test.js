import { transaction } from '../../tests/index.js'
import { DeleteTransactionUseCase } from './delete-transaction.js'

describe('DeleteTransactionUseCase', () => {
    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction.id)

        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const deleteTransactionRepositorySpy = jest.spyOn(
            deleteTransactionRepository,
            'execute',
        )

        await sut.execute(transaction.id)

        expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
        )
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow()
    })
})
