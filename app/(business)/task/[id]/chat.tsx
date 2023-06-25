import React, {FC, useRef, useState} from 'react';
import {Button} from "@/ui/button";
import {AiOutlineLoading} from "@react-icons/all-files/ai/AiOutlineLoading";
import {AiOutlineShareAlt} from "@react-icons/all-files/ai/AiOutlineShareAlt";
import {MdSend} from "@react-icons/all-files/md/MdSend";
import Image from "next/image";
import Logo from '@/public/logo.jpeg'
import {trpc} from "@/lib/trpc";

type Message = {
    from: 'system' | 'user';
    type: 'markdown' | 'text';
    content: string;
    id: number;
}
const Chat: FC<{
    disabled?: boolean;
    defaultMessages: [];
}> = props => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const onTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const ele = textareaRef.current;
        if (ele) {
            ele.style.height = 'auto';
            ele.style.height = ele.scrollHeight + 'px';
        }
    };
    const [messages, setMessages] = useState<Message[]>(props.defaultMessages);

    const chatMutation = trpc.summary.chat.useMutation();

    const sendMessage = async () => {

    }

    return (
        <div className={'relative flex flex-col'}>
            <div className={'w-full py-2  flex items-center  justify-between px-4 border-b shrink-0'}>
                <div>
                    <p className={'font-medium text-lg'}>对话</p>
                </div>
                <Button size={"sm"} variant={'ghost'} leftIcon={<AiOutlineShareAlt/>}/>
            </div>
            <div className={'pb-32 overflow-auto'}>
                {
                    messages.map(message => {
                        return <div key={message.id}
                                    className={`'flex p-4 gap-3 text-base md:max-w-2xl  xl:max-w-4xl m-auto ${message.from === 'system' ? '' : 'flex-row-reverse'}`}>
                            <Image src={message.from === 'system' ? Logo : ''} alt={'avatar'}
                                   className={'w-10 h-10 rounded'}/>
                            <div
                                className={`max-w-[90%] py-2.5 px-3.5 rounded ${message.from === 'system' ? 'bg-gray-100 text-gray-900' : 'bg-primary-600 text-primary-foreground'}`}>
                                {message.content}
                            </div>
                        </div>
                    })
                }
                <div
                    className={'flex p-4 gap-3 text-base md:max-w-2xl  xl:max-w-4xl   m-auto'}>
                    <Image src={Logo} alt={'logo'} className={'w-10 h-10 rounded'}/>
                    <div className={'max-w-[90%] bg-gray-100 py-2.5 px-3.5 rounded text-gray-900'}>正在总结</div>
                </div>
                <div
                    className={'flex flex-row-reverse p-4 gap-3 text-base md:max-w-2xl xl:max-w-4xl m-auto'}>
                    <Image src={Logo} alt={'logo'} className={'w-10 h-10 rounded'}/>
                    <div
                        className={'text-sm max-w-[90%] bg-primary text-primary-foreground py-2.5 px-3.5 rounded text-gray-900'}>正在总结
                    </div>
                </div>
            </div>
            <div className={'w-full absolute bottom-0 left-0 py-4 space-y-1'}>
                <p className={'text-sm text-gray-500 text-center'}>每次对话消耗0.5个点数</p>
                <div
                    className={'w-4/5 rounded-lg py-4 pl-4 pr-0 mx-auto border shadow lg:max-w-2xl xl:max-w-3xl flex relative'}>
                    <textarea ref={textareaRef}
                              className='w-full pr-10 resize-none flex-grow max-h-48 break-all  focus-visible:outline-none'
                              onInput={onTextareaInput} rows={1}/>
                    <button
                        className={'absolute bottom-3 right-4 w-8 h-8 p-2 rounded-md disabled:bg-white  disabled:text-gray-400 bg-primary text-white transition-colors disabled:opacity-40'}
                        disabled={props.disabled}>
                        {
                            props.disabled ? <AiOutlineLoading className={'animate-spin w-4 h-4'}/>
                                : <MdSend className={'w-4 h-4'}/>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Chat;