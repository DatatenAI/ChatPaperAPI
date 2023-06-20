"use client";
import {FC, ReactNode} from "react";
import {SessionProvider} from "next-auth/react";
import {Session} from "next-auth";

const AuthProvider: FC<{ children: ReactNode, session: Session | null }> = props => {
    return <SessionProvider session={props.session}>{props.children}</SessionProvider>;
};
export default AuthProvider;