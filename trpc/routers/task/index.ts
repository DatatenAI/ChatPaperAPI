import "server-only";
import {createTRPCRouter} from "@/trpc";
import list from "./list";
import create from "./create";


const taskRouter = createTRPCRouter({
    list,
    create
});

export default taskRouter;