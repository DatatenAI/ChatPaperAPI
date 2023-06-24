import {Configuration, OpenAIApi} from 'openai';
import prisma from "@/lib/database";


const getApi = async () => {
    const apiKey = await prisma.apiKey.findFirst({
        where: {
            alive: true,
        },
        orderBy: {
            amount: 'asc',
        }
    });
    if (!apiKey) {
        throw new Error("不存在有效KEY");
    }
    return new OpenAIApi(new Configuration({
        apiKey: apiKey.key,
    }));
};

export const queryEmbedding = async (input: string) => {
    const api = await getApi();
    const response = await api.createEmbedding({
        model: "text-embedding-ada-002",
        input
    });
    return response.data.data[0].embedding;
}

const query = async (prompt: string, content: string) => {
    const api = await getApi();
    const res = await api.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.1,
        top_p: 0.95,
        messages: [
            {role: 'system', content: prompt},
            {role: 'user', content}
        ]
    });
    return res.data.choices[0].message?.content;
}

export const queryForChat = async (language: string, question: string) => {
    const prompt = `You are a research scientist proficient in answering queries using succinct and academic language. Your task is to respond to user queries based on results from a vector database search. The content primarily includes a summary of the search results and metadata about the paper. In your reply, retain proper nouns in English while maintaining appropriate academic language. Give a scholarly response in ${language}, but keep the paper title in its original English format.`;
    const content = `
     Here is the search result according to the query: 
        Query:
        ${query}
        Result:
        {db_search_res}
        - Please note, this reply will maintain suitable academic language and retain proper nouns in English. 
        - The scholarly response will be in ${language}
        - keep the paper title in original English format.
     `
    return await query(prompt, content);
}

