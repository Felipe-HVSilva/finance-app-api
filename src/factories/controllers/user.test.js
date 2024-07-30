import { CreateUserController, GetUserByIdController } from '../../controllers'
import { makeCreateUserController, makeGetUserByIdController } from './user.js'

describe('User Controller Factory', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
