import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests/index.js'
import { PostgresGetTransactionByUserId } from './get-transaction-by-user-id.js'

describe('PostgresGetTransactionByUserIdRepository', () => {
    it('should get transaction by user id on db', async () => {
        const sut = new PostgresGetTransactionByUserId()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })

        const result = await sut.execute(user.id)

        expect(result.length).toBe(1)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].user_id).toBe(user.id)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        )
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionByUserId()
        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
            },
        })
    })
})
