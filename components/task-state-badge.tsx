import React, {FC} from 'react';
import {TaskState} from "@prisma/client";
import {BiLoaderAlt} from "react-icons/bi";
import {Badge} from "@/ui/badge";
import {TbPointFilled} from "react-icons/tb";

const TaskStateBadge: FC<{
    state: TaskState
}> = props => {
    switch (props.state) {
        case TaskState.RUNNING:
            return <Badge variant={'info'} plain>
                <BiLoaderAlt className={'animate-spin mr-1'}/>
                运行中
            </Badge>
        case TaskState.SUCCESS:
            return <Badge variant={"success"} plain>
                <TbPointFilled className={'mr-1'}/>
                成功
            </Badge>
        case TaskState.FAIL:
            return <Badge variant={"destructive"} plain>
                <TbPointFilled className={'mr-1'}/>
                失败
            </Badge>
    }
};


export default TaskStateBadge;