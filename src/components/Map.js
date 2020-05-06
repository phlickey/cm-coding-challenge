import React, {useEffect, useRef, useState} from 'react'
import {connect} from 'react-redux'

import mapboxgl from 'mapbox-gl';
import {MAPBOX_ACCESS_TOKEN} from '../consts'
import { ViewModes } from '../actions/ChangeViewMode';
import { lineString } from '@turf/helpers'
import styled from 'styled-components';
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const MapContainer = styled.div`
    display: block;
    width: 100%;
    height: 100%;
`
export const Map = ({displayMap, trip}) => {
    // todo: could probably filter out bum data if the distance between
    // two adjacent points doesn't square with the GPSSPEED param
    const coords = trip
                    .filter(point=>point.GPSSTATUS>0)
                    .filter(point=>(point.LAT!==0&&point.LNG!==0)) // zero seems suspicious
                    .map((point)=>[point.LNG * (point.LNGDIR==="E"?1:-1), point.LAT * (point.LATDIR==="N"?1:-1)])
    const mapRef = useRef()
    useEffect(()=>{
        if (typeof mapRef.current !== 'undefined' && displayMap) {
            mapRef.current.innerHTML = ''
            const bounds = new mapboxgl.LngLatBounds();
            for (let coord of coords){
                bounds.extend(coord)
            }
            const map = new mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/mapbox/light-v9',
                zoom: 12,
                center: bounds.getCenter()
            });
            const routeLineString = lineString(coords)
            map.on('load', ()=>{
                map.fitBounds(bounds);
                map.addLayer({
                    "id": "route",
                    "type": "line",
                    "source": {
                        "type": "geojson",
                        "data": routeLineString
                    },
                });
            })
        }
    })
    return (
        <MapContainer style={{display:displayMap?'block':'none'}} ref={mapRef}></MapContainer>
    )
}

const mapStateToProps = state => ({
    displayMap: !state.inErrorState && state.metaDataAvailable && state.currentViewMode === ViewModes.MAP,
    trip: state.tripData
})
const mapDispatchToProps = dispatch => ({})
export const ConnectedMap = connect(mapStateToProps, mapDispatchToProps)(Map)