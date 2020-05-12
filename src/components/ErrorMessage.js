import React from 'react'
import { connect } from 'react-redux'

export const ErrorMessage = ({ showError, errorMessage }) => {
    return showError ? (
        <>
            <p>Encountered the following error: </p>
            <pre>{errorMessage}</pre>
        </>
    ) : null
}

const mapStateToProps = (state) => ({
    showError: state.inErrorState,
    errorMessage: state.errorMessage,
})

export const ConnectedErrorMessage = connect(mapStateToProps)(ErrorMessage)
