import React, {Suspense} from "react";
import {AsyncComponent, Page} from "@/types";
import AuthHeader from "../components/AuthHeader";
import {VerificationTokenType} from "@prisma/client";
import {CgSpinner} from "react-icons/cg";
import Link from "next/link";
import {hashToken} from "@/lib/auth";
import prisma from "@/lib/database";

const getToken = async (token?: string) => {
    let verificationToken;
    if (!token) {
        return null;
    }
    const hashedToken = hashToken(token);
    if (token) {
        verificationToken = await prisma.verificationToken.findUnique({
            where: {
                token: hashedToken,
                expires: {
                    gt: new Date()
                },
                type: VerificationTokenType.reset_password
            }
        });
    }
    if (verificationToken) {
        const user = await prisma.user.findUnique({where: {email: verificationToken.identifier}});
        if (user) {
            await prisma.$transaction(async trx => {
                await trx.verificationToken.update({
                    where: {
                        token: hashedToken
                    },
                    data: {
                        usedAt: new Date()
                    }
                });
                await trx.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        emailVerified: new Date()
                    }
                });

            });
        }
    }
    return verificationToken;

};

const VerifyResult: AsyncComponent<{
    token?: string
}> = async props => {
    const verificationToken = await getToken(props.token);
    let verificationSuccess = false;

    if (verificationToken) {
        verificationSuccess = true;
    }

    return <>
        <AuthHeader
            title={verificationSuccess ? "Your email address has been successfully verified" : "The verification link has expired  or is invalid"}
        />
        {
            verificationSuccess ? <div className={"flex justify-center"}>
                <Link href={"/sign-in"}
                      className={"rounded-lg text-sm font-semibold shadow-xs bg-primary hover:opacity-90  text-white dark:text-gray-200 h-10 px-4 py-2.5"}>Sign
                    in</Link>
            </div> : null
        }
    </>;
};

const VerifyEmailPage: Page = props => {
    const searchParams = props.searchParams;

    return (
        <Suspense fallback={<>
            <AuthHeader title={"Verifying your email address, please wait"}/>
            <div>
                <CgSpinner className={"animate-spin text-primary w-7 h-7 mx-auto"}/>
            </div>
        </>}>
            <VerifyResult token={searchParams?.token as string}/>
        </Suspense>
    );
};



export default VerifyEmailPage;