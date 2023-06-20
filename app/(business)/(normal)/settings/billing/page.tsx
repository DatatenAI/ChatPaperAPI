import React from 'react';
import {Page} from "@/types";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import {Button} from "@/ui/button";

export const metadata = {
    title: '账户余额'
};

const plans = [{
    name: '体验包',
    credits: 10,
    price: 10,
}, {
    name: '基础包',
    credits: 10,
    price: 10,
}, {
    name: '高级包',
    credits: 10,
    price: 10,
},{
    name: '豪华包',
    credits: 10,
    price: 10,
}]
const BillingPage: Page = props => {
    return (
        <PageLayout title={metadata.title} className={'pt-0'}>
            <div className={'space-y-4'}>
                <h2 className={'text-lg font-semibold leading-none'}>充值点数</h2>
                <ul className={'flex'}>
                    <li className={'border rounded-xl p-4'}>
                        <p>基础版</p>
                    </li>
                    <li>
                        <p>基础版</p>
                    </li>
                    <li>
                        <p>基础版</p>
                    </li>
                </ul>
                <Button>去付款</Button>
            </div>
        </PageLayout>
    );
};


export default BillingPage;