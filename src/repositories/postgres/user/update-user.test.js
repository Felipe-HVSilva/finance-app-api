import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresUpdateUserRepository } from './update-user.js'

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
        const prismaSpy = jest.spyOn(prisma.user, 'update')

        await sut.execute(user.id, updateUser)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUser,
        })
    })
})