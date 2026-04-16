"use client";
// @ts-nocheck
/* eslint-disable */
import Image from "@tiptap/extension-image";
import {
    type NodeViewProps,
    NodeViewWrapper,
    ReactNodeViewRenderer,
} from "@tiptap/react";
import {
    AlignCenter, AlignLeft, AlignRight, Maximize,
    MoreVertical, Trash, Edit, ImageIcon, Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub,
    DropdownMenuSubContent, DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/use-image-upload";

export const ImageExtension = Image.extend({
    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            width: { default: "100%" },
            height: { default: null },
            align: { default: "center" },
            caption: { default: "" },
            aspectRatio: { default: null },
        };
    },
    addNodeView: () => ReactNodeViewRenderer(TiptapImage),
});

function TiptapImage(props: NodeViewProps) {
    const { node, editor, selected, deleteNode, updateAttributes } = props;
    const imageRef = useRef<HTMLImageElement | null>(null);
    const nodeRef = useRef<HTMLDivElement | null>(null);

    const [resizing, setResizing] = useState(false);
    const [resizingPosition, setResizingPosition] = useState<"left" | "right">("left");
    const [resizeInitialWidth, setResizeInitialWidth] = useState(0);
    const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0);

    const [editingCaption, setEditingCaption] = useState(false);
    const [caption, setCaption] = useState(node.attrs.caption || "");
    const [openedMore, setOpenedMore] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [altText, setAltText] = useState(node.attrs.alt || "");

    // Hook upload — onUpload langsung update src node yang sama
    const { fileInputRef, handleFileChange, uploading, progress, error } = useImageUpload({
        onUpload: (newUrl) => {
            updateAttributes({
                src: newUrl,
                alt: altText || fileInputRef.current?.files?.[0]?.name || node.attrs.alt,
            });
            setOpenedMore(false);
        },
        onError: (msg) => console.error("Replace image error:", msg),
    });

    // --- Resize logic ---
    function handleResizingPosition({ e, position }: { e: React.MouseEvent; position: "left" | "right" }) {
        e.preventDefault();
        setResizing(true);
        setResizingPosition(position);
        setResizeInitialMouseX(e.clientX);
        if (imageRef.current) setResizeInitialWidth(imageRef.current.offsetWidth);
    }

    function resize(event: MouseEvent) {
        if (!resizing) return;
        let dx = event.clientX - resizeInitialMouseX;
        if (resizingPosition === "left") dx = resizeInitialMouseX - event.clientX;
        const newWidth = Math.max(resizeInitialWidth + dx, 150);
        const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;
        if (newWidth < parentWidth) updateAttributes({ width: newWidth });
    }

    function endResize() {
        setResizing(false);
        setResizeInitialMouseX(0);
        setResizeInitialWidth(0);
    }

    function handleTouchStart(event: React.TouchEvent, position: "left" | "right") {
        event.preventDefault();
        setResizing(true);
        setResizingPosition(position);
        setResizeInitialMouseX(event.touches[0]?.clientX ?? 0);
        if (imageRef.current) setResizeInitialWidth(imageRef.current.offsetWidth);
    }

    function handleTouchMove(event: TouchEvent) {
        if (!resizing) return;
        let dx = (event.touches[0]?.clientX ?? resizeInitialMouseX) - resizeInitialMouseX;
        if (resizingPosition === "left") dx = resizeInitialMouseX - (event.touches[0]?.clientX ?? resizeInitialMouseX);
        const newWidth = Math.max(resizeInitialWidth + dx, 150);
        const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;
        if (newWidth < parentWidth) updateAttributes({ width: newWidth });
    }

    function handleTouchEnd() {
        setResizing(false);
        setResizeInitialMouseX(0);
        setResizeInitialWidth(0);
    }

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", endResize);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleTouchEnd);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", endResize);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [resizing, resizeInitialMouseX, resizeInitialWidth]);

    // --- Caption ---
    const handleCaptionBlur = () => { updateAttributes({ caption }); setEditingCaption(false); };
    const handleCaptionKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleCaptionBlur(); };

    // --- URL replace ---
    const handleImageUrlSubmit = () => {
        if (!imageUrl) return;
        updateAttributes({ src: imageUrl, alt: altText });
        setImageUrl(""); setAltText(""); setOpenedMore(false);
    };

    return (
        <NodeViewWrapper
            ref={nodeRef}
            className={cn(
                "relative flex flex-col rounded-md border-2 border-transparent transition-all duration-200",
                selected && "border-blue-300",
                node.attrs.align === "left" && "left-0 -translate-x-0",
                node.attrs.align === "center" && "left-1/2 -translate-x-1/2",
                node.attrs.align === "right" && "left-full -translate-x-full"
            )}
            style={{ width: node.attrs.width }}
        >
            <div className={cn("group relative flex flex-col rounded-md")}>
                <figure className="relative m-0">
                    <img
                        ref={imageRef}
                        src={node.attrs.src}
                        alt={node.attrs.alt}
                        title={node.attrs.title}
                        className="rounded-lg transition-shadow duration-200 hover:shadow-lg"
                        onLoad={(e) => {
                            const img = e.currentTarget;
                            updateAttributes({ aspectRatio: img.naturalWidth / img.naturalHeight });
                        }}
                    />

                    {editor?.isEditable && (
                        <>
                            {/* Resize handles */}
                            <div
                                className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-start p-2"
                                style={{ left: 0 }}
                                onMouseDown={(e) => handleResizingPosition({ e, position: "left" })}
                                onTouchStart={(e) => handleTouchStart(e, "left")}
                            >
                                <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
                            </div>
                            <div
                                className="absolute inset-y-0 z-20 flex w-[25px] cursor-col-resize items-center justify-end p-2"
                                style={{ right: 0 }}
                                onMouseDown={(e) => handleResizingPosition({ e, position: "right" })}
                                onTouchStart={(e) => handleTouchStart(e, "right")}
                            >
                                <div className="z-20 h-[70px] w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
                            </div>
                        </>
                    )}
                </figure>

                {/* Caption */}
                {editingCaption ? (
                    <Input
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        onBlur={handleCaptionBlur}
                        onKeyDown={handleCaptionKeyDown}
                        className="mt-2 text-center text-sm text-muted-foreground"
                        placeholder="Add a caption..."
                        autoFocus
                    />
                ) : (
                    <div
                        className="mt-2 cursor-text text-center text-sm text-muted-foreground"
                        onClick={() => editor?.isEditable && setEditingCaption(true)}
                    >
                        {caption || "Add a caption..."}
                    </div>
                )}

                {/* Toolbar */}
                {editor?.isEditable && (
                    <div className={cn(
                        "absolute right-4 top-4 flex items-center gap-1 rounded-md border bg-background/80 p-1 opacity-0 backdrop-blur transition-opacity",
                        !resizing && "group-hover:opacity-100",
                        openedMore && "opacity-100"
                    )}>
                        {/* Align buttons */}
                        {(["left", "center", "right"] as const).map((align) => {
                            const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
                            return (
                                <Button
                                    key={align}
                                    size="icon"
                                    className={cn("size-7", node.attrs.align === align && "bg-accent")}
                                    variant="ghost"
                                    onClick={() => updateAttributes({ align })}
                                >
                                    <Icon className="size-4" />
                                </Button>
                            );
                        })}

                        <Separator orientation="vertical" className="h-[20px]" />

                        <DropdownMenu open={openedMore} onOpenChange={setOpenedMore}>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon" className="size-7" variant="ghost">
                                    <MoreVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" alignOffset={-90} className="mt-1 text-sm">
                                <DropdownMenuItem onClick={() => setEditingCaption(true)}>
                                    <Edit className="mr-2 size-4" /> Edit Caption
                                </DropdownMenuItem>

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        <ImageIcon className="mr-2 size-4" /> Replace Image
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-fit min-w-52 p-2">
                                        <div className="space-y-4">
                                            {/* Upload section */}
                                            <div>
                                                <p className="mb-2 text-xs font-medium">Upload Image</p>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="replace-image-upload"
                                                />
                                                <label
                                                    htmlFor="replace-image-upload"
                                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 hover:bg-accent"
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span>{progress}%</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="h-4 w-4" />
                                                            <span>Choose Image</span>
                                                        </>
                                                    )}
                                                </label>
                                                {/* Progress bar */}
                                                {uploading && (
                                                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-200"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                )}
                                                {error && (
                                                    <p className="mt-2 text-xs text-destructive">{error}</p>
                                                )}
                                            </div>

                                            {/* URL section */}
                                            <div>
                                                <p className="mb-2 text-xs font-medium">Or use URL</p>
                                                <div className="space-y-2">
                                                    <Input
                                                        value={imageUrl}
                                                        onChange={(e) => setImageUrl(e.target.value)}
                                                        placeholder="Enter image URL..."
                                                        className="text-xs"
                                                    />
                                                    <Button
                                                        onClick={handleImageUrlSubmit}
                                                        className="w-full"
                                                        disabled={!imageUrl}
                                                        size="sm"
                                                    >
                                                        Replace with URL
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Alt text */}
                                            <div>
                                                <p className="mb-2 text-xs font-medium">Alt Text</p>
                                                <Input
                                                    value={altText}
                                                    onChange={(e) => setAltText(e.target.value)}
                                                    placeholder="Alt text (optional)"
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuItem
                                    onClick={() => {
                                        const ar = node.attrs.aspectRatio;
                                        if (ar) {
                                            const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;
                                            updateAttributes({ width: parentWidth, height: parentWidth / ar });
                                        }
                                    }}
                                >
                                    <Maximize className="mr-2 size-4" /> Full Width
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={deleteNode}
                                >
                                    <Trash className="mr-2 size-4" /> Delete Image
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}