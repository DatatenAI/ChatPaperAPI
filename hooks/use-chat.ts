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
    "这是第一条回复，aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "这是第二条回复，bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "这是第三条回复，ccccccccccccccccccccccccccccccccccccccccccccc",
]

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const useChat = (defaultMessages?: ChatMessage[]) => {
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
            await sleep(getRandomInt(1000, 3000));
            newMessages.push({
                type: error ? 'text' : 'markdown',
                from: 'system',
                content: reply_messages[replyCount]!,
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