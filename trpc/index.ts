import {createTRPCRouter} from "./create";
import accountRouter from "@/trpc/routers/account";
import authRouter from "@/trpc/routers/auth";
import weappRouter from "@/trpc/routers/weapp";
import wepaperRouter from "@/trpc/routers/wepaper";
import wefavoriteRouter from "@/trpc/routers/wefavorite";
import taskRouter from "@/trpc/routers/task";
import summaryRouter from "@/trpc/routers/summary";

export const appRouter = createTRPCRouter({
    account: accountRouter,
    auth: authRouter,
    task: taskRouter,
    summary: summaryRouter,
    weapp: weappRouter,
    wepaper: wepaperRouter,
    wefavorite: wefavoriteRouter
});

export type AppRouter = typeof appRouter;
export {
    protectedProcedure,
    publicProcedure,
    createTRPCRouter
} from './create';
