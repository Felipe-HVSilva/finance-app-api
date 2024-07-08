import { faker } from '@faker-js/faker'
import { GetTransactionByUserIdController } from './get-transaction-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('Get Transaction By User ID Controller', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    data: faker.date.anytime().toISOString(),
                    type: 'EXPENSE',
                    amount: Number(faker.finance.amount()),
                },
            ]
        }
    }
    const makeSut = () => {
        const getTransactionByUserIdUseCase =
            new GetTransactionByUserIdUseCaseStub()
        const sut = new GetTransactionByUserIdController(
            getTransactionByUserIdUseCase,
        )

        return { sut, getTransactionByUserIdUseCase }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when missing userId param', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: { userId: undefined },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when  userId param is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({
            query: { userId: 'invalid_userId' },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when GetTransactionByUserIdUseCase throws UserNotFoundError', async () => {
        const { sut, getTransactionByUserIdUseCase } = makeSut()

        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockImplementationOnce(() => {
            throw new UserNotFoundError()
        })

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionByUserIdUseCase throws ', async () => {
        const { sut, getTransactionByUserIdUseCase } = makeSut()

        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(500)
    })
})
