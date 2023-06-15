import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import weappRouter from "@/trpc/routers/weapp";
import wepaperRouter from "@/trpc/routers/wepaper";

const mergedRouter = {
    account: accountRouter,
    auth: authRouter,
    wepaper: wepaperRouter,
    weapp:weappRouter
}
export default mergedRouter;
