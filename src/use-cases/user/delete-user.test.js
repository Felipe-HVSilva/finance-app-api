import { DeleteUserUseCase } from './delete-user.js'
import { faker } from '@faker-js/faker'
import { user } from '../../tests/index.js'

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }
    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)

        return { sut, deleteUserRepository }
    }

    it('should delete a user', async () => {
        const { sut } = makeSut()

        const deleteUser = await sut.execute(faker.string.uuid())

        expect(deleteUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        const { sut, deleteUserRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteUserRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makeSut()

        import.meta.jest
            .spyOn(deleteUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())
        const promise = sut.execute(faker.string.uuid())

        await expect(promise).rejects.toThrow()
    })
})
