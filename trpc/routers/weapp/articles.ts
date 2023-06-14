import {publicProcedure} from "@/trpc";
import {WxUserSchema} from "@/lib/wx-validation";

const getArticles = publicProcedure
    .input(WxUserSchema)
    .query(async ({input, ctx}) => {
        const {code} = input;
        let appid = "wx873b72762512d3bf"; //自己小程序后台管理的appid，可登录小程序后台查看
        let secret = "2a78686ce777221a0e8dfe1e0f327c79"; //小程序后台管理的secret，可登录小程序后台查看
        let grant_type = "authorization_code"; // 授权（必填）默认值
        let result;
        const params = new URLSearchParams({
            grant_type,
            appid,
            secret,
            js_code: code
        });
        const res = await fetch(`https://api.weixin.qq.com/sns/jscode2session?${params}`).then(res => res.json());
        console.log(res)
        // request(url, (err, response, body) => {
        //     result = body;
        //     // if (!err && body.errorCode == 0) {
        //     //     // 服务器返回的openid、sessionKey
        //     //     let _data = JSON.parse(body);
        //     //     _data.code = code;
        //     //     _data.session_key = "";
        //     //
        //     //     await prisma.wxUser.upsert({
        //     //         where: {
        //     //             openId: _data.openid,
        //     //         },
        //     //         update: {
        //     //             nickName: _data.nickName,
        //     //             avatar: _data.avatarUrl,
        //     //             phone: _data.phone
        //     //         },
        //     //         create: {
        //     //             openId: _data.openid,
        //     //             unionId: _data.unionid,
        //     //             nickName: _data.nickName,
        //     //             avatar: _data.avatarUrl,
        //     //             phone: _data.phone
        //     //         },
        //     //     });
        //     //     return _data;
        //     // } else {
        //     //     throw new TRPCError({
        //     //         code: "FORBIDDEN",
        //     //         message: "授权异常"
        //     //     });
        //     // }
        // });
        return res;
    });

export default getArticles;
