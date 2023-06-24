const pdfjsLib = require('pdfjs-dist');
const crypto = require("crypto");

const toBuffer = (arrayBuffer) => {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}


(async function () {
    const start = Date.now()

   const res = await fetch("http://www.biorxiv.org/content/10.1101/2022.07.22.501196v2.full.pdf")
    await res.arrayBuffer()
    console.log(Date.now() - start);
}())
