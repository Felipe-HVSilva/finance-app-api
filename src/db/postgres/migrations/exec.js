import 'dotenv/config.js'

import fs from 'fs'
import { pool } from '../helper.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const execMigrations = async () => {
    const client = await pool.connect()
    try {
        const filePath = path.join(__dirname, '01-init.sql')
        const script = fs.readFileSync(filePath, 'utf-8')

        await client.query(script)
    } catch (err) {
        console.error(err)
    } finally {
        await client.release()
    }
}

execMigrations()
