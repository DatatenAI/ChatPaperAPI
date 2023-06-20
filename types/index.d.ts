import {RowData} from "@tanstack/table-core";

type AsyncComponent<T = {}> = (props: {
    children?: ReactNode;
} & T) => JSX.Element | Promise<JSX.Element>

export type Layout = AsyncComponent;


export type Page = (props: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => JSX.Element | Promise<JSX.Element>


export type ErrorPage = (props: {
    error: Error;
    reset: () => void;
}) => JSX.Element

export type Api<T = {}> = (req: NextRequest, context: { params: T }) => Promise<Response>

export type PaginationType = {
    current: number;
    size: number;
    total: number;
};

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        className?: string
    }
}
