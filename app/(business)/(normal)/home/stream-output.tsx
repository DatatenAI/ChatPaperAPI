import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import type {ChatMessage} from "@/hooks/use-chat";

type StreamOutputProps = {
    message: ChatMessage;
    speed?: number;
}

export const StreamOutput: React.FC<StreamOutputProps> = ({ message, speed = 50 }) => {
    const [output, setOutput] = useState<string>('');
    const text = message.content;

    useEffect(() => {
        const interval = setInterval(() => {
            if (output.length < text.length) {
                setOutput((prevOutput) => prevOutput + text.charAt(prevOutput.length));
            } else {
                clearInterval(interval);
            }
        }, speed);

        // Clear the interval when the component is unmounted
        return () => clearInterval(interval);
    }, [text, speed, output]);

    return <div
            className={`py-1.5 px-3 rounded ${message.from === 'system' ? 'bg-gray-100 text-gray-900' : 'bg-primary-600 text-primary-foreground'} text-sm`}>
            {message.type === 'markdown' ?
                <ReactMarkdown>{output}</ReactMarkdown>
                : output
            }
        </div>;
}

export default StreamOutput;