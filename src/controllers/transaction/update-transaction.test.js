import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
import { transaction } from '../../tests/index.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    const baseHttpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 200 when updating a transaction sucessfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when transaction id is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                unallowed_field: 'unallowed',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when UpdatingTransactionUseCase throws', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(500)
    })

    it('should return 404 when TransactionNotFoundError throws', async () => {
        const { sut, updateTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(404)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            updateTransactionUseCase,
            'execute',
        )

        await sut.execute(baseHttpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            baseHttpRequest.params.transactionId,
            baseHttpRequest.body,
        )
    })
})
