const fs = require('fs/promises');
const path = require("path");
(async function (){
    console.log(await fs.access(path.resolve("ui","")))
})()