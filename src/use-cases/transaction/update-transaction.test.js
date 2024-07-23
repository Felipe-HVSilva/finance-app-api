import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction.js'
import { transaction } from '../../tests/index.js'

describe('UpdateTransactionUseCase', () => {
    class UpdateTransactionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return { sut, updateTransactionRepository }
    }

    it('should update a transaction successfully', async () => {
        const { sut } = makeSut()
        const id = faker.string.uuid()

        const result = await sut.execute(id, {
            amount: Number(faker.finance.amount()),
        })

        expect(result).toEqual({
            id,
            ...transaction,
        })
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        )
        const id = faker.string.uuid()

        await sut.execute(id, {
            amount: transaction.amount,
        })

        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(id, {
            amount: transaction.amount,
        })
    })

    it('should throw if UpdateTransactionRepository throws', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        })

        await expect(promise).rejects.toThrow()
    })
})
