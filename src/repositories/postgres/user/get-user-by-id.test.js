import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/index.js'
import { PostgresGetUserByIdRepository } from './get-user-by-id.js'

describe('PostgresGetUserByIdRepository', () => {
    it('should get user by id on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgresGetUserByIdRepository()

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(user)
    })
})
