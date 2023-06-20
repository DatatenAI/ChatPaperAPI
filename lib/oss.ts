import {Client} from "minio";
import {fileTypeFromBuffer} from "file-type";
import {toBuffer} from "@/lib/common";
import * as crypto from "crypto";

const ossClient = new Client({
    endPoint: process.env.OSS_ENDPOINT,
    accessKey: process.env.OSS_ACCESS_KEY,
    secretKey: process.env.OSS_ACCESS_SECRET,
    pathStyle: false
});


export const uploadRemoteFile = async (url: string, folder: string = "") => {
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());
    const fileType = await fileTypeFromBuffer(arrayBuffer);
    const prefix = folder ? `${folder}/` : "";
    const buffer = toBuffer(arrayBuffer);
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    const objectName = `${prefix}${hash}.${fileType?.ext}`;
    let existed = false;
    try {
        await ossClient.getObject(process.env.OSS_BUCKET, objectName);
        existed = true;
    } catch (e) {
        // @ts-ignore
        if (e?.code === 'NoSuchKey') {
            existed = false
        }
    }
    if (!existed) {
        await ossClient.putObject(process.env.OSS_BUCKET, objectName, buffer, {
            'Content-Type': fileType?.mime
        });
    }
    return {
        url: "https://" + process.env.OSS_ENDPOINT + "/" + objectName,
        hash
    };
}
export default ossClient;
