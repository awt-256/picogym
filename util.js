import chalk from "chalk";
import { format } from "util";

export const shell = async (nc) => {
    const socket = await nc.socket;
    if (!socket) return;
    if (!nc.pipingStdin) nc.toggleStdin();
    if (!nc.pipingStdout) nc.toggleStdout();
    process.stdout.write(chalk.red.bold("$") + chalk.reset(" "))
    while (true) {
        const socket = await nc.socket;
        if (!socket) return;
        const data = await new Promise(res => socket.once("data", data => res(data)));
        if (data.toString().endsWith("\n")) process.stdout.write(chalk.red.bold("$") + chalk.reset(" "));
    }
}

export const hex = (num) => "0x" + num.toString(16);

export const printf = (string, ...va) => {
    let idx = 0;
    let out = string.replace(/%(.)/g, (_, i) => {
        switch (i) {
            case "%": return "%";
            case "c": return String.fromCharCode(va[idx++]);
            case "d": return va[idx++].toString();
            case "f": return va[idx++].toString();
            case "s": return va[idx++].toString();
            case "o": return format("%o", va[idx++]);
            case "x": return va[idx++].toString(16);
            case "p": return "0x" + va[idx++].toString(16);
        }
    });
    process.stdout.write(colorizeLog(out));
    return out;
}

export const colorizeLog = text => {
    text = chalk.reset("") + (text+"").split("[+]").reduce((a, b) => a + chalk.magenta("[+]") + chalk.reset(b));
    text = chalk.reset("") + (text+"").split("[!]").reduce((a, b) => a + chalk.red("[!]") + chalk.reset(b));
    return text;
}

const log = console.log.bind(console);
console.log = (c, ...a) => log(colorizeLog(c), ...a);
