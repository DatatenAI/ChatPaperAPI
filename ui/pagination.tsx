import {Button} from "./button"
import {BiChevronRight} from "react-icons/bi";
import {useMemo} from "react";
import {cn} from "@/lib/cn";
import {AiOutlineArrowLeft, AiOutlineArrowRight} from "react-icons/ai";

export type PaginationProps = {
    current: number;
    size: number;
    total?: number;
    onPageChange: (page: number) => void
    onSizeChange: (size: number) => void
}

const DOTS = '...';

const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({length}, (_, idx) => idx + start);
};
export const Pagination = ({
                               current, size, total = 0, onPageChange, onSizeChange
                           }: PaginationProps) => {

    const totalPage = useMemo(() => {
        return Math.ceil(total / size);
    }, [size, total]);

    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(total / size);
        const siblingCount = 1;
        const totalPageNumbers = siblingCount + 5;


        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount);
        }

        const leftSiblingIndex = Math.max(current - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            current + siblingCount,
            totalPageCount
        );


        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, DOTS, totalPageCount];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }
        let middleRange = range(leftSiblingIndex, rightSiblingIndex);
        const finalRange: (number | string)[] = [firstPageIndex, ...middleRange, lastPageIndex];
        if (shouldShowLeftDots) {
            finalRange.splice(1, 0, DOTS);
        }
        if (shouldShowRightDots) {
            finalRange.splice(finalRange.length - 1, 0, DOTS);
        }
        return finalRange;
    }, [total, size, current]);


    const previousPage = () => {
        onPageChange(current - 1)
    };

    const nextPage = () => {
        onPageChange(current + 1)
    };


    if (!total) {
        return null;
    }

    return <div className="flex items-center justify-between">
        <Button
            variant="outline"
            onClick={previousPage}
            disabled={current < 2}
            leftIcon={<AiOutlineArrowLeft/>}
        >
            上一页
        </Button>
        <ul className={'inline-flex  -space-x-px'}>
            {paginationRange.map((pageNumber, idx) => {
                if (pageNumber === DOTS) {
                    return <li className={'w-10 h-10  inline-flex items-center justify-center border font-medium text-sm'} key={pageNumber}>&#8230;</li>;
                } else {
                    return (
                        <li key={pageNumber}
                            className={cn(`w-10 h-10 inline-flex items-center justify-center cursor-pointer border hover:bg-accent font-medium text-sm`, {
                                'rounded-l': idx === 0,
                                'rounded-r': idx === paginationRange.length - 1,
                                'bg-accent': current === pageNumber
                            })}
                            data-active={pageNumber === current}
                            onClick={() => onPageChange(pageNumber as number)}
                        >
                            {pageNumber}
                        </li>
                    );
                }
            })}
        </ul>
        <Button
            variant="outline"
            onClick={nextPage}
            disabled={current >= totalPage}
            rightIcon={<AiOutlineArrowRight/>}
        >
            下一页
        </Button>
    </div>;
};
