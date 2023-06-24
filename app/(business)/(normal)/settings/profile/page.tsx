import React from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";

export const metadata = {
    title: '个人信息'
}
const ProfilePage: Page = props => {
    return (
        <PageLayout title={metadata.title} className={'pt-0'}>
            <div>
                <h2 className={'font-semibold'}>基础信息</h2>
                
            </div>
        </PageLayout>
    );
};


export default ProfilePage;