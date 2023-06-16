import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import weappRouter from "@/trpc/routers/weapp";
import wepaperRouter from "@/trpc/routers/wepaper";
import wefavoriteRouter from "@/trpc/routers/wefavorite";

const mergedRouter = {
    account: accountRouter,
    auth: authRouter,
    wepaper: wepaperRouter,
    weapp:weappRouter,
    wefavorite:wefavoriteRouter
}
export default mergedRouter;
