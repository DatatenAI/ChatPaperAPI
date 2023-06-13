import {publicProcedure} from "@/trpc";

const getArticles = publicProcedure
    .query(async ({input, ctx}) => {
        return [{
            title: '123',
        }];
    });

export default getArticles;