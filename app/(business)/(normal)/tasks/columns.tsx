"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Task, TaskState, TaskType} from "@prisma/client";
import dayjs from "dayjs";
import {Badge} from "@/ui/badge";
import {ReactElement} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import {Button} from "@/ui/button";
import {FiMoreHorizontal} from "react-icons/fi";
import {AiOutlineEye, AiOutlineShareAlt} from "react-icons/ai";
import {BsTranslate} from "react-icons/bs";
import {CgFileDocument} from "react-icons/cg";
import Link from "next/link";
import TaskStateBadge from "@/components/task-state-badge";

export type TaskColumn = Pick<
    Task,
    "id" | "state" | "createdAt" | "finishedAt" | "type" | "pages" | "costCredits"
>;


export const TaskTypeBadges: Record<TaskType, ReactElement> = {
    SUMMARY: <Badge>
        <CgFileDocument className={'mr-1'}/>
        总结
    </Badge>,
    TRANSLATE: <Badge className={'bg-violet-500'}>
        <BsTranslate className={'mr-1'}/>
        翻译
    </Badge>,
};

export const taskColumnDefs: ColumnDef<TaskColumn>[] = [
    {
        accessorKey: "title",
        header: "PDF标题"
    },
    {
        accessorKey: "type",
        header: "任务类型",
        meta: {
            className: 'w-40',
        },
        cell: ({cell}) => {
            return TaskTypeBadges[cell.getValue() as TaskType];
        },
    },
    {
        accessorKey: "pages",
        header: "页数",
        meta: {
            className: 'w-20',
        },
    },
    {
        accessorKey: "costCredits",
        header: "消耗",
        meta: {
            className: 'w-20',
        },
    },
    {
        accessorKey: "state",
        header: "状态",
        meta: {
            className: 'w-40',
        },
        cell: ({cell}) => {
            return <TaskStateBadge state={cell.getValue() as TaskState}/>
        },
    },
    {
        accessorKey: "createdAt",
        header: "创建时间",
        meta: {
            className: 'w-48',
        },
        accessorFn: row => dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
        accessorKey: "finishedAt",
        header: "结束时间",
        accessorFn: row => row.finishedAt ? dayjs(row.finishedAt).format("YYYY-MM-DD HH:mm:ss") : null,
        meta: {
            className: 'w-48',
        },
    },
    {
        id: "actions",
        header: '操作',
        meta: {
            className: 'w-40',
        },
        cell: ({row}) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <FiMoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/task/${row.original.id}`} prefetch={false}>
                            <DropdownMenuItem className={'space-x-1'}>
                                <AiOutlineEye/>
                                <span>查看详情</span>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className={'space-x-1'}>
                            <AiOutlineShareAlt/>
                            <span>分享</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },
];
