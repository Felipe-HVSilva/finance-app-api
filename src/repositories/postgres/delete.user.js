import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        const result = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )

        return result[0]
    }
}
