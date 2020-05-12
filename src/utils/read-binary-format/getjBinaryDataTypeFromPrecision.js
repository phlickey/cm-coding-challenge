export const getjBinaryDataTypeFromPrecision = ({
    fieldPrecision,
    endianness,
}) => {
    // TODO: could dynamically detect precisions and do better work on bitfield stuff
    // Currently this will throw if it receives a precision value it doesn't know about
    // Could infer data types by taking the first character as type and second as byte length.
    switch (fieldPrecision) {
        case 'U1':
            return ['uint8', endianness]
        case 'U8':
            return ['uint64', endianness]
        case 'I2':
            return ['int16', endianness]
        case 'F4':
            return ['float32', endianness]
        case 'F8':
            return ['float64', endianness]
        case 'C1':
            return ['char']
        case 'B8':
            return ['bitfield', 8]
        default:
            throw new Error('Unrecognised precision type. ')
    }
}
