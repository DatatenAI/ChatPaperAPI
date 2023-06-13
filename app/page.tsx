'use client';
import {trpc} from "@/lib/trpc";
import {Button} from "@/ui/button";

export default function Home() {

    const articlesQuery = trpc.weapp.getArticles.useQuery();

    const test = () => {
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            Index page
            <Button onClick={test}>test</Button>
        </main>
    )
}
