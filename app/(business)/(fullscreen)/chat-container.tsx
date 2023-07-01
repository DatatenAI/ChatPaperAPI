import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {AiOutlineLoading} from "@react-icons/all-files/ai/AiOutlineLoading";
import {MdSend} from "@react-icons/all-files/md/MdSend";
import Image from "next/image";
import Logo from '@/public/logo.jpeg'
import {trpc} from "@/lib/trpc";
import {Avatar, AvatarFallback, AvatarImage} from "@/ui/avatar";
import {BiUserCircle} from "@react-icons/all-files/bi/BiUserCircle";
import type {Summary, TaskState} from "@prisma/client";
import {Chat} from "@prisma/client";
import ReactMarkdown from "react-markdown";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/ui/select";
import {languages} from "@/lib/constants";
import {useToast} from "@/ui/use-toast";
import {TRPCClientError} from "@trpc/client";
import ShareDialog from "./share-dialog";
import {Button} from "@/ui/button";
import Link from "next/link";
import {AiOutlineLogin} from "@react-icons/all-files/ai/AiOutlineLogin";
import {ChatMessage} from "@/types";


const ChatContainer: FC<{
    avatar?: string | null;
    summary: Summary | null;
    chats: Pick<Chat, 'question' | 'reply' | 'status'>[];
    language: string;
    taskState?: TaskState;
    logined: boolean;
}> = props => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatContainer = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [language, setLanguage] = useState(props.language);
    const {toast} = useToast();


    const onTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setInputValue(e.currentTarget.value);
        const ele = textareaRef.current;
        if (ele) {
            ele.style.height = 'auto';
            ele.style.height = ele.scrollHeight + 'px';
        }
    };
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const loading = useMemo(() => {
        return messages.some(message => message.loading);
    }, [messages]);


    const disabled = useMemo(() => {
        return props.taskState !== 'SUCCESS' || loading;
    }, [loading, props.taskState]);


    useEffect(() => {
        chatContainer.current?.scrollTo({
            top: chatContainer.current?.scrollHeight,
            behavior: "smooth",
        })
    }, [messages]);


    useEffect(() => {
        const stateMessage: ChatMessage = {
            from: 'system',
            type: 'text',
            content: '正在总结',
            loading: true,
        };
        const newMessages = messages.slice(1);
        if (props.taskState === 'SUCCESS') {
            stateMessage.type = 'markdown';
            stateMessage.loading = false;
            stateMessage.content = props.summary!.basicInfo;
            newMessages.unshift({
                from: 'system',
                type: 'markdown',
                content: props.summary!.content,
                loading: false,
            });
            props.chats.forEach(chat => {
                newMessages.push({
                    type: 'text',
                    from: 'user',
                    content: chat.question,
                    loading: chat.status === 'RUNNING',
                    error: chat.status === 'FAILED',
                });
                if (chat.status === 'SUCCESS') {
                    newMessages.push({
                        type: 'markdown',
                        from: 'system',
                        content: chat.reply!,
                        loading: false,
                    });
                }
            });
        } else if (props.taskState === 'FAIL') {
            stateMessage.type = 'text';
            stateMessage.loading = false;
            stateMessage.content = '总结失败';
        }
        newMessages.unshift(stateMessage)
        setMessages(newMessages);
    }, [props.taskState]);

    const chatMutation = trpc.summary.chat.useMutation();

    const onTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            sendMessage();
        }
    }
    const sendMessage = async () => {
        if (disabled) {
            return;
        }
        if (props.summary && inputValue.trim().length) {
            const newMessages: ChatMessage[] = [...messages, {
                type: 'text',
                from: 'user',
                content: inputValue,
                loading: true,
            }];
            setMessages(newMessages);
            setInputValue('');
            try {
                const res = await chatMutation.mutateAsync({
                    summaryId: props.summary.id,
                    question: inputValue,
                    language
                });
                newMessages[newMessages.length - 1].loading = false;
                const error = res.status === 'SUCCESS'
                newMessages[newMessages.length - 1].error = error;
                newMessages.push({
                    type: error ? 'text' : 'markdown',
                    from: 'system',
                    content: res.reply!,
                    loading: false,
                });
            } catch (e) {
                newMessages[messages.length - 1].loading = false;
                newMessages[messages.length - 1].error = false;
                if (e instanceof TRPCClientError && e.data.code === "TOO_MANY_REQUESTS") {
                    newMessages.push({
                        type: 'text',
                        from: 'system',
                        content: e.message,
                        loading: false,
                    });
                }
            } finally {
                setMessages([...newMessages]);
            }
        }
    }

    return (
        <div className={'relative flex flex-col'}>
            <div className={'w-full py-2  flex items-center  justify-between px-4 border-b shrink-0'}>
                <div className={'flex items-center gap-4'}>
                    <h3 className={'font-medium text-lg flex-shrink-0'}>对话</h3>
                    {
                        props.logined ? <Select onValueChange={setLanguage} value={language}>
                            <SelectTrigger className={'h-8 gap-1 focus:ring-0'}>
                                <SelectValue placeholder="请选择语言"/>
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(language => {
                                    return <SelectItem value={language.value}
                                                       key={language.value}>{language.label}</SelectItem>
                                })}
                            </SelectContent>
                        </Select> : null
                    }
                </div>
                {
                    (props.summary && props.logined) ? <ShareDialog summaryId={props.summary.id}/> : null
                }
            </div>
            <div className={'pb-32 overflow-auto'} ref={chatContainer}>
                {
                    messages.map((message, idx) => {
                        return <div key={idx}
                                    className={`flex p-4 gap-3 text-base md:max-w-2xl  xl:max-w-4xl m-auto ${message.from === 'system' ? '' : 'flex-row-reverse'}`}>
                            {
                                message.from === 'system' ? <Image src={Logo} alt={'logo'}
                                                                   className={'w-10 h-10 rounded'}/> :
                                    <Avatar className={'w-10 h-10'}>
                                        <AvatarImage src={props.avatar || undefined}/>
                                        <AvatarFallback><BiUserCircle/></AvatarFallback>
                                    </Avatar>
                            }

                            <div
                                className={`py-2.5 px-3.5 rounded ${message.from === 'system' ? 'bg-gray-100 text-gray-900' : 'bg-primary-600 text-primary-foreground'}`}>
                                {message.type === 'markdown' ?
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                    : message.content
                                }
                            </div>
                        </div>
                    })
                }
                {
                    props.logined ? null : <div className={'text-center mt-8'}>
                        <Link href={`/sign-in?callbackUrl=${location.pathname}`}>
                            <Button className={'rounded-full'} leftIcon={<AiOutlineLogin/>}>登录开启对话</Button>
                        </Link>
                    </div>
                }
            </div>
            {
                props.logined ? <div className={'w-full bg-white absolute bottom-0 left-0 py-4 space-y-1'}>
                        <p className={'text-sm text-gray-500 text-center'}>每次对话消耗0.5个点数</p>
                        <div
                            className={'w-4/5 rounded-lg py-4 pl-4 pr-0 mx-auto border shadow lg:max-w-2xl xl:max-w-3xl flex relative'}>
                    <textarea ref={textareaRef}
                              onKeyDown={onTextareaKeyDown}
                              value={inputValue}
                              className='w-full pr-10 resize-none flex-grow max-h-48 break-all  focus-visible:outline-none'
                              onInput={onTextareaInput} rows={1}/>
                            <button
                                onClick={sendMessage}
                                className={'absolute bottom-3 right-4 w-8 h-8 p-2 rounded-md disabled:bg-white  disabled:text-gray-400 bg-primary text-white transition-colors disabled:opacity-40'}
                                disabled={disabled}>
                                {
                                    loading ? <AiOutlineLoading className={'animate-spin w-4 h-4'}/>
                                        : <MdSend className={'w-4 h-4'}/>
                                }
                            </button>
                        </div>
                    </div>
                    : null
            }
        </div>
    );
};


export default ChatContainer;