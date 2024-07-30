import 'dotenv/config.js'
import express from 'express'

import { userRouter } from './src/routes/user.js'
import { transactionsRouter } from './src/routes/transaction.js'

const app = express()

app.use(express.json())

app.use('/api/users', userRouter)

app.use('/api/transactions', transactionsRouter)

app.listen(process.env.PORT, () => console.log('listening on port 8080'))
