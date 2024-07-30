import request from 'supertest'
import { app } from '../app.js'
import { transaction, user } from '../tests/index.js'

describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transactions should return 201 when creating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        const response = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        expect(response.status).toBe(201)
        expect(response.body.user_id).toBe(createdUser.id)
        expect(response.body.type).toBe(transaction.type)
    })

    it('GET /api/transactions?userId should return 200 when fetching a transaction', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })

        const response = await request(app).get(
            `/api/transactions?userId=${createdUser.id}`,
        )

        expect(response.status).toBe(200)
        expect(response.body[0].id).toBe(createdTransaction.id)
    })

    it('PATCH /api/transactions/:transactionId should return 200 when updating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({ ...user, id: undefined })

        const { body: createdTransaction } = await request(app)
            .post('/api/transactions')
            .send({
                ...transaction,
                user_id: createdUser.id,
                id: undefined,
            })
        const response = await request(app)
            .patch(`/api/transactions/${createdTransaction.id}`)
            .send({ amount: 100 })

        expect(response.status).toBe(200)
        expect(response.body.amount).toBe('100')
    })
})
