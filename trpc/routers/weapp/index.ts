import "server-only";
import {createTRPCRouter} from "@/trpc";
import getOpenId from "@/trpc/routers/weapp/open-id";
import insertWxUser from "@/trpc/routers/weapp/insert-user";
import searchKeyWords from "@/trpc/routers/weapp/search-keywords";
import searchPaper from "@/trpc/routers/weapp/search-paper";


const weappRouter = createTRPCRouter({
    searchKeyWords,
    getOpenId,
    insertWxUser,
    searchPaper
});

export default weappRouter;
