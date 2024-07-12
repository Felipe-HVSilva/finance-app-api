import validator from 'validator'
import { z } from 'zod'

export const createTransactionSchema = z.object({
    user_id: z
        .string({
            required_error: 'User ID is required',
        })
        .uuid({
            message: 'User id must be a valid UUID',
        }),
    name: z
        .string({
            required_error: 'Name is required',
        })
        .trim()
        .min(1, {
            message: 'Nmae is required',
        }),
    date: z
        .string({
            required_error: 'Date is required',
        })
        .datetime({
            message: 'Date must be a valid date.',
        }),
    type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
        errorMap: () => ({
            message: 'Type must e EXPENSE, EARNING or INVESTMENT',
        }),
    }),
    amount: z
        .number({
            required_error: 'Amount is required',
            invalid_type_error: 'Amount must be a number',
        })
        .min(1, {
            message: 'amount must be greater than 0.',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})

export const updateTransactionSchema = createTransactionSchema
    .omit({
        user_id: true,
    })
    .partial()
    .strict({ message: 'Some provided field is not allowed' })
