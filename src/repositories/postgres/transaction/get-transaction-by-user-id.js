import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetTransactionByUserId {
    async execute(userId) {
        const transaction = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [userId],
        )

        return transaction[0]
    }
}
