import { deleteNews } from "@/action/NewsAction";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteDialog } from "@/provider/DeleteDialogProvider";
import { ExternalLink, Eye, PenLine, Trash2 } from "lucide-react";
import Link from "next/link";

const TableButton = ({ id, link, isExternal }: { id: string, link: string, isExternal: boolean }) => {
    const { openDialog } = useDeleteDialog();

    const handleDelete = () => {
        openDialog({
            id,
            mutateKey: "/api/news",
            action: async (id) => {
                return await deleteNews(id as string);
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
                                variant="success"
                            >
                                <Link href={isExternal ? link : `/news/${link}`} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
                                    {isExternal ? <ExternalLink className="size-3" /> : <Eye className="size-3" />}
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark px-2 py-1 text-xs" showArrow>
                            View
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                asChild
                                rounded="circle"
                                size="icon-sm"
                            >
                                <Link href={`/dashboard/news/edit/${id}`}>
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