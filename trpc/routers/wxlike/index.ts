import "server-only";
import {createTRPCRouter} from "@/trpc";
import getOpenId from "@/trpc/routers/weapp/open-id";
import addLike from "@/trpc/routers/wxlike/add-like";
import addDislike from "@/trpc/routers/wxlike/add-dislike";
import updateLike from "@/trpc/routers/wxlike/update-like";
import cancelLike from "@/trpc/routers/wxlike/cancel-like";
import searchMyLike from "@/trpc/routers/wxlike/search-my-like";


const wxLikeRouter = createTRPCRouter({
    addLike,
    addDislike,
    updateLike,
    cancelLike,
    searchMyLike
});

export default wxLikeRouter;
