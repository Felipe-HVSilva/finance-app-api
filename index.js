import 'dotenv/config.js'
import express from 'express'

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionByUserIdController,
    makeUpdateTransactionController,
} from './src/factories/controllers/transaction.js'
import { userRouter } from './src/routes/user.js'

const app = express()

app.use(express.json())

app.use('/api/users', userRouter)

app.get('/api/transactions', async (request, response) => {
    const getTransactionByUserIdController =
        makeGetTransactionByUserIdController()

    const { statusCode, body } =
        await getTransactionByUserIdController.execute(request)

    response.status(statusCode).json(body)
})

app.post('/api/transactions', async (request, response) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } =
        await createTransactionController.execute(request)

    response.status(statusCode).json(body)
})

app.patch('/api/transactions/:transactionId', async (request, response) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } =
        await updateTransactionController.execute(request)

    return response.status(statusCode).json(body)
})

app.delete('/api/transactions/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController()

    const { statusCode, body } =
        await deleteTransactionController.execute(request)

    return response.status(statusCode).json(body)
})

app.listen(process.env.PORT, () => console.log('listening on port 8080'))
