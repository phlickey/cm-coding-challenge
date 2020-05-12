import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { readBinaryData } from '../utils/read-binary-format/readBinaryData'
import {
    getTripTimeInfo,
    parseDateFields,
} from '../utils/parse-trips/parseTripData'
import { connect } from 'react-redux'
import { errorActionCreator, resolveErrorActionCreator } from '../actions/Error'
import { getLoadFilesAction } from '../actions/LoadFiles'
import styled from 'styled-components'

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #fff;
    background-color: rgba(255, 255, 255, 0.2);
`

export const FileInput = ({
    dispatchError,
    dispatchResolveError,
    dispatchFilesLoaded,
    isErrorState,
}) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            let parsedDataFiles = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const buff = await file.arrayBuffer()
                    const arr = new Uint8Array(buff)
                    return readBinaryData(arr)
                })
            )

            // todo: could check a little more closely that all files have the same headers
            const fieldHeaders = parsedDataFiles[0].fieldHeaders
            const totalTripData = parsedDataFiles.reduce((acc, cur) => {
                console.log({ cur })
                let { trip } = cur
                return [...acc, ...parseDateFields(trip)]
            }, [])

            const timeData = getTripTimeInfo(totalTripData)
            dispatchResolveError()
            dispatchFilesLoaded({
                ...timeData,
                fieldHeaders,
                tripData: totalTripData,
                numberOfFiles: acceptedFiles.length,
            })
        } catch (e) {
            dispatchError(e.message)
        }
    }, [dispatchError, dispatchFilesLoaded, dispatchResolveError])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    })

    return (
        <StyledContainer {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here ...</p>
            ) : (
                <p>
                    Drop one or more .bin trip files here, or click to choose...
                </p>
            )}
        </StyledContainer>
    )
}

const mapStateToProps = (state) => ({
    isErrorState: state.isErrorState,
})

const mapDispatchToProps = (dispatch) => ({
    dispatchError: (errorMessage) => dispatch(errorActionCreator(errorMessage)),
    dispatchFilesLoaded: ({
        numberOfFiles,
        tripStartTime,
        tripEndTime,
        tripDurationInMinutes,
        tripData,
        fieldHeaders,
    }) =>
        dispatch(
            getLoadFilesAction({
                numberOfFiles,
                tripStartTime,
                tripEndTime,
                tripDurationInMinutes,
                tripData,
                fieldHeaders,
            })
        ),
    dispatchResolveError: () => dispatch(resolveErrorActionCreator()),
})

export const ConnectedFileInput = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileInput)
