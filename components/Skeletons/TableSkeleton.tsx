// components/ui/table-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

interface TableSkeletonProps {
    rows?: number
    cols: number
    rowHeight?: string
}

export function TableSkeleton({ rows = 6, cols, rowHeight = "h-12" }: TableSkeletonProps) {
    return (
        Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx} className="whitespace-nowrap xl:whitespace-normal">
                {Array.from({ length: cols }).map((_, colIdx) => (
                    <TableCell key={colIdx}>
                        <Skeleton className={`w-full ${rowHeight} rounded-md`} />
                    </TableCell>
                ))}
            </TableRow>
        ))
    )
}