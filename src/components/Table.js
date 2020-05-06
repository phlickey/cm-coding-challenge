import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { ViewModes } from '../actions/ChangeViewMode';
import  styled from 'styled-components'
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
const FilterModes = {
    ASC: "ASC",
    DESC: "DESC"
}


const StyledTable = styled.table`
    display: block;
    height: 100%;
    width: 100vw;
    tbody, thead{
        width: 100vw;
    }
    * {
        margin: 0;
        padding: 0px;
        box-sizing: border-box;
    }
    thead th {
        padding: 0 15px;
    }
    tbody>tr:nth-child(even){
        background-color: rgba(0,0,0,0.2)
    }
`

const StyledTableContainer = styled.section`
    width: 100vw;
    height: 100%;
    overflow: scroll;
`
export const Table = ({displayTable, headings, tripDataPoints}) => {
    const [sortedData, updateSortedData] = useState([])
    
    const [filterDirs, updateFilterDirs] = useState({})
    useEffect(()=>{
        const dataPoints = tripDataPoints.map(point=>Object.values(point))
        const filterDirectionSeed = headings.reduce((map, currentHeading)=>{
            return {
                ...map,
                [currentHeading]: FilterModes.ASC
            }
        },{})
        updateFilterDirs(filterDirectionSeed)
        updateSortedData(dataPoints)
    }, [headings, tripDataPoints])
    const sortBy = heading => {
        updateFilterDirs({
            ...filterDirs,
            [heading]: filterDirs[heading] === FilterModes.ASC ? FilterModes.DESC : FilterModes.ASC
        })
        const sorted = tripDataPoints.sort((pointA,pointB)=>{
            let a
            let b
            if (filterDirs[heading] === FilterModes.DESC) {
                a = pointA
                b = pointB
            } else {
                a = pointB
                b = pointA
            }
            if (typeof(a[heading])==='string'){
                console.log(a[heading].charCodeAt(0))
                return a[heading].charCodeAt(0) - b[heading].charCodeAt(0)
            } else {
                return a[heading] - b[heading]
            }
        }).map(point=>Object.values(point)) // todo: fix this, it assumes that object.values will return data in the correct order
        
        updateSortedData(sorted)
    }
    return displayTable?(
        <StyledTableContainer>
        <StyledTable>
            <thead>
            <tr>
                {headings.map((heading, idx)=>{
                    return (
                        <th key={`heading-${idx}`} onClick={()=>sortBy(heading)}>
                            {heading} {(()=>{
                                if (filterDirs[heading] === FilterModes.DESC){
                                    return (<FiChevronDown/>)
                                } else {
                                    return (<FiChevronUp/>)
                                }
                            })()}
                        </th>
                    )
                })}
                
            </tr>
            </thead>
            <tbody>
            {
                sortedData.map((dataPoint, i)=>{
                    return (
                        <tr key={`row-${i}`} >
                            {dataPoint.map((val, j)=>(
                                <td key={`cell-${j}${i}`}>
                                    { (()=>{
                                        switch (typeof val){
                                            case 'number':
                                                if (parseInt(val.toString()) === val) return val.toString()
                                                return val.toPrecision(6).toString()
                                            case 'string':
                                                return val
                                            case 'object':
                                                if (val.toLocaleDateString) return `${val.toLocaleTimeString()}  ${val.toLocaleDateString()}`
                                                return JSON.stringify(val)
                                            default:
                                                return JSON.stringify({type: typeof val, val})
                                        }
                                    })()}
                                </td>))}
                        </tr>
                    )
                })
            }
            </tbody>
        </StyledTable>
        </StyledTableContainer>
    ): null
}

const mapStateToProps = state => ({
    displayTable: !state.inErrorState && state.metaDataAvailable && state.currentViewMode === ViewModes.TABLE,
    headings: state.tripDataHeaders,
    tripDataPoints: state.tripData
})

export const ConnectedTable = connect(mapStateToProps)(Table)