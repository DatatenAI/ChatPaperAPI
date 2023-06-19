import "server-only";
import {createTRPCRouter} from "@/trpc";
import searchKeyWords from "@/trpc/routers/wepaper/search-keywords";
import searchPaper from "@/trpc/routers/wepaper/search-paper";
import searchMyKeyWords from "@/trpc/routers/wepaper/search-my-keywords";
import cancelSubscribe from "@/trpc/routers/wepaper/cancel-subscribe";
import addSubscribe from "@/trpc/routers/wepaper/add-subscribe";
import addRead from "@/trpc/routers/wepaper/add-read";


const wepaperRouter = createTRPCRouter({
    addRead,
    cancelSubscribe,
    addSubscribe,
    searchKeyWords,
    searchMyKeyWords,
    searchPaper
});

export default wepaperRouter;
