export const transactionNotFoundResponse = () => ({
    statusCode: 404,
    body: {
        message: 'Transaction not found',
    },
})
