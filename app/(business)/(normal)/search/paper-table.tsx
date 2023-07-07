'use client';
import React, {FC, useState} from 'react';
import {BsPeople} from "@react-icons/all-files/bs/BsPeople";
import {AiOutlineBuild} from "@react-icons/all-files/ai/AiOutlineBuild";
import {AiOutlineCalendar} from "@react-icons/all-files/ai/AiOutlineCalendar";
import PaperTableFilter from "./paper-table-filter";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/ui/sheet";
import {Button} from "@/ui/button";
import usePagination from "@/hooks/use-pagination";
import {trpc} from "@/lib/trpc";
import {Pagination} from "@/ui/pagination";

const string = `
# Basic Information:

- Title: Achieving RGB-D Level Segmentation Performance from a Single ToF Camera (通过单个ToF相机实现RGB-D级别的分割性能)
- Authors: Pranav Sharma, Jigyasa Singh Katrolia, Jason Rambach, Bruno Mirbach, Didier Stricker, Juergen Seiler
- Affiliation: German Research Center for Artificial Intelligence, Germany (德国人工智能研究中心)
- Keywords: multi-modal image segmentation, depth image, infrared image
- URLs: [Paper](https://arxiv.org/abs/2306.17636v1), [GitHub: None]

# 论文简要 :

- 通过使用单个ToF相机的红外（IR）和深度图像，本研究展示了在语义分割任务上可以获得与RGB-D相机相同准确性水平的结果。为了融合ToF相机的IR和深度模态，研究人员引入了一种利用深度特定卷积的多任务学习框架的方法。在对车内分割数据集的评估中，该方法展示了与更昂贵的RGB-D方法相竞争的能力。

# 背景信息:

- 论文背景: 语义分割领域主要以RGB图像为主，但最近开始转向RGB-D语义分割。然而，由于实际、物流和财务原因，RGB图像并不总是可用的。RGB-D相机成本更高，校准两个相机的工作量更大。此外，它们的尺寸较大，通常在实际应用中受到限制。与此相反，ToF深度相机通常在没有RGB相机的情况下部署，用于手势控制、车内监控、工业自动化和建筑管理等应用。然而，红外图像（IR）作为ToF深度相机的副产品，尚未得到充分探索，特别是与深度数据的结合。
- 过去方案: 过去的RGB-D方法中，深度信息通常只是颜色信息的附属品，并且由相同类型的神经网络层处理。最近的一些工作提出了深度特定操作，如深度感知和形状感知卷积。然而，IR图像和深度图像都与ToF相机相关，因此这些深度特定操作也可以应用于IR图像。本研究观察到，IR和深度图像的输出在许多方面是相关的，因此可以使用这些深度特定操作从两种模态中学习更有意义的特征。
- 论文的Motivation: 本研究的动机是利用单个ToF相机提供的可用模态，通过针对IR-Depth（IR-D）输入量身定制的架构，实现与RGB-D方法相媲美的语义分割性能。研究人员从现有的深度感知和形状卷积操作中获得灵感，并设计了一种深度感知形状卷积操作，将IR-D输入用于多任务学习架构，其中深度填充作为辅助任务。通过仅使用ToF相机，我们的方法超越了基线的RGB-D方法。


`;
const PaperTable: FC<{
    conditions: {
        keywords: string[];
        years: number[];
        conferences: string[];
    }
}> = props => {
    const [summaryOpen, setSummaryOpen] = useState(false);
    const viewSummary = () => {
        setSummaryOpen(true);
    }

    const pagination = usePagination(1, 8);

    const {data, isLoading} = trpc.paper.list.useQuery({
        current: pagination.current,
        size: pagination.size,
    });

    return (
        <div className={'space-y-8'}>
            <PaperTableFilter conditions={props.conditions}/>
            <div className={'space-y-4'}>
                {
                    (data?.papers || []).map((paper, idx) => {
                        return <div key={idx} className={'border rounded-lg p-4 space-y-2'}>
                            <div className={'font-semibold text-lg'}>{paper.title}</div>
                            <div className={'flex gap-2 flex-wrap'}>
                                {
                                    paper.Keywords?.length ? (JSON.parse(paper.Keywords) as string[]).map(keyword => {
                                        return <span key={keyword}
                                                     className={'bg-primary text-white h-6 rounded-lg text-xs px-2 py-1'}>{keyword}</span>
                                    }) : null
                                }
                            </div>
                            <div className={'space-x-4 text-sm text-gray-500 flex items-center'}>
                                <div className={'space-x-2 flex items-center'}>
                                    <BsPeople/>
                                    <div className={'space-x-1'}>
                                        <span className={'underline'}>Bruno Mirbach</span>
                                        <span className={'underline'}>Juergen Seiler</span>
                                    </div>
                                </div>
                                <div className={'space-x-2 flex items-center'}>
                                    <AiOutlineBuild/>
                                    <span>ICLR</span>
                                </div>
                                <div className={'space-x-2 flex items-center'}>
                                    <AiOutlineCalendar/>
                                    <span>{paper.year}</span>
                                </div>
                            </div>
                            <div className={'text-sm font-medium'}>{paper.abstract}</div>
                            <div className={'space-x-2'}>
                                <Button size={'xs'} onClick={() => viewSummary()}>查看总结</Button>
                                <Button size={'xs'} onClick={() => window.open(paper.pdfUrl)}
                                        variant={'secondary'}>PDF下载</Button>
                                <Button size={'xs'} onClick={() => viewSummary()} variant={'secondary'}>Bibtex</Button>
                            </div>

                        </div>
                    })
                }
                <Pagination total={data?.total || 0} current={pagination.current} size={pagination.size}
                            onPageChange={pagination.changePage}
                            onSizeChange={pagination.changeSize}/>
            </div>
            <Sheet open={summaryOpen} onOpenChange={setSummaryOpen}>
                <SheetContent className={'xl:max-w-lg overflow-y-auto'}>
                    <article className={'prose prose-sm'}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {string}
                        </ReactMarkdown>
                    </article>
                </SheetContent>
            </Sheet>
        </div>
    );
};


export default PaperTable;