import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";

export default withAuth(
    async function middleware(req) {
        const token = await getToken({req});
        const isAuth = !!token;
        const isAuthPage =
            req.nextUrl.pathname.startsWith("/sign-in") ||
            req.nextUrl.pathname.startsWith("/sign-up")
        if (isAuthPage) {
            return isAuth ? NextResponse.redirect(new URL("/home", req.url)) : null;
        }
        if (!isAuth) {
            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }
            return NextResponse.redirect(
                new URL(`/sign-in?from=${encodeURIComponent(from)}`, req.url)
            );
        }
    },
    {
        callbacks: {
            async authorized() {
                return true;
            }
        }
    }
);
// @ts-ignore
export const config = {
    matcher: ["/((?!404|error|api|reset-password|verify-email).*)"]
};