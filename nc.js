import { Socket } from "net";

const nc = class PwnCat {
    constructor(host, port) {
        if (host.startsWith("nc")) {
            let _;
            [_, host, port] = host.split(' ');
        }
        this.port = port;
        this.host = host;

        const socket = new Socket().connect({ port, host })
        this.socket = new Promise((res, rej) => {
            socket.on("connect", () => res(socket))
            socket.on("close", () => rej(null));
            socket.on("timeout", () => rej(null));
            socket.on("error", () => rej(null));
        }).catch(b => b);
        this.open = new Promise(r => this.socket.then(socket => r(!!socket)));

        const on = socket.on;
        socket.on = (event, callback) => {
            on.call(socket, event, callback);
            return () => socket.off(event, callback);
        }

        this._buffer = Buffer.from([]);

        socket.on("data", (data) => {
            const l = data.length;
            const b = this._buffer.length;
            this._buffer = Buffer.concat([this._buffer, data]);
            socket.emit("delta", l);
        });
        this.pipingStdout = false;
        this.pipingStdin = false;
    }

    async kill() {
        (await this.socket)?.destroy();
    }

    async write(data, encoding="utf8") {
        if (this.pipingStdout) process.stdout.write(data);
        await new Promise(async r => (await this.socket)?.write(data, encoding, r));
    }

    async whenNBytes(cnt) {
        if (this._buffer.length >= cnt) return true;

        return new Promise(async res => {
            (await this.socket)?.once("delta", (len) => {
                if (len + this._buffer.length >= cnt) {
                    res(true);
                }
            });
        });
    }

    async read(cnt) {
        await this.whenNBytes()

        const out = this._buffer.subarray(0, cnt);
        this._buffer = this._buffer.subarray(cnt);
        return out;
    }

    async readUntil(data) {
        let l = 0;
        while (!this._buffer.includes(data)) {
            await this.whenNBytes(l += data.length);
        }
        const end = this._buffer.indexOf(data) + data.length;

        const out = this._buffer.subarray(0, end);
        this._buffer = this._buffer.subarray(end);

        return out;
    }

    async readline() {
        return (await this.readUntil("\n")).toString();
    }

    async interactive() {
        this.socket.then(socket => {
            if (socket) {
                if (!this.pipingStdin) this.toggleStdin();
                if (!this.pipingStdout) this.toggleStdout();
            }
        });

        return new Promise(() => {}); // hang
    }

    async toggleStdin() {
        if (this.pipingStdin) this.socket.then(s => {
            if (s) {
                s.unpipe(process.stdin);
                this.pipingStdin =! this.pipingStdin;
            }
        });
        else this.socket.then(s => {
            if (s) {
                s.pipe(process.stdin);
                this.pipingStdin =! this.pipingStdin;
            }
        });
    }

    async toggleStdout() {
        if (this.pipingStdout) this.socket.then(s => {
            if (s) {
                process.stdout.unpipe(s);
                this.pipingStdout =! this.pipingStdout;
            }
        });
        else this.socket.then(s => {
            if (s) {
                process.stdout.pipe(s);
                this.pipingStdout =! this.pipingStdout;
            }
        });
    }
}

export default nc;