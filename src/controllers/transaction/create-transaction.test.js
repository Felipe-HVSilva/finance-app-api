import { CreateTransactionController } from './create-transaction.js'
import { transaction } from '../../tests/index.js'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { sut, createTransactionUseCase }
    }

    const baseHttpRequest = {
        body: {
            ...transaction,
            id: undefined,
        },
    }

    it('should return 201 when creating transaction successfully (expense)', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(baseHttpRequest)
        expect(response.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction successfully (earning)', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EARNING',
            },
        })
        expect(response.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction successfully (investment)', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'INVESTMENT',
            },
        })
        expect(response.statusCode).toBe(201)
    })

    it('should return 400 when missing user_id', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                user_id: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                name: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: 'invalid_date',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is not a valid currency', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when CreateTransactionUseCase throws', async () => {
        const { sut, createTransactionUseCase } = makeSut()

        import.meta.jest
            .spyOn(createTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const response = await sut.execute(baseHttpRequest)

        expect(response.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with correct params', async () => {
        const { sut, createTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            createTransactionUseCase,
            'execute',
        )

        await sut.execute(baseHttpRequest)

        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
    })
})
