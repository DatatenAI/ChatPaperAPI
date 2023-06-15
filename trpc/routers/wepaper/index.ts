import "server-only";
import {createTRPCRouter} from "@/trpc";
import searchKeyWords from "@/trpc/routers/wepaper/search-keywords";
import searchPaper from "@/trpc/routers/wepaper/search-paper";
import searchMyKeyWords from "@/trpc/routers/wepaper/search-my-keywords";
import deleteSubscribe from "@/trpc/routers/wepaper/delete-subscribe";
import insertSubscribe from "@/trpc/routers/wepaper/insert-subscribe";


const wepaperRouter = createTRPCRouter({
    deleteSubscribe,
    insertSubscribe,
    searchKeyWords,
    searchMyKeyWords,
    searchPaper
});

export default wepaperRouter;
