import { Button } from "@/components/ui/button"
import { PenLine, Trash2 } from "lucide-react"
import { useState } from "react"
import ModalInsert from "../modal/ModalInsert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Partners } from "@prisma/client";
import { useDeleteDialog } from "@/provider/DeleteDialogProvider";
import { deletePartners } from "@/action/MasterAction";

const TableButton = ({ data }: { data: Partners }) => {
    const [openUpdate, setOpenUpdate] = useState(false);
    const { openDialog } = useDeleteDialog();

    const handleDelete = () => {
        openDialog({
            id: data.id,
            mutateKey: "/api/partners",
            action: async (id) => {
                return await deletePartners(id as string);
            },
        });
    }

    const handleUpdate = () => {
        setOpenUpdate(!openUpdate)
    }

    return (
        <>
            <div className="flex items-center gap-1 justify-center">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                rounded="circle"
                                onClick={handleUpdate}
                                size="icon-sm">
                                <PenLine className="size-3" />
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

            <ModalInsert open={openUpdate} onOpenChange={handleUpdate} data={data} />
        </>
    )
}

export default TableButton