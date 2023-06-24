'use client';
import React, {FC} from 'react';
import {CreditHistory, CreditType} from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table";
import dayjs from "dayjs";
import usePagination from "@/hooks/use-pagination";
import {trpc} from "@/lib/trpc";
import DataTable from "@/ui/data-table";
import {Badge} from "@/ui/badge";
import {BiLoaderAlt} from "react-icons/bi";
import {AiOutlineCheck} from "react-icons/ai";
import {TbPointFilled} from "react-icons/tb";

type UsageColumn = Pick<
    CreditHistory,
    "id" | "type" | "amount" | "happenedAt"
>;

export const creditColumnDef: ColumnDef<UsageColumn>[] = [
    {
        accessorKey: "happenedAt",
        header: "日期",
        meta: {
            className: 'w-48',
        },
        accessorFn: row => dayjs(row.happenedAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
        accessorKey: "type",
        header: "类型",
        meta: {
            className: 'w-48',
        },
        cell: cell => {
            switch (cell.row.original.type) {
                case CreditType.TASK:
                    return <Badge variant={'info'} plain>
                        <BiLoaderAlt className={'animate-spin mr-1'}/>
                        支付中
                    </Badge>
                case CreditType.PURCHASE:
                    return <Badge variant={"success"} plain>
                        <AiOutlineCheck className={'mr-1'}/>
                        已支付
                    </Badge>
                case CreditType.CHECK_IN:
                    return <Badge variant={"destructive"} plain>
                        <TbPointFilled className={'mr-1'}/>
                        支付失败
                    </Badge>
            }

        }
    },
    {
        accessorKey: "amount",
        header: "数量",
        meta: {
            className: 'w-40',
        },
        accessorFn: row => `¥${(Number(row.amount) / 100).toFixed(2)}`,
    },
];
const UsageTable: FC = props => {
    const pagination = usePagination();
    const {data, isLoading} = trpc.account.listUsageHistory.useQuery({
        current: pagination.current,
        size: pagination.size,
    });

    return (
        <DataTable
            pagination={{
                current: pagination.current,
                total: data?.total,
                size: pagination.size,
                onPageChange: pagination.changePage,
                onSizeChange: pagination.changeSize
            }}
            columns={creditColumnDef}
            loading={isLoading}
            data={data?.histories || []}
        />
    );
};


export default UsageTable;