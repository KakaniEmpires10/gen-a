import { Button } from "@/components/ui/button"
import { PenLine, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { useDeleteDialog } from "@/provider/DeleteDialogProvider";
import { deleteMember } from "@/action/MemberAction";

const TableButton = ({ id }: { id: string }) => {
    const { openDialog } = useDeleteDialog();

    const handleDelete = () => {
        openDialog({
            id,
            mutateKey: "/api/members",
            action: async (id) => {
                return await deleteMember(id as string);
            },
        });
    }

    return (
        <>
            <div className="flex items-center gap-1 justify-center">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                rounded="circle"
                                size="icon-sm"
                            >
                                <Link href={`/dashboard/members/edit/${id}`}>
                                    <PenLine className="size-3" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark px-2 py-1 text-xs" showArrow>
                            Edit
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                rounded="circle"
                                onClick={handleDelete}
                                size="icon-sm"
                                variant="destructive">
                                <Trash2 className="size-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark px-2 py-1 text-xs" showArrow>
                            Hapus
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </>
    )
}

export default TableButton