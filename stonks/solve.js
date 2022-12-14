import nc from "../nc.js";

const cat = new nc("nc mercury.picoctf.net 20195");

await cat.open;
console.log(await cat.readline());