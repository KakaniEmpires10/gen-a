import { Button } from "@/components/ui/button"
import { PenLine, Trash2 } from "lucide-react"
import { useState } from "react"
import ModalInsert from "../modal/ModalInsert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tags } from "@prisma/client";
import { useDeleteDialog } from "@/provider/DeleteDialogProvider";
import { deleteTags } from "@/action/MasterAction";

const TableButton = ({ data }: { data: Tags }) => {
    const [openUpdate, setOpenUpdate] = useState(false);
    const { openDialog } = useDeleteDialog();

    const handleDelete = () => {
        openDialog({
            id: data.id,
            mutateKey: "/api/tags",
            action: async (id) => {
                return await deleteTags(id as string);
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
                                onClick={handleUpdate}
                                size="icon-sm"
                                rounded="circle"
                                >
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
                                onClick={handleDelete}
                                size="icon-sm"
                                variant="destructive"
                                rounded="circle"
                                >
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