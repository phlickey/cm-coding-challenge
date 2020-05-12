import React from 'react'
import { connect } from 'react-redux'
import {
    ChangeViewModeActionCreator,
    ViewModes,
} from '../actions/ChangeViewMode'

export const ViewSwitch = ({
    showButton,
    currentViewMode,
    dispatchChangeViewMode,
}) => {
    const targetViewMode =
        currentViewMode === ViewModes.MAP ? ViewModes.TABLE : ViewModes.MAP
    return showButton ? (
        <button onClick={() => dispatchChangeViewMode(targetViewMode)}>
            View as {currentViewMode === ViewModes.MAP ? 'Table' : 'Map'}
        </button>
    ) : null
}

const mapStateToProps = (state) => ({
    currentViewMode: state.currentViewMode,
    showButton: state.metaDataAvailable && !state.inErrorState,
})

const mapDispatchToProps = (dispatch, state) => ({
    dispatchChangeViewMode: (targetViewMode) =>
        dispatch(ChangeViewModeActionCreator(targetViewMode)),
})

export const ConnectedViewSwitch = connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewSwitch)
