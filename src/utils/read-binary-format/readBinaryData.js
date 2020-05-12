import jDataView from 'jdataview'
import jBinary from 'jbinary'

import {
    PossibleEndiannessValues,
    readAsciiHeaders,
} from './readAsciiHeaderInfo'
import { getjBinaryDataTypeFromPrecision } from './getjBinaryDataTypeFromPrecision'

const readBinaryData = (file) => {
    const asciiHeaders = readAsciiHeaders(file)
    const endianness =
        asciiHeaders.endianness === PossibleEndiannessValues.LITTLE_ENDIAN
    const data = new jDataView(asciiHeaders.remainingData)
    let typeSet = {
        dataBoundry: ['char'],
        numberOfDataPoints: ['uint64', endianness],
    }
    for (let i = 0; i < asciiHeaders.fieldHeaders.length; i++) {
        let fieldPrecision = asciiHeaders.fieldPrecisions[i]
        typeSet[asciiHeaders.fieldHeaders[i]] = getjBinaryDataTypeFromPrecision(
            {
                fieldPrecision,
                endianness,
            }
        )
    }

    const bin = new jBinary(data, typeSet)
    // Reported number of samples is often wrong.
    // get better results by just reading from the binary buffer
    // until all data is read.
    // below call to read() updates the buffer offset.
    const numberOfDataPoints = bin.read('numberOfDataPoints')

    const trip = []

    do {
        try {
            let boundry = bin.read('char')
            if (boundry !== '#')
                throw new Error(
                    'expected sample delinator at beginning of new sample'
                )
            let dataPoint = {}
            for (let fieldHeader of asciiHeaders.fieldHeaders) {
                try {
                    dataPoint[fieldHeader] = bin.read(fieldHeader)
                } catch (e) {}
            }
            trip.push(dataPoint)
        } catch (e) {
            if (e.message === 'Offsets are out of bounds.') {
                break // out of bounds, need to break out of the loop
            }

            if (
                e.message ===
                'expected sample delinator at beginning of new sample'
            )
                continue // try to resync by polling each byte until the boundry char is found
        }
    } while (bin.view.byteOffset <= bin.view.byteLength)
    return {
        ...asciiHeaders,
        countSamples: trip.length,
        trip,
        remainingData: '',
    }
}

export { readBinaryData }
