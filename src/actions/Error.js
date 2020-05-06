export const ERROR_TYPE = 'ERROR'
export const RESOLVE_ERROR_TYPE = 'RESOLVE_ERROR'


export const errorActionCreator = errorMessage => ({
    type: ERROR_TYPE,
    errorMessage,
})


export const resolveErrorActionCreator = () => ({type: RESOLVE_ERROR_TYPE})