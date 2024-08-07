import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { user } from '../../tests/index.js'

describe('UpdateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'password-hasher'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )
        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        }
    }

    it('should  update user successfully (without email and password', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid(), {
            firstName: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        expect(result).toBe(user)
    })

    it('should update user successfully (with email)', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        const getUserByEmailRepositorySpy = import.meta.jest.spyOn(
            getUserByEmailRepository,
            'execute',
        )
        const email = faker.internet.email()

        const result = await sut.execute(faker.string.uuid(), {
            email,
        })

        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        const passwordHasherAdapterSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const password = faker.string.uuid()

        const result = await sut.execute(faker.string.uuid(), {
            password,
        })

        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
        expect(result).toBe(user)
    })

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValue(user)

        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call UpdateUserRepository with correct params', async () => {
        const { sut, updateUserRepository } = makeSut()
        const updateUserRepositorySpy = import.meta.jest.spyOn(
            updateUserRepository,
            'execute',
        )

        await sut.execute(user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        })

        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: 'password-hasher',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValue(new Error())

        const promise = sut.execute(faker.string.uuid(), {
            email: faker.internet.email(),
        })

        await expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        import.meta.jest
            .spyOn(passwordHasherAdapter, 'execute')
            .mockRejectedValue(new Error())

        const promise = sut.execute(faker.string.uuid(), {
            password: faker.internet.password(),
        })

        await expect(promise).rejects.toThrow()
    })

    it('should throw if UpdateUserRepository throws', async () => {
        const { sut, updateUserRepository } = makeSut()
        import.meta.jest
            .spyOn(updateUserRepository, 'execute')
            .mockRejectedValue(new Error())

        const promise = sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            password: faker.internet.password(),
        })

        await expect(promise).rejects.toThrow()
    })
})
