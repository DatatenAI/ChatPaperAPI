import "server-only";
import {createTRPCRouter} from "@/trpc";
import getOpenId from "@/trpc/routers/weapp/open-id";
import insertWxUser from "@/trpc/routers/weapp/insert-user";


const weappRouter = createTRPCRouter({
    getOpenId,
    insertWxUser
});

export default weappRouter;
