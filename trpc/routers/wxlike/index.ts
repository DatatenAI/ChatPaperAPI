import "server-only";
import {createTRPCRouter} from "@/trpc";
import getOpenId from "@/trpc/routers/weapp/open-id";
import scarchFavorite from "@/trpc/routers/wefavorite/search-favorite";
import cancelFavorite from "@/trpc/routers/wefavorite/cancel-favorite";
import addFavorite from "@/trpc/routers/wefavorite/add-favorite";
import scarchFavoritePaper from "@/trpc/routers/wefavorite/search-favorite-paper";


const wefavoriteRouter = createTRPCRouter({
    deleteFavorite: cancelFavorite,
    insertFavorite: addFavorite,
    scarchFavoritePaper,
    scarchFavorite
});

export default wefavoriteRouter;
