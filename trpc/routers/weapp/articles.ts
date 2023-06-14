import {publicProcedure} from "@/trpc";
import prisma from "@/lib/database";
import {TRPCError} from "@trpc/server";
import { WxUserSchema } from "@/lib/wx-validation";

const getArticles = publicProcedure
    .input(WxUserSchema)
    .query(async ({input, ctx}) => {

        const { code } = input;
        let appid = "wx873b72762512d3bf"; //自己小程序后台管理的appid，可登录小程序后台查看
        let secret = "2a78686ce777221a0e8dfe1e0f327c79"; //小程序后台管理的secret，可登录小程序后台查看
        let grant_type = "authorization_code"; // 授权（必填）默认值
        //请求获取openid
        let url =
            "https://api.weixin.qq.com/sns/jscode2session?grant_type=" +
            grant_type +
            "&appid=" +
            appid +
            "&secret=" +
            secret +
            "&js_code=" +
            code;
        let request = require('request');
        let result;
        request(url, (err, response, body) => {
            result =  body;
            // if (!err && body.errorCode == 0) {
            //     // 服务器返回的openid、sessionKey
            //     let _data = JSON.parse(body);
            //     _data.code = code;
            //     _data.session_key = "";
            //
            //     await prisma.wxUser.upsert({
            //         where: {
            //             openId: _data.openid,
            //         },
            //         update: {
            //             nickName: _data.nickName,
            //             avatar: _data.avatarUrl,
            //             phone: _data.phone
            //         },
            //         create: {
            //             openId: _data.openid,
            //             unionId: _data.unionid,
            //             nickName: _data.nickName,
            //             avatar: _data.avatarUrl,
            //             phone: _data.phone
            //         },
            //     });
            //     return _data;
            // } else {
            //     throw new TRPCError({
            //         code: "FORBIDDEN",
            //         message: "授权异常"
            //     });
            // }
        });
        return result;
    });

export default getArticles;
