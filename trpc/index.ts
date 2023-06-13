import {createTRPCRouter} from "./create";
import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import weappRouter from "@/trpc/routers/weapp";

export const appRouter = createTRPCRouter({
    account: accountRouter,
    auth: authRouter,
    weapp: weappRouter
});

export type AppRouter = typeof appRouter;
export {
    protectedProcedure,
    publicProcedure,
    createTRPCRouter
} from './create';
