import React from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import {getCurrentUser} from "@/lib/auth";
import UploadContainer from "./upload-container";


const HomePage: Page = async props => {

    const user = await getCurrentUser();

    return (
        <PageLayout>
            <div>
                <UploadContainer defaultLanguage={user?.language || '中文'}/>
            </div>
        </PageLayout>
    )

};


export default HomePage;