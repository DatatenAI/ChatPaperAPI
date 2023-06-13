"use client";
import React from "react";
import {ErrorPage} from "@/types";

const ErrorHandler: ErrorPage = (props) => {
    return <>
        <p className={"text-center font-normal text-gray-600 dark:text-gray-300"}>Oops, something went wrong! Please try
            again.</p>
    </>;
};
export default ErrorHandler;
