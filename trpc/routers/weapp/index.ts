import "server-only";
import {createTRPCRouter} from "@/trpc";
import getArticles from "@/trpc/routers/weapp/articles";


const weappRouter = createTRPCRouter({
    getArticles
});

export default weappRouter;