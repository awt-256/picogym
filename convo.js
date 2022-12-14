const _convo = Buffer.alloc(8);

const convo = {
    raw(any) {
        if (typeof any === "string" || any instanceof Uint8Array) return Buffer.from(any);
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
        else if (Array.isArray(any)) return Buffer.concat(any.map(c => convo.toBuffer(c)));
        else throw new TypeError("Unsupported type");
    },
    string(any) {
        return convo.raw(any).toString();
    },
    i32(any) {
        return convo.raw(any).readUint32LE();
    },
    i64(any) {
        return convo.raw(any).readBigUint64LE();
    },
    f32(any) {
        return convo.raw(any).readFloatLE();
    }
}

export default convo;