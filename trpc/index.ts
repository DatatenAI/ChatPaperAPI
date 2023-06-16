import {createTRPCRouter} from "./create";
import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import weappRouter from "@/trpc/routers/weapp";
import wepaperRouter from "@/trpc/routers/wepaper";
import wefavoriteRouter from "@/trpc/routers/wefavorite";
import taskRouter from "@/trpc/routers/task";

export const appRouter = createTRPCRouter({
    account: accountRouter,
    auth: authRouter,
    weapp: weappRouter,
    task: taskRouter,
    wepaper: wepaperRouter,
    wefavorite: wefavoriteRouter
});

export type AppRouter = typeof appRouter;
export {
    protectedProcedure,
    publicProcedure,
    createTRPCRouter
} from './create';
