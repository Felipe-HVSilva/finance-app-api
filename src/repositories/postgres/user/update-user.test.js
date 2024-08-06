import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresUpdateUserRepository } from './update-user.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserNotFoundError } from '../../../errors/user.js'

describe('PostgresUpdateUserRepository', () => {
    const updateUser = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        email: faker.internet.email(),
        last_name: faker.person.lastName(),
        password: faker.string.uuid(),
    }

    it('should update user on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgresUpdateUserRepository()

        const result = await sut.execute(user.id, updateUser)

        expect(result).toStrictEqual(updateUser)
    })

    it('should call Prisma with correct params', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresUpdateUserRepository()
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'update')

        await sut.execute(user.id, updateUser)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUser,
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateUserRepository()

        import.meta.jest
            .spyOn(prisma.user, 'update')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser)

        await expect(promise).rejects.toThrow()
    })

    it('should throw UserNotFoundError if Prisma does not find record to update', async () => {
        const sut = new PostgresUpdateUserRepository()
        import.meta.jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const promise = sut.execute(updateUser.id)

        expect(promise).rejects.toThrow(new UserNotFoundError(updateUser.id))
    })
})
