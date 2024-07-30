import { GetUserByIdController } from '../../controllers'
import { makeGetUserByIdController } from './user.js'

describe('User Controller Factory', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })
})
