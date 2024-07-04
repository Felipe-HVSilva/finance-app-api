import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
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
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 if a user is found', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if userId is invalid', async () => {
        const { sut } = makeSut()

        const response = await sut.execute({ params: { userId: 'invalid_id' } })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 if userId is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)
        const response = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(404)
    })
})
