"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Task, TaskState, TaskType} from "@prisma/client";
import dayjs from "dayjs";
import {Badge} from "@/ui/badge";
import {ReactElement} from "react";
import {BiLoaderAlt} from "react-icons/bi";
import {TbPointFilled} from "react-icons/tb";
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

export type TaskColumn = Pick<
    Task,
    "id" | "state" | "createdAt" | "finishedAt" | "type"
>;

export const TaskStateBadges: Record<TaskState, ReactElement> = {
    RUNNING: <Badge variant={'info'} plain>
        <BiLoaderAlt className={'animate-spin mr-1'}/>
        运行中
    </Badge>,
    SUCCESS: <Badge variant={"success"} plain>
        <TbPointFilled className={'mr-1'}/>
        成功
    </Badge>,
    FAIL: <Badge variant={"destructive"} plain>
        <TbPointFilled className={'mr-1'}/>
        失败
    </Badge>,
};

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
        accessorKey: "state",
        header: "状态",
        meta: {
            className: 'w-40',
        },
        cell: ({cell}) => {
            return TaskStateBadges[cell.getValue() as TaskState];
        },
    },
    {
        accessorKey: "createdAt",
        header: "创建时间",
        meta: {
            className: 'w-64',
        },
        accessorFn: row => dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
        accessorKey: "finishedAt",
        header: "结束时间",
        accessorFn: row => row.finishedAt ? dayjs(row.finishedAt).format("YYYY-MM-DD HH:mm:ss") : null,
        meta: {
            className: 'w-64',
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
                        <DropdownMenuItem className={'space-x-1'}>
                            <AiOutlineEye/>
                            <span>查看详情</span>
                        </DropdownMenuItem>
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
