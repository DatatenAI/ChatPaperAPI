import {publicProcedure} from "@/trpc";
import {openIdSchema} from "@/lib/wx-validation";
import prisma from "@/lib/database";

const getOpenId = publicProcedure
    .input(openIdSchema)
    .query(async ({input, ctx}) => {
        const {code} = input;
        let appid = "wx873b72762512d3bf"; //自己小程序后台管理的appid，可登录小程序后台查看
        let secret = "2a78686ce777221a0e8dfe1e0f327c79"; //小程序后台管理的secret，可登录小程序后台查看
        let grant_type = "authorization_code"; // 授权（必填）默认值
        const params = new URLSearchParams({
            grant_type,
            appid,
            secret,
            js_code: code
        });
        return  await fetch(`https://api.weixin.qq.com/sns/jscode2session?${params}`).then(res => res.json());
    });

export default getOpenId;
