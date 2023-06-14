import z from "zod";


const code = z.string().trim();

export const WxUserSchema = z.object({code});


