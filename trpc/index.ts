import "server-only";
import {Session} from "next-auth";
import {initTRPC, TRPCError} from "@trpc/server";
import superJson from "superjson";
import {ZodError} from "zod";
import {Logger} from "pino";
import mergedRouter from "@/trpc/routers";

type TRPCContext = {
    session: Session | null,
    logger: Logger
}


const t = initTRPC.context<TRPCContext>().create({
    transformer: superJson,
    isDev: process.env.NODE_ENV === "production",
    errorFormatter({shape, error}) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zod: error.cause instanceof ZodError ? error.cause.flatten() : null
            },
            message: error.code === "INTERNAL_SERVER_ERROR" ? "An unknown error has occurred." : shape.message
        };
    }
});

export const createTRPCRouter = t.router;

const logMiddleware = t.middleware(({ctx, path, rawInput, next}) => {
    ctx.logger.info({path, input: rawInput});
    return next();
});
export const publicProcedure = t.procedure.use(logMiddleware);


const authMiddleware = t.middleware(({ctx, next}) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({code: "UNAUTHORIZED"});
    }
    return next({
        ctx: {
            session: {...ctx.session, user: ctx.session.user}
        }
    });
});


export const protectedProcedure = publicProcedure.use(authMiddleware);


export const appRouter = createTRPCRouter(mergedRouter);

export type AppRouter = typeof appRouter;
