'use client';
import React, {useState} from 'react';
import {Page} from "@/types";
import DataTable from "@/ui/data-table";
import {taskColumnDefs} from "./columns";
import PageLayout from "@/app/(business)/(normal)/page-layout";
import {Tabs, TabsList, TabsTrigger} from "@/ui/tabs";
import {trpc} from "@/lib/trpc";
import {ListTaskSchema} from "@/lib/validation";
import z from "zod";
import usePagination from "@/hooks/use-pagination";

type QuerySchema = z.infer<typeof ListTaskSchema>;

const filterStates = [
    {value: 'ALL', label: '全部'},
    {value: 'RUNNING', label: '运行中'},
    {value: 'SUCCESS', label: '成功'},
    {value: 'FAIL', label: '失败'}
]
const TaskPage: Page = props => {
    const [state, setState] = useState<QuerySchema['state']>('ALL');
    const pagination = usePagination(1,8);

    const {data, isLoading} = trpc.task.list.useQuery({
        current: pagination.current,
        size: pagination.size,
        state: state
    });
    const changeState = (e: string) => {
        setState(e as QuerySchema['state']);
        pagination.changePage(1);
    }

    return (
        <PageLayout title={'我的总结'}
        >
            <DataTable
                pagination={{
                    current: pagination.current,
                    total: data?.total,
                    size: pagination.size,
                    onPageChange: pagination.changePage,
                    onSizeChange: pagination.changeSize
                }}
                toolbar={<div>
                    <Tabs value={state} onValueChange={changeState}>
                        <TabsList>
                            {filterStates.map(it => {
                                return <TabsTrigger key={it.value} value={it.value}>{it.label}</TabsTrigger>
                            })}
                        </TabsList>
                    </Tabs>
                </div>}
                columns={taskColumnDefs}
                loading={isLoading}
                data={data?.tasks || []}
            />
        </PageLayout>
    );
};


export default TaskPage;