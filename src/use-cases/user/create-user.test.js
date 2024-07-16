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

        const createdUser = await sut.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        })

        expect(createdUser).toBeTruthy()
    })
})
