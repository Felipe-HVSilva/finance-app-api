import { faker } from '@faker-js/faker'

import { CreateTransactionController } from './create-transaction.js'

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
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
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 when creating transaction successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(baseHttpRequest)
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
})
