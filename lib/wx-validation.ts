import z from "zod";


const code = z.union([z.string(), z.null()]).optional();
const userId =  z.union([z.number(), z.null()]).optional();
const keywords = z.union([z.string(), z.null()]).optional();
const keywordId = z.number();
const openId = z.union([z.string(), z.null()]).optional();
const unionId = z.union([z.string(), z.null()]).optional();
const paperId = z.number().optional();
const id = z.number().optional();
const nickName = z.union([z.string(), z.null()]).optional();
const avatar = z.union([z.string(), z.null()]).optional();
const phone = z.union([z.string(), z.null()]).optional();
const email = z.union([z.string(), z.null()]).optional();
const gender = z.union([z.string(), z.null()]).optional();
const birthday = z.union([z.string(), z.null()]).optional();
const country = z.union([z.string(), z.null()]).optional();
const province = z.union([z.string(), z.null()]).optional();
const city = z.union([z.string(), z.null()]).optional();
const educational = z.union([z.string(), z.null()]).optional();
const interest = z.union([z.string(), z.null()]).optional();
const intro = z.union([z.string(), z.null()]).optional();
const favoriteName = z.union([z.string(), z.null()]).optional();
const favoriteId = z.union([z.number(), z.null()]).optional();
const source = z.union([z.string(), z.null()]).optional();
const type = z.union([z.string(), z.null()]).optional();
const content = z.union([z.string(), z.null()]).optional();
const pageNum = z.number().optional();
const pageSize = z.number().optional();

export const openIdSchema = z.object({code});
export const bindEmailSchema = z.object({userId,openId,email,code});
export const searchPaperSchema = z.object({userId,openId,keywords,pageNum,pageSize});
export const searchPaperDetail = z.object({paperId,userId,openId});
export const scarchMyKeywordsSchema = z.object({userId,openId});
export const subscribeSchema = z.object({keywordId,openId,userId});
export const scarchFavoriteSchema = z.object({userId,openId});
export const insertFavoriteSchema = z.object({userId,openId,favoriteName,favoriteId,paperId,source});
export const addLikeSchema = z.object({userId,openId,paperId});
export const addReadSchema = z.object({userId,openId,paperId});
export const searchSchema = z.object({id,userId,openId,favoriteId,pageNum,pageSize});
export const searchSummarySchema = z.object({pageNum,pageSize,email});
export const addFeedBackSchema = z.object({userId,openId,type,content});

export const insertUserSchema = z.object({
    nickName,
    openId,
    unionId,
    avatar,
    phone,
    email,
    gender,
    birthday,
    country,
    province,
    city,
    educational,
    interest,
    intro
});


