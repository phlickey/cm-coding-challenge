const TIME_HEADER = 'UTCTIME'
const getStartTime = sortedTrip => {
    return new Date(sortedTrip[0][TIME_HEADER])
}

const getEndTime = sortedTrip => {
    return new Date(sortedTrip[sortedTrip.length-1][TIME_HEADER])
}

const getTripDurationInMinutes  = sortedTrip => {
    console.log(sortedTrip)
    return Math.round((sortedTrip[sortedTrip.length-1][TIME_HEADER] - sortedTrip[0][TIME_HEADER]) / (1000*60))
}


const sortTripByTime = trip => {
    return trip.sort((a,b)=>a[TIME_HEADER]-b[TIME_HEADER])
}


export const getTripTimeInfo = trip => {
    const sorted = sortTripByTime(trip)
    return {
        tripStartTime: getStartTime(sorted),
        tripEndTime: getEndTime(sorted),
        tripDurationInMinutes: getTripDurationInMinutes(sorted)
    }
}


export const parseDateFields = trip => {
    return trip.map(point=>{
        return {
            ...point,
            [TIME_HEADER]: new Date(point[TIME_HEADER]),
            GPSTIME: new Date(point.GPSTIME)

        }
    })
}