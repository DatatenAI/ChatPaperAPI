import {Page} from "@/types";
import React from "react";
import TaskHeader from "./header";
import prisma from "@/lib/database";
import {notFound} from "next/navigation";
import TaskContent from "./content";
import {getFileUrl} from "@/lib/oss";


const TaskDetail: Page<"id"> = async props => {
    const id = parseInt(props.params.id);
    if (isNaN(id)) {
        return notFound();
    }
    const task = await prisma.task.findUnique({
        select: {
            pdfHash: true,
            language: true,
            state: true
        },
        where: {id}
    });
    if (!task) {
        return notFound();
    }
    const summary = await prisma.summary.findUnique({
        where: {
            pdfHash_language: {
                pdfHash: task.pdfHash,
                language: task.language
            }
        }
    });
    const pdfUrl = getFileUrl("uploads", task.pdfHash + ".pdf");
    return <div>
        <TaskHeader task={task}/>
        <TaskContent task={task} pdfUrl={pdfUrl}/>
    </div>
}
export default TaskDetail;