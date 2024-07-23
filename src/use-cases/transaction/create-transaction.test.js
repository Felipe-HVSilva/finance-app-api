import { CreateTransactionUseCase } from './create-transaction.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction, user } from '../../tests/index.js'

describe('CreateTransactionUseCase', () => {
    const createTransactionParams = {
        ...transaction,
        id: undefined,
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id'
        }
    }

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return {
                ...user,
                id: userId,
            }
        }
    }

    const makeSut = () => {
        const createTransactionRepository =
            new CreateTransactionRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new CreateTransactionUseCase(
            getUserByIdRepository,
            createTransactionRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepository,
            idGeneratorAdapter,
            getUserByIdRepository,
        }
    }

    it('should create transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(createTransactionParams)

        expect(result).toEqual({ ...createTransactionParams, id: 'random_id' })
    })

    it('should call GetUserByEmailRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const getUserByIdRepositorySpy = jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(createTransactionParams)

        expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(
            createTransactionParams.user_id,
        )
    })

    it('should call IdGeneratorAdapter', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        await sut.execute(createTransactionParams)

        expect(idGeneratorAdapterSpy).toHaveBeenCalled()
    })

    it('should call CreateTransactionRepository with correct params', async () => {
        const { sut, createTransactionRepository } = makeSut()
        const createTransactionRepositorySpy = jest.spyOn(
            createTransactionRepository,
            'execute',
        )

        await sut.execute(createTransactionParams)

        expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(createTransactionParams)

        await expect(promise).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(getUserByIdRepository)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.execute(idGeneratorAdapter)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        const { sut, createTransactionRepository } = makeSut()
        jest.spyOn(createTransactionRepository, 'execute').mockRejectedValue(
            new Error(),
        )

        const promise = sut.execute(createTransactionRepository)

        await expect(promise).rejects.toThrow()
    })
})
