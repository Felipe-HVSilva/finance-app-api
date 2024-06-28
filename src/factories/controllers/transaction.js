import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionByUserIdController,
    UpdateTransactionController,
} from '../../controllers/index.js'

import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionByUserId,
    PostgresUpdateTransactionRepository,
    PostgresDeleteTransactionRepository,
} from '../../repositories/postgres/index.js'

import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionByUserIdUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js'

export const makeCreateTransactionController = () => {
    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        getUserByIdRepository,
        createTransactionRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeGetTransactionByUserIdController = () => {
    const getTransactionByIdRepository = new PostgresGetTransactionByUserId()

    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getTransactionByUserIdUseCase = new GetTransactionByUserIdUseCase(
        getTransactionByIdRepository,
        getUserByIdRepository,
    )

    const getTransactionByUserIdController =
        new GetTransactionByUserIdController(getTransactionByUserIdUseCase)

    return getTransactionByUserIdController
}

export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
    )

    const updatedTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    return updatedTransactionController
}

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()

    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
    )

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    )

    return deleteTransactionController
}
