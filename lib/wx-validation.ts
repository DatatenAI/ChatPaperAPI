import z from "zod";


const code = z.string().trim().optional();
const userId =  z.union([z.number(), z.null()]).optional();
const keywords = z.string().optional();
const keywordId = z.number();
const openId = z.string().trim().optional();
const unionId = z.string().trim().optional();
const paperId = z.number().optional();
const id = z.number().optional();
const nickName = z.string().trim().optional();
const avatar = z.string().trim().optional();
const phone = z.string().trim().optional();
const email = z.string().trim().optional();
const gender = z.string().trim().optional();
const birthday = z.string().trim().optional();
const country = z.string().trim().optional();
const province = z.string().trim().optional();
const city = z.string().trim().optional();
const educational = z.string().trim().optional();
const interest = z.string().trim().optional();
const intro = z.string().trim().optional();
const favoriteName = z.string().trim().optional();
const favoriteId = z.number().optional();
const source = z.string().trim().optional();
const type = z.string().trim().optional();
const content = z.string().trim().optional();
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


