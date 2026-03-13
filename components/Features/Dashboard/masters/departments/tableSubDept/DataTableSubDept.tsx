"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, RefreshCw, PlusCircle, AlertCircleIcon } from "lucide-react";
import ModalInsert from "../modalSubDept/ModalInsert";
import useSWR, { mutate } from "swr";
import { TableSubDepartment } from "./Column";
import { SubDepartment } from "@prisma/client";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function DataTableSubDept<TData extends TableSubDepartment, TValue>({
    columns,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [open, setOpen] = useState<boolean>(false);

    const { data: subDepartmentData, isLoading, error, isValidating } = useSWR<SubDepartment[] | []>('/api/sub-departments');

    const handleOpenDialog = () => setOpen(!open);

    const refreshData = () => {
        mutate('/api/sub-departments');
    };

    const handleModalClose = (success: boolean) => {
        setOpen(false);
        if (success) {
            refreshData();
        }
    };

    const table = useReactTable({
        data: subDepartmentData as TData[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    return (
        <>
            <div className="flex items-center justify-between py-4 border-y border-y-primary">
                <div className="relative">
                    <Input
                        placeholder="Filter Departemen..."
                        type="search"
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                    <Search className="absolute size-4 stroke-3 top-1/2 left-2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <div className="flex gap-2">
                    <Button onClick={refreshData} disabled={isValidating} size="icon" variant="outline">
                        <RefreshCw className={`size-4 ${isValidating ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button onClick={handleOpenDialog}>
                        <PlusCircle className="size-4" /> Tambah Departemen
                    </Button>
                </div>
            </div>

            <div className="relative mt-8">
                <Alert className="absolute -top-10 left-0 right-0 w-[95%] m-auto z-[5]">
                    <AlertTitle className="capitalize">Hai user!</AlertTitle>
                    <AlertDescription>
                        Disini nih buat lihat daftar Departemen &nbsp;
                        <span className="font-bold">Gen A</span>
                    </AlertDescription>
                </Alert>

                <div className="overflow-x-auto">
                    <Table className="border-t-4 border-primary border-b-2 w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow className="h-[100px]" key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead className="align-bottom" key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {(isLoading || isValidating && !subDepartmentData) ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center font-bold"
                                    >
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-36 font-bold text-destructive"
                                    >
                                        <div className="flex flex-col w-full gap-3 justify-center items-center">
                                            <div className="bg-destructive/10 p-2 rounded-full">
                                                <AlertCircleIcon className="size-6" />
                                            </div>
                                            {error.message}
                                            <Button variant="soft-destructive" size="sm" onClick={refreshData}><RefreshCw /> Coba Lagi</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        className="whitespace-nowrap xl:whitespace-normal"
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center font-bold"
                                    >
                                        Departemen Tidak Ditemukan
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <ModalInsert open={open} onOpenChange={handleModalClose} />
        </>
    );
}