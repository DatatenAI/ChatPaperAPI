const {Client} = require("minio");
const ossClient = new Client({
    endPoint: 'oss-cn-hongkong.aliyuncs.com',
    accessKey: 'LTAI5t7TzzA89UBqA4yiyzU5',
    secretKey: 'BzozLbH17b1YTPZF4WY5cHwest07vd',
    pathStyle: false
});

(async function () {
    let object = await ossClient.getObject("chatwithpaper", 'uploads/123.txt').catch(err => {
        console.log(err.code === 'NoSuchKey');
    });
}());