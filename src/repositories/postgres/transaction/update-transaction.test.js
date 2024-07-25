import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { TransactionType } from '@prisma/client'

describe('PostgresUpdateTransactionRepository', () => {
    it('should update a transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const params = {
            id: faker.string.uuid(),
            user_id: user.id,
            name: faker.commerce.product(),
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EXPENSE,
            amount: Number(faker.finance.amount()),
        }

        const result = await sut.execute(transaction.id, params)

        expect(result.id).toBe(params.id)
    })
})
