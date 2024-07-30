import { app } from '../..'
import request from 'supertest'
import { user } from '../tests/index.js'

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
})
