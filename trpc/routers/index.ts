import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import weappRouter from "@/trpc/routers/weapp";

const mergedRouter = {
    account: accountRouter,
    auth: authRouter,
    weapp:weappRouter
}
export default mergedRouter;