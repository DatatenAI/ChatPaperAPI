"use client";

import {ColumnDef} from "@tanstack/react-table";
import type {Task, TaskState, TaskType} from "@prisma/client";
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
import {FiMoreHorizontal} from "@react-icons/all-files/fi/FiMoreHorizontal";
import {AiOutlineEye} from "@react-icons/all-files/ai/AiOutlineEye";
import {HiTranslate} from "@react-icons/all-files/hi/HiTranslate";
import {CgFileDocument} from "@react-icons/all-files/cg/CgFileDocument";
import Link from "next/link";
import TaskStateBadge from "@/components/task-state-badge";
import {AiOutlineRedo} from "@react-icons/all-files/ai/AiOutlineRedo";

export type TaskColumn = Pick<
    Task,
    "id" | "fileName" | "state" | "createdAt" | "finishedAt" | "type" | "pages" | "costCredits"
>;


export const TaskTypeBadges: Record<TaskType, ReactElement> = {
    SUMMARY: <Badge>
        <CgFileDocument className={'mr-1'}/>
        总结
    </Badge>,
    TRANSLATE: <Badge className={'bg-violet-500'}>
        <HiTranslate className={'mr-1'}/>
        翻译
    </Badge>,
};

export const taskColumnDefs: ColumnDef<TaskColumn>[] = [
    {
        accessorKey: "fileName",
        header: "文件名称"
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
                        <DropdownMenuItem asChild>
                            <Link href={`/task/${row.original.id}`} prefetch={false}>
                                <AiOutlineEye className={'mr-2'}/>
                                <span>查看详情</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/task/${row.original.id}`} prefetch={false}>
                                <HiTranslate className={'mr-2'}/>
                                <span>翻译</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link href={`/task/${row.original.id}`} prefetch={false}>
                                <AiOutlineRedo className={'mr-2'}/>
                                <span>重试</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },
];
