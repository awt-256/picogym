import nc from "../nc.js";
import "../util.js";

const cat = new nc("nc saturn.picoctf.net 53865");

await cat.open;

for (let i = 0; i < 5; ++i) {
    await cat.write("1\n");
    await cat.write("paper\n");
}

console.log("[+] if you see no flag in the next 2s, run again");
await cat.readUntil("picoCTF");
const flag = "picoCTF" + await cat.readUntil("}");

console.log("[!] " + flag.trim());

await cat.kill();