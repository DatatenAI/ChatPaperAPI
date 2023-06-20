import {Page} from "@/types";
import React from "react";
import TaskHeader from "./header";
import prisma from "@/lib/database";
import {notFound} from "next/navigation";
import TaskContent from "./content";


const TaskDetail: Page<"id"> = async props => {
    const id = parseInt(props.params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const task = await prisma.task.findUnique({
        where: {id}
    });
    if (!task) {
        return notFound();
    }
    return <div>
        <TaskHeader task={task}/>
        <TaskContent task={task}/>
    </div>
}
export default TaskDetail;