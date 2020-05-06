import React from 'react'
import { connect } from "react-redux"
import styled from 'styled-components'
const MetaDataContainer = styled.section`
    grid-area: meta;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    *{
        margin: 15px
    }
`


export const MetaData = ({numberOfSamples, numberOfFiles, tripStartTime, tripEndTime, tripDurationInMinutes, showMetaData}) => {
    return showMetaData?(<MetaDataContainer>
<p> Loaded {numberOfSamples} data samples from {numberOfFiles} {numberOfFiles>1?'files':'file'}.</p>
        <p>Trip Started at {tripStartTime?tripStartTime.toLocaleTimeString():null}</p>
        <p>Trip Ended at {tripStartTime?tripEndTime.toLocaleTimeString():null}</p>
        <p>Trip took {tripDurationInMinutes} minutes</p>
    </MetaDataContainer>):null
}

const mapStateToProps = state => {
    return {
        numberOfSamples: state.numberOfSamples,
        showMetaData: state.metaDataAvailable && !state.inErrorState,
        numberOfFiles: state.numberOfFiles,
        tripStartTime: state.tripStartTime,
        tripEndTime: state.tripEndTime,
        tripDurationInMinutes: state.tripDurationInMinutes
    }
}

export const ConnectedMetaData = connect(mapStateToProps)(MetaData)