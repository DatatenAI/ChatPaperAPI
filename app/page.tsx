'use client';
import {trpc} from "@/utils/trpc";

export default function Home() {
    const articlesQuery = trpc.weapp.getArticles.useQuery();
    const test = ()=>{
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Index page
            <button onClick={test}>test</button>
        </main>
    )
}
