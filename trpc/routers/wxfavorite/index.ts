import "server-only";
import {createTRPCRouter} from "@/trpc";
import scarchFavorite from "@/trpc/routers/wxfavorite/search-favorite";
import cancelFavorite from "@/trpc/routers/wxfavorite/cancel-favorite";
import addFavorite from "@/trpc/routers/wxfavorite/add-favorite";
import addFavoritePaper from "@/trpc/routers/wxfavorite/add-favorite-paper";
import scarchFavoritePaper from "@/trpc/routers/wxfavorite/search-favorite-paper";
import editFavorite from "@/trpc/routers/wxfavorite/edit-favorite";
import deleteFavorite from "./delete-favorite";


const wxfavoriteRouter = createTRPCRouter({
    cancelFavorite,
    addFavorite,
    editFavorite,
    addFavoritePaper,
    scarchFavoritePaper,
    scarchFavorite,
    deleteFavorite
});

export default wxfavoriteRouter;
