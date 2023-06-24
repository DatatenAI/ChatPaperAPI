import "server-only";
import {createTRPCRouter} from "@/trpc";
import chat from "./chat";


const summaryRouter = createTRPCRouter({
    chat
});

export default summaryRouter;