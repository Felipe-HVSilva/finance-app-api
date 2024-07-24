import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresUpdateUserRepository } from './update-user.js'

describe('PostgresUpdateUserRepository', () => {
    it('should update user on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgresUpdateUserRepository()

        const updateUser = {
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            email: faker.internet.email(),
            last_name: faker.person.lastName(),
            password: faker.string.uuid(),
        }

        const result = await sut.execute(user.id, updateUser)

        expect(result).toStrictEqual(updateUser)
    })
})
