import {Client} from "minio";
import {fileTypeFromBuffer} from "file-type";
import {md5, streamToBuffer, toBuffer} from "@/lib/common";
import fs from "fs/promises";
import path from "path";

const ossClient = new Client({
    endPoint: process.env.OSS_ENDPOINT,
    accessKey: process.env.OSS_ACCESS_KEY,
    secretKey: process.env.OSS_ACCESS_SECRET,
    pathStyle: false
});


export const checkFileExist = async (folder: string, object: string) => {
    if (process.env.OSS_VOLUME_PATH) {
        return await fs.access(path.resolve(process.env.OSS_VOLUME_PATH, folder, object)).then(() => true).catch(() => false);
    } else {
        try {
            await ossClient.getObject(process.env.OSS_BUCKET, folder + "/" + object);
            return true;
        } catch (e) {
            // @ts-ignore
            if (e?.code === 'NoSuchKey') {
                return false;
            }
            throw e;
        }
    }
}
export const uploadRemoteFile = async (url: string, folder: string = "") => {
    const arrayBuffer = await fetch(url).then(res => res.arrayBuffer());
    const fileType = await fileTypeFromBuffer(arrayBuffer);
    const prefix = folder ? `${folder}/` : "";
    const buffer = toBuffer(arrayBuffer);
    const hash = md5(buffer);
    const objectName = `${prefix}${hash}.${fileType?.ext}`;
    let existed = await checkFileExist(folder, objectName);
    if (!existed) {
        if (process.env.OSS_VOLUME_PATH) {
            if (!await checkFileExist(folder, "")) {
                await fs.mkdir(folder, {recursive: true})
            }
            await fs.writeFile(path.resolve(process.env.OSS_VOLUME_PATH, objectName), buffer);
        } else {
            await ossClient.putObject(process.env.OSS_BUCKET, objectName, buffer, {
                'Content-Type': fileType?.mime
            });
        }
    }
    return {
        originUrl: url,
        url: "https://" + process.env.OSS_ENDPOINT + "/" + objectName,
        hash,
        mime: fileType?.mime
    };
}

export const readFile = async (folder: string, object: string) => {
    if (process.env.OSS_VOLUME_PATH) {
        return fs.readFile(path.resolve(process.env.OSS_VOLUME_PATH, folder, object))
    } else {
        return streamToBuffer(await ossClient.getObject(process.env.OSS_BUCKET, folder + "/" + object));
    }
}
export default ossClient;
