import { app } from '../app.js'
import request from 'supertest'
import { user } from '../tests/index.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('User Routes E2E Test', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        expect(response.status).toBe(201)
    })

    it('GET /api/users/:userId should return 200 when user is found', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).get(`/api/users/${createdUser.id}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(createdUser)
    })

    it('PATCH /api/users/:userId should return 200 when user is ipdated', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const updatedUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const response = await request(app)
            .patch(`/api/users/${createdUser.id}`)
            .send(updatedUserParams)

        expect(response.status).toBe(200)
        expect(response.body.first_name).toBe(updatedUserParams.first_name)
        expect(response.body.last_name).toBe(updatedUserParams.last_name)
        expect(response.body.email).toBe(updatedUserParams.email)
        expect(response.body.password).not.toBe(updatedUserParams.password)
    })

    it('DELETE /api/:userId should return 200 when user is deleted', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).delete(
            `/api/users/${createdUser.id}`,
        )
        expect(response.status).toBe(200)
        expect(response.body).toEqual(createdUser)
    })

    it('GET /api/user/:userId/balance should return 200 and correct balance', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        await request(app).post('/api/transactions').send({
            name: faker.commerce.productName(),
            user_id: createdUser.id,
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EARNING,
            amount: 10000,
        })

        await request(app).post('/api/transactions').send({
            name: faker.commerce.productName(),
            user_id: createdUser.id,
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EXPENSE,
            amount: 2000,
        })

        await request(app).post('/api/transactions').send({
            name: faker.commerce.productName(),
            user_id: createdUser.id,
            date: faker.date.anytime().toISOString(),
            type: TransactionType.INVESTMENT,
            amount: 2000,
        })

        const response = await request(app).get(
            `/api/users/${createdUser.id}/balance`,
        )

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            earnings: '10000',
            expenses: '2000',
            investments: '2000',
            balance: '6000',
        })
    })

    it('GET /api/users/:userId should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}`,
        )

        expect(response.status).toBe(404)
    })

    it('GET /api/users/:userId/balance should return 404 when user is not found', async () => {
        const response = await request(app).get(
            `/api/users/${faker.string.uuid()}/balance`,
        )

        expect(response.status).toBe(404)
    })

    it('PATCH /api/users/:userId should return 404 when user is not found', async () => {
        const updatedUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const response = await request(app)
            .patch(`/api/users/${faker.string.uuid()}`)
            .send(updatedUserParams)

        expect(response.status).toBe(404)
    })

    it('POST /api/users should return 400 when the provided e-mail is already in use', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                email: createdUser.email,
            })

        expect(response.status).toBe(400)
    })

    it('POST /api/user should return 400 when password is less 6 character', async () => {
        const passwordLessThanSixCharacter = '12345'
        const response = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
                password: passwordLessThanSixCharacter,
            })

        expect(response.status).toBe(400)
        expect(passwordLessThanSixCharacter.length).toBeLessThan(6)
    })
})
