import { app } from '../app.js'
import request from 'supertest'
import { user } from '../tests/index.js'
import { faker } from '@faker-js/faker'

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
})
