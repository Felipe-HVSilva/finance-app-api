import express from 'express'
import { userRouter } from './routes/user.js'
import { transactionsRouter } from './routes/transaction.js'

export const app = express()

app.use(express.json())

app.use('/api/users', userRouter)

app.use('/api/transactions', transactionsRouter)
