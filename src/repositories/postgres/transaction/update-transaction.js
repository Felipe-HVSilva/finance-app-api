import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

export class PostgresUpdateTransactionRepository {
    async execute(transactionId, updateTransactionParams) {
        try {
            return await prisma.transaction.update({
                where: {
                    id: transactionId,
                },
                data: updateTransactionParams,
            })
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }

            throw err
        }
    }
}
