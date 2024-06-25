import { UserNotFoundError } from '../../errors/user'

export class GetUserBalanceUseCase {
    constructor(getUserByIdRepository, getUserBalanceRepository) {
        this.getUserByIdRepository = getUserByIdRepository
        this.getUserBalanceRepository = getUserBalanceRepository
    }

    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError('User not found')
        }

        const balance = await this.getUserBalanceRepository.execute(
            params.userId,
        )
        return balance
    }
}
