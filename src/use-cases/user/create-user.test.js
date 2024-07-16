import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserUseCase } from './create-user.js'
import { faker } from '@faker-js/faker'

describe('Crete User Use Case', () => {
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

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const makeSut = () => {
        const getUserByEmailRespository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()

        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGenerator = new IdGeneratorAdapterSub()

        const sut = new CreateUserUseCase(
            getUserByEmailRespository,
            createUserRepository,
            passwordHasherAdapter,
            idGenerator,
        )

        return {
            sut,
            getUserByEmailRespository,
            createUserRepository,
            passwordHasherAdapter,
            idGenerator,
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
})
