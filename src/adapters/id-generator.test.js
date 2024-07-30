import validator from 'validator'
import { IdGeneratorAdapter } from './id-generator'

describe('IdGeneratorAdapter', () => {
    it('should retrn a random id', async () => {
        const sut = new IdGeneratorAdapter()

        const result = await sut.execute()

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(validator.isUUID(result)).toBe(true)
    })
})
