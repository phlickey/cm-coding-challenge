import { LOAD_FILES_TYPE } from "../actions/LoadFiles"
import { ERROR_TYPE, RESOLVE_ERROR_TYPE } from '../actions/Error'
import {ViewModes, CHANGE_VIEW_MODE_TYPE } from '../actions/ChangeViewMode'
const initialState = {
    numberOfFiles: 0,
    inErrorState: false,
    errorMessage: '',
    metaDataAvailable: false,
    numberOfSamples: 0,
    tripData: [],
    tripDataHeaders: [],
    tripStartTime: null,
    tripEndTime: null,
    tripDurationInMinutes: null,
    currentViewMode: ViewModes.MAP
}
export const reducer = (state=initialState, action) => {
    switch (action.type) {
        case LOAD_FILES_TYPE:
            return {
                ...state,
                metaDataAvailable: true,
                numberOfSamples: action.payload.tripData.length,
                numberOfFiles: action.payload.numberOfFiles,
                tripStartTime: action.payload.tripStartTime,
                tripEndTime: action.payload.tripEndTime,
                tripDurationInMinutes: action.payload.tripDurationInMinutes,
                tripData:  action.payload.tripData,
                tripDataHeaders: action.payload.fieldHeaders
            }
        case ERROR_TYPE:
            return {
                ...state,
                inErrorState: true,
                errorMessage: action.errorMessage
            }
        case RESOLVE_ERROR_TYPE:
            return {
                ...state,
                inErrorState: false,
                errorMessage: ''
            }
        case CHANGE_VIEW_MODE_TYPE:
            return {
                ...state,
                currentViewMode: action.targetViewMode
            }
        default:
            return {...state}
    }
}

