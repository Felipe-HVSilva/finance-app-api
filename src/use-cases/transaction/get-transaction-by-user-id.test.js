import { faker } from '@faker-js/faker'
import { user } from '../../tests'

import { GetTransactionByUserIdUseCase } from './get-transaction-by-user-id.js'

describe('GetTransactionByUserId', () => {
    class GetTransactionByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdRepository =
            new GetTransactionByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionByUserIdUseCase(
            getTransactionByUserIdRepository,
            getUserByIdRepository,
        )

        return { sut, getTransactionByUserIdRepository, getUserByIdRepository }
    }

    it('should get transaction by user id  successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual([])
    })

    it('should call GetTransactionByUserId with correct params', async () => {
        const { sut, getTransactionByUserIdRepository } = makeSut()
        const getTransactionByUserIdRepositorySpy = jest.spyOn(
            getTransactionByUserIdRepository,
            'execute',
        )

        await sut.execute(user.id)

        expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledWith(
            user.id,
        )
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(user.id)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(user.id)
    })
})
