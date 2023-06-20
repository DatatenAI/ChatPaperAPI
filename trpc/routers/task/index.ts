import "server-only";
import {createTRPCRouter} from "@/trpc";
import list from "./list";
import create from "./create";
import upload from "./upload";


const taskRouter = createTRPCRouter({
    list,
    create,
    upload
});

export default taskRouter;