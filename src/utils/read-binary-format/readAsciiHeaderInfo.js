const PossibleEndiannessValues = {
    BIG_ENDIAN: 'BIG_ENDIAN',
    LITTLE_ENDIAN: 'LITTLE_ENDIAN',
}

function readAsciiHeaders(file) {
    const FileFields = {
        FILE_TYPE_IDENTIFIER: 'FILE_TYPE_IDENTIFIER',
        FILE_VERSION: 'FILE_VERSION',
        FILE_ENDIANNESS: 'FILE_ENDIANNESS',
        FILE_HEADERS: 'FILE_HEADERS',
        FILE_DATA: 'FILE_DATA',
        FILE_PRECISIONS: 'FILE_PRECISIONS',
        DONE: 'DONE',
    }
    const isAsciiNewLine = (byte) => String.fromCharCode(byte) === '\n'
    const isAsciiComma = (byte) => String.fromCharCode(byte) === ','
    const isAsciiColon = (byte) => String.fromCharCode(byte) === ':'

    const parseItentifierByte = (fileMapping, currentByte) => {
        if (!isAsciiNewLine(currentByte)) {
            return {
                ...fileMapping,
                typeIdentifier:
                    fileMapping.typeIdentifier +
                    String.fromCharCode(currentByte),
            }
        } else {
            if (fileMapping.typeIdentifier !== 'PVCAM_TRACK_DATA')
                throw new Error('Error: expected file type PVCAM_TRACK_DATA')
            return {
                ...fileMapping,
                currentlyParsing: FileFields.FILE_VERSION,
            }
        }
    }

    const parseVersionByte = (fileMapping, currentByte) => {
        if (!isAsciiNewLine(currentByte)) {
            return {
                ...fileMapping,
                version: fileMapping.version + String.fromCharCode(currentByte),
            }
        } else {
            return {
                ...fileMapping,
                currentlyParsing: FileFields.FILE_ENDIANNESS,
            }
        }
    }

    const parseEndiannessByte = (fileMapping, currentByte) => {
        if (!isAsciiNewLine(currentByte)) {
            return {
                ...fileMapping,
                endianness:
                    fileMapping.endianness + String.fromCharCode(currentByte),
            }
        } else {
            if (fileMapping.endianness === 'LE') {
                fileMapping.endianness = PossibleEndiannessValues.LITTLE_ENDIAN
            } else if (fileMapping.endianness === 'BE') {
                fileMapping.endianness = PossibleEndiannessValues.BIG_ENDIAN
            } else {
                throw new Error(
                    `CORRUPTED FILE FORMAT. Expected to find file endianness represented as either BE or LE. Instead found ${fileMapping.endianness}`
                )
            }
            return {
                ...fileMapping,
                currentlyParsing: FileFields.FILE_HEADERS,
            }
        }
    }

    const parseHeadersByte = (fileMapping, currentByte) => {
        if (isAsciiComma(currentByte) || isAsciiNewLine(currentByte)) {
            return {
                ...fileMapping,
                fieldHeaders: [
                    ...fileMapping.fieldHeaders,
                    fileMapping.currentFieldHeader,
                ],
                currentFieldHeader: '',
                currentlyParsing: isAsciiNewLine(currentByte)
                    ? FileFields.FILE_PRECISIONS
                    : FileFields.FILE_HEADERS,
            }
        } else if (isAsciiColon(currentByte)) {
            if (fileMapping.currentFieldHeader !== 'FIELDS')
                throw new Error('Error. Expected datapoint field headers')
            return {
                ...fileMapping,
                currentFieldHeader: '',
            }
        } else {
            return {
                ...fileMapping,
                currentFieldHeader:
                    fileMapping.currentFieldHeader +
                    String.fromCharCode(currentByte),
            }
        }
    }

    const parseFilePrecisionsByte = (fileMapping, currentByte, index) => {
        if (isAsciiComma(currentByte) || isAsciiNewLine(currentByte)) {
            return {
                ...fileMapping,
                fieldPrecisions: [
                    ...fileMapping.fieldPrecisions,
                    fileMapping.currentFieldPrecision,
                ],
                currentFieldPrecision: '',
                dataBeginsIndex: index + 1,
                currentlyParsing:
                    String.fromCharCode(currentByte) === '\n'
                        ? FileFields.FILE_DATA
                        : FileFields.FILE_PRECISIONS,
            }
        } else if (isAsciiColon(currentByte)) {
            if (fileMapping.currentFieldPrecision !== 'PRECISION')
                throw new Error(
                    'Error. Expected field header precision values.'
                )
            return {
                ...fileMapping,
                currentFieldPrecision: '',
            }
        } else {
            return {
                ...fileMapping,
                currentFieldPrecision:
                    fileMapping.currentFieldPrecision +
                    String.fromCharCode(currentByte),
            }
        }
    }
    let first = true
    const {
        typeIdentifier,
        endianness,
        fieldHeaders,
        fieldPrecisions,
        remainingData,
        dataBeginsIndex,
    } = Array.from(file).reduce(
        (fileMapping, currentByte, idx) => {
            switch (fileMapping.currentlyParsing) {
                case FileFields.FILE_TYPE_IDENTIFIER:
                    return parseItentifierByte(fileMapping, currentByte)
                case FileFields.FILE_VERSION:
                    return parseVersionByte(fileMapping, currentByte)
                case FileFields.FILE_ENDIANNESS:
                    return parseEndiannessByte(fileMapping, currentByte)
                case FileFields.FILE_HEADERS:
                    return parseHeadersByte(fileMapping, currentByte)
                case FileFields.FILE_PRECISIONS:
                    return parseFilePrecisionsByte(
                        fileMapping,
                        currentByte,
                        idx
                    )
                default:
                    let newFileMapping = { ...fileMapping }
                    // creating a new object and using array methods is way cheaper than using the spread opperator to create a new array
                    // O(n) vs O(n^2) i think
                    newFileMapping.remainingData.push(currentByte)
                    return { ...newFileMapping }
            }
        },
        {
            currentlyParsing: FileFields.FILE_TYPE_IDENTIFIER,
            typeIdentifier: '',
            version: '',
            endianness: '',
            fieldHeaders: [],
            currentFieldHeader: '',
            currentFieldPrecision: '',
            dataBeginsIndex: 0,
            fieldPrecisions: [],
            remainingData: [],
        }
    )

    return {
        typeIdentifier,
        endianness,
        fieldHeaders,
        fieldPrecisions,
        dataBeginsIndex,
        remainingData,
    }
}

export { PossibleEndiannessValues, readAsciiHeaders }
