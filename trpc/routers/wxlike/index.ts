import "server-only";
import {createTRPCRouter} from "@/trpc";
import getOpenId from "@/trpc/routers/weapp/open-id";
import scarchFavorite from "@/trpc/routers/wefavorite/search-favorite";
import deleteFavorite from "@/trpc/routers/wefavorite/delete-favorite";
import insertFavorite from "@/trpc/routers/wefavorite/insert-favorite";
import scarchFavoritePaper from "@/trpc/routers/wefavorite/search-favorite-paper";


const wefavoriteRouter = createTRPCRouter({
    deleteFavorite,
    insertFavorite,
    scarchFavoritePaper,
    scarchFavorite
});

export default wefavoriteRouter;
