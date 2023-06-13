import {createTRPCRouter} from "./create";
import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import weappRouter from "@/trpc/routers/weapp";
import taskRouter from "@/trpc/routers/task";

export const appRouter = createTRPCRouter({
    account: accountRouter,
    auth: authRouter,
    weapp: weappRouter,
    task: taskRouter
});

export type AppRouter = typeof appRouter;
export {
    protectedProcedure,
    publicProcedure,
    createTRPCRouter
} from './create';
