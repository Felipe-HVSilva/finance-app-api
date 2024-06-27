import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z
        .string({
            required_error: 'Fist name is required',
        })
        .trim()
        .min(1, {
            message: 'First name is required',
        }),
    last_name: z
        .string({
            required_error: 'Last name is required',
        })
        .trim()
        .min(1, {
            message: 'Last name is required',
        }),
    email: z
        .string({
            required_error: 'E-mail is required',
        })
        .email({ message: 'Please provide a valid e-mail' })
        .trim()
        .min(1, {
            message: 'E-mail is required',
        }),
    password: z
        .string({
            required_error: 'Password is required',
        })
        .trim()
        .min(6, {
            message: 'Password must have at least 6 characters',
        }),
})

export const updatedUserSchema = createUserSchema.partial().strict({
    message: 'Some provide field not allowed',
})
