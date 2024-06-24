import { badRequest } from '../../controllers/helpers/index.js'

export class GetTransactionByUserIdUseCase {
    constructor(getTransactionByUserIdRepository, getUserByIdRepository) {
        this.getTransactionByUserIdRepository = getTransactionByUserIdRepository
        this.getUserByIdRepository = getUserByIdRepository
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            return badRequest({
                message: 'User not found',
            })
        }

        const transaction = await this.getTransactionByUserIdRepository.execute(
            params.userId,
        )

        return transaction
    }
}
