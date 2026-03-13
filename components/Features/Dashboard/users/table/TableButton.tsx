import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteDialog } from "@/provider/DeleteDialogProvider";
import { deleteUsers } from "@/action/UserAction";

const TableButton = ({ id }: { id: string }) => {
    const { openDialog } = useDeleteDialog();

    const handleDelete = () => {
        openDialog({
            id,
            mutateKey: "/api/users",
            action: async (id) => {
                return await deleteUsers(id as string);
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