import {publicProcedure} from "@/trpc";
import {openIdSchema} from "@/lib/wx-validation";
import jwt from 'jsonwebtoken';
import {randomBytes} from "crypto";


// 生成Token函数
const generateToken = (openid) => {
    const secretKey = process.env.WX_AUTH_SECRETKEY
    const payload = {
        openid: openid,
    };
    return jwt.sign(payload, secretKey);
};


const getOpenId = publicProcedure
    .input(openIdSchema)
    .query(async ({input, ctx}) => {
        const {code} = input;
        let appid = process.env.WX_APPID; //自己小程序后台管理的appid，可登录小程序后台查看
        let secret = process.env.WX_SECRETKEY; //小程序后台管理的secret，可登录小程序后台查看
        let grant_type = "authorization_code"; // 授权（必填）默认值
        const params = new URLSearchParams({
            grant_type,
            appid,
            secret,
            js_code: code
        });
        const data = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${params}`).then(res => res.json());
        data.token = generateToken(data.openid);
        // 将Token返回给前端
        return data
    });

export default getOpenId;
