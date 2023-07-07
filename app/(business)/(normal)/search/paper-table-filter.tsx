'use client';
import React, {FC, ReactNode, useState} from 'react';
import {PaginationSchema, PaperSearchSchema, PaperSearchSort} from "@/lib/validation";
import z from "zod";


type SearchParams = Omit<z.infer<typeof PaperSearchSchema>, keyof z.infer<typeof PaginationSchema>>;


const Tag: FC<{
    active: boolean;
    children: ReactNode,
    onClick: () => void
}> = ({active, children, onClick}) => {
    return <span
        onClick={onClick}
        className={`text-sm  ${active ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} rounded cursor-pointer px-2 py-1`}>{
        children
    }</span>
}
const SortWithLabels: {
    value: PaperSearchSort;
    label: string;
}[] = [
    {
        label: '最近发表',
        value: PaperSearchSort.TIME_DESC
    }, {
        label: '最远发表',
        value: PaperSearchSort.TIME_ASC
    }, {
        label: '最多引用',
        value: PaperSearchSort.CITE_DESC
    }, {
        label: '最少引用',
        value: PaperSearchSort.CITE_ASC
    }
];
const PaperTableFilter: FC<{
    conditions: {
        keywords: string[];
        years: number[];
        conferences: string[];
    }
}> = ({conditions}) => {

    const [searchParams, setSearchParams] = useState<SearchParams>({
        keywords: [],
        years: [],
        conferences: [],
        sort: PaperSearchSort.TIME_DESC
    });

    const clickTag = <K extends keyof SearchParams>(key: K, value: SearchParams[K] extends (infer I)[] ? I | null : SearchParams[K]) => {
        setSearchParams(prevState => {
            let searchParam = prevState[key];
            if (Array.isArray(searchParam)) {
                const idx = searchParam.findIndex(it => it === value);
                if (idx >= 0) {
                    searchParam.splice(idx);
                } else {
                    // @ts-ignore
                    searchParam.push(value);
                }
            } else {
                searchParam = value as SearchParams[K];
            }
            return {
                ...prevState,
                [key]: searchParam
            }
        })
    }

    return (
        <div className={'border p-4 space-y-4 rounded-lg'}>
            <div className={'flex space-x-6 items-center'}>
                <div className={'text-sm min-w-[64px]'}>年份：</div>
                <div className={'flex gap-2 '}>
                    <Tag onClick={() => clickTag('years', null)} active={!searchParams.years.length}>全部</Tag>
                    {conditions.years.map(year => <Tag onClick={() => clickTag('years', year)}
                                                       active={searchParams.years.includes(year)}>{year}</Tag>)}
                </div>
            </div>
            <div className={'flex space-x-6 items-center'}>
                <div className={'text-sm min-w-[64px]'}>会议：</div>
                <div className={'flex gap-2 '}>
                    <Tag onClick={() => clickTag('conferences', null)}
                         active={!searchParams.conferences.length}>全部</Tag>
                    {conditions.conferences.map(conference => <Tag onClick={() => clickTag('conferences', conference)}
                                                                   active={searchParams.keywords.includes(conference)}>{conference}</Tag>)}
                </div>
            </div>
            <div className={'flex space-x-6 items-center'}>
                <div className={'text-sm min-w-[64px]'}>关键词：</div>
                <div className={'flex gap-2 '}>
                    <Tag onClick={() => clickTag('keywords', null)} active={!searchParams.keywords.length}>全部</Tag>
                    {conditions.keywords.map(keyword => <Tag onClick={() => clickTag('keywords', keyword)}
                                                             active={searchParams.keywords.includes(keyword)}>{keyword}</Tag>)}
                </div>
            </div>
            <div className={'flex space-x-6 items-center'}>
                <div className={'text-sm min-w-[64px]'}>排序：</div>
                <div className={'flex gap-2 '}>
                    {
                        SortWithLabels.map((it) => {
                            return <Tag onClick={() => clickTag('sort', it.value)}
                                        active={searchParams.sort === it.value}>{it.label}</Tag>
                        })
                    }

                </div>
            </div>
        </div>
    );
};


export default PaperTableFilter;