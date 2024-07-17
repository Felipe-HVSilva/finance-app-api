import { UserNotFoundError } from '../../errors/user'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { faker } from '@faker-js/faker'

describe('GetUserBalanceUseCase', () => {
    const userBalance = {
        earnings: faker.finance.amount(),
        expenses: faker.finance.amount(),
        investments: faker.finance.amount(),
        balance: faker.finance.amount(),
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserByEmailRepository,
            getUserBalanceRepository,
        )

        return { sut, getUserByEmailRepository, getUserBalanceRepository }
    }

    it('should get user balance successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(userBalance)
    })

    it('should throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce(
            null,
        )
        const userId = faker.string.uuid()

        const promise = sut.execute(userId)

        await expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })
})
