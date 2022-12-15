const _convo = Buffer.alloc(8);

const convo = {
    raw(any,enc="ascii") {
        if (typeof any === "string" || any instanceof Uint8Array) return Buffer.from(any, enc);
        else if (typeof any === "bigint") {
            _convo.writeBigUint64LE(any);
            return Buffer.from(_convo)
        } else if (typeof any === "number" && (any % 1) === 0) {
            _convo.writeUint32LE(any);

            return Buffer.from(_convo.subarray(0, 4));
        } else if (typeof any === "number") {
            _convo.writeFloatLE(any);

            return Buffer.from(_convo.subarray(0, 4));
        } else if (Buffer.isBuffer(any)) return any;
        else if (Array.isArray(any)) return Buffer.concat(any.map(c => convo.raw(c)));
        else throw new TypeError("Unsupported type");
    },
    string(any, toNull=true) {
        const str = convo.raw(any).toString()
        return toNull ? str.slice(0, str.indexOf('\x00') === -1 ? str.length : str.indexOf('\x00')) : str;
    },
    i32(any) {
        _convo.fill(0);
        _convo.set(convo.raw(any).slice(0, 8));
        return _convo.readUint32LE();
    },
    i64(any) {
        _convo.fill(0);
        _convo.set(convo.raw(any).slice(0, 8));
        return _convo.readBigUint64LE();
    },
    f32(any) {
        _convo.fill(0);
        _convo.set(convo.raw(any).slice(0, 8));
        return _convo.readFloatLE();
    }
}

export default convo;