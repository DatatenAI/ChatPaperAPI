import z from "zod";


const code = z.string().trim();
const userId = z.string().trim();
const keywords = z.string().trim();
const keywordId = z.string().trim();
const openId = z.string().trim();
const unionId = z.string().trim();
const nickName = z.string().trim();
const avatar = z.string().trim();
const phone = z.string().trim();
const email = z.string().email();
const gender = z.string().trim();
const birthday = z.string().trim();
const area = z.string().trim();
const educational = z.string().trim();
const interest = z.string().trim();
const favoriteId = z.string().trim();
const source = z.string().trim();

export const openIdSchema = z.object({code});
export const searchPaperSchema = z.object({keywords});
export const scarchMyKeywordsSchema = z.object({userId});
export const subscribeSchema = z.object({keywordId,userId});
export const scarchFavoriteSchema = z.object({userId,openId});
export const insertFavoriteSchema = z.object({userId,openId,favoriteId,source});

export const insertUserSchema = z.object({
    nickName,
    openId,
    unionId,
    avatar,
    phone,
    email,
    gender,
    birthday,
    area,
    educational,
    interest
});


