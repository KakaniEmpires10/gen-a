"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { useState } from "react";
import { MemberInfo } from "../tableSubDept/Column";

export const MembersAvatars = ({ members, subDepartmentName }: { members: MemberInfo[], subDepartmentName: string }) => {
    const [open, setOpen] = useState(false);

    if (!members || members.length === 0) {
        return (
            <Badge variant="soft-destructive" className="font-normal">
                Belum ada anggota
            </Badge>
        );
    }

    const displayMembers = members.slice(0, 4);
    const remainingCount = members.length - 4;

    return (
        <div className="flex items-center rounded-full bg-muted p-0.5 w-fit">
            <TooltipProvider delayDuration={200}>
                <div className="flex -space-x-3">
                    {displayMembers.map((member, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <div className="relative h-10 w-10 rounded-full ring-2 ring-primary overflow-hidden bg-background cursor-pointer hover:ring-secondary transition-all">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-semibold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent showArrow className="dark px-2 py-1 text-xs">
                                <p className="font-medium">{member.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>

            {remainingCount > 0 && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-full bg-transparent px-3 text-xs text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
                        >
                            +{remainingCount}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Daftar Anggota</DialogTitle>
                            <DialogDescription>
                                Anggota dari {subDepartmentName}
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[400px] pr-4">
                            <div className="space-y-3">
                                {members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-background ring-2 ring-muted flex-shrink-0">
                                            {member.image ? (
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-base font-semibold">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Anggota #{index + 1}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};