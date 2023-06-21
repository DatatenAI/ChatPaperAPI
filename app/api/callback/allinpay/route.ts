import {Api} from "@/types";
import logger from "@/lib/logger";


export const POST: Api = async (req) => {
    try {
        const params = new URLSearchParams(await req.text());
        const payNo = params.get("outtrxid");
        const payFee = params.get("trxamt");
        const sign = params.get("sign");

        console.log(params)
        return new Response("success");
    } catch (e) {
        logger.error("处理支付回调失败", e)
        return new Response('failed', {status: 500});
    }

}
