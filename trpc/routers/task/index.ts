import "server-only";
import {createTRPCRouter} from "@/trpc";
import list from "@/trpc/routers/task/list";


const taskRouter = createTRPCRouter({
    list
});

export default taskRouter;