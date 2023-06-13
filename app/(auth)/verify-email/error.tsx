'use client';
import React from 'react';
import {ErrorPage} from "@/types";
import AuthHeader from "@/app/(auth)/components/AuthHeader";

const ErrorHandler: ErrorPage = (props) => {
    return <AuthHeader title={"Oops, something went wrong! Please try again."}>
 
    </AuthHeader>
}
export default ErrorHandler;
