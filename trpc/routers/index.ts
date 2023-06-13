import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";

const mergedRouter = {
    account: accountRouter,
    auth: authRouter
}
export default mergedRouter;