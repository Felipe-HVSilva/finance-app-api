import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserUseCase } from './create-user.js'
import { user as fixtureUser } from '../../tests/index.js'

describe('Crete User Use Case', () => {
    const user = {
        ...fixtureUser,
        id: undefined,
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterSub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const getUserByEmailRespository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()

        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterSub()

        const sut = new CreateUserUseCase(
            getUserByEmailRespository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRespository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    it('should successfully create a user', async () => {
        const { sut } = makeSut()

        const createdUser = await sut.execute(user)

        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRespository } = makeSut()

        jest.spyOn(getUserByEmailRespository, 'execute').mockReturnValueOnce(
            user,
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGeneratorAdapter to generate a random id', async () => {
        const {
            sut,
            idGeneratorAdapter,

            createUserRepository,
        } = makeSut()
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should call PasswordHasherAdapter to cryptograph password', async () => {
        const { sut, passwordHasherAdapter, createUserRepository } = makeSut()

        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        await sut.execute(user)

        expect(passwordHasherSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRespository } = makeSut()
        jest.spyOn(getUserByEmailRespository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter  throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws', async () => {
        const { sut, createUserRepository } = makeSut()
        jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})
