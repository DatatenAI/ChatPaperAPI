import z from "zod";


const code = z.string().trim();
const userId = z.string().trim();
const keywords = z.string().optional();
const keywordId = z.string().trim();
const openId = z.string().trim();
const unionId = z.string().trim().optional();
const paperId = z.string().trim();
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
const favoriteId = z.string().trim();
const source = z.string().trim();
const pageNum = z.number();
const pageSize = z.number();

export const openIdSchema = z.object({code});
export const searchPaperSchema = z.object({keywords,pageNum,pageSize});
export const scarchMyKeywordsSchema = z.object({userId,openId});
export const subscribeSchema = z.object({keywordId,openId,userId});
export const scarchFavoriteSchema = z.object({userId,openId});
export const insertFavoriteSchema = z.object({userId,openId,favoriteId,source});
export const addLikeSchema = z.object({userId,openId,paperId});
export const addReadSchema = z.object({userId,openId,paperId});

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


