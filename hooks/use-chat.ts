import {useMemo, useState} from "react";
// import {trpc} from "@/lib/trpc";
import {ChatSchema} from "@/lib/validation";
import z from "zod";
import {TRPCClientError} from "@trpc/client";

export type ChatMessage = {
    from: 'system' | 'user';
    type: 'markdown' | 'text';
    content: string;
    loading: boolean;
    error?: boolean;
}

const reply_messages = [
    [`根据查询，我们找到了以下几篇文章：

    1. Become a Proficient Player with Limited Data through Watching Pure Videos。
    此论文探讨了如何通过深度学习来自动进行编辑推荐的任务，以改善用户体验。
    
    2. Learning to complement humans。
    该文章介绍了一种优化机器学习系统的方法，可充分利用人类和机器之间的互补作用来提高系统性能。\n实验结果表明，该方法具有很好的性能。\n
    
    3. Chasing All-Round Graph Representation Robustness: Model, Training, and Optimization。
    此论文提出了一种基于图神经网络的表示学习的方法，并通过对抗性的训练策略，提高了其鲁棒性。\n实验结果表明，该方法能够有效地提高图数据的表示能力。`,
    `根据查询结果，发现有一篇关于无人机集群意图识别的论文: Detection, tracking, and counting meets drones in crowds: A benchmark。该论文发表在CVPR2021会议上，主要针对通过无人机拍摄场景中的人群密度估计、定位和跟踪任务提出了一种新的STNNet方法。该方法综合了多个组件，包括特征提取子网络、密度估计头、定位和关联子网络，并利用关联等多种技术提高精度。该方法使用了新的相邻上下文损失，有助于提高在连续帧间实现运动偏移的目标跟踪效果。在DroneCrowd数据集上进行了测试，该数据集包含112个视频剪辑，超过20,000个头部示踪，提供了应对不同场景和条件的测试基准，在各项性能指标上都取得了不错的成绩。`],
    ["这是第一条回复，ddddddddddddddddddddddddddddd",
    "这是第二条回复，eeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    "这是第三条回复，ffffffffffffffffffffffffffffff",]
]

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
} 

const useChat = (chatbotId: number, defaultMessages?: ChatMessage[]) => {
    const [messages, setMessages] = useState(defaultMessages || []);
    const [replyCount, setReplyCount] = useState(0);
    // const chatMutation = trpc.summary.chat.useMutation();

    const loading = useMemo(() => {
        return messages.some(message => message.loading);
    }, [messages]);

    const sendMessage = async (params: z.infer<typeof ChatSchema>) => {
        if (loading) {
            return;
        }
        if (!params.question.length) {
            return;
        }
        const newMessages: ChatMessage[] = [...messages, {
            type: 'text',
            from: 'user',
            content: params.question,
            loading: true,
        }];
        setMessages(newMessages);
        try {
            // const res = await chatMutation.mutateAsync(params);
            newMessages[newMessages.length - 1].loading = false;
            const error = false; // res.status !== 'SUCCESS'
            newMessages[newMessages.length - 1].error = error;
            await sleep(getRandomInt(3000, 4000));
            newMessages.push({
                type: error ? 'text' : 'markdown',
                from: 'system',
                content: reply_messages[chatbotId][replyCount]!,
                loading: false,
            });
            setReplyCount(replyCount + 1);
        } catch (e) {
            newMessages[newMessages.length - 1].loading = false;
            newMessages[newMessages.length - 1].error = false;
            newMessages.push({
                type: 'text',
                from: 'system',
                content: e instanceof TRPCClientError ? e.message : '网络异常，请重试',
                loading: false,
            });
        } finally {
            setMessages([...newMessages]);
        }
    }

    return {
        messages,
        setMessages,
        loading,
        sendMessage
    }
}
export default useChat;