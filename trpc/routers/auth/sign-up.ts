import { hashToken } from "@/lib/auth";
import prisma from "@/lib/database";
import { sendMail } from "@/lib/mail";
import { SignUpSchema } from "@/lib/validation";
import { publicProcedure } from "@/trpc";
import { VerificationTokenType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";

const signUp = publicProcedure
  .input(SignUpSchema)
  .mutation(async ({ input, ctx }) => {
    const { email, password, name } = input;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user && user.emailVerified) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "The mail has been registered",
      });
    }
    const hashedPassword = hashToken(input.password);
    await prisma.user.upsert({
      where: {
        email,
      },
      update: {
        password: hashedPassword,
        name,
      },
      create: {
        email,
        name,
        password: hashedPassword,
      },
    });
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 86400 * 1000);
    await prisma.verificationToken.create({
      data: {
        identifier: input.email,
        token: hashToken(token),
        type: VerificationTokenType.register,
        expires,
      },
    });
    const params = new URLSearchParams({ token });
    const link = `${process.env.NEXTAUTH_URL}/verify-email?${params}`;
    try {
      await sendMail("register", {
        to: email,
        subject: "Verify Your Email Address for Registration",
        params: {
          link,
        },
      });
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Send mail failed,Please try again",
        cause: e,
      });
    }
    return {
      message: "The verification mail has been sent",
    };
  });

export default signUp;
