"use client";

import "./tiptap.css";
import { useEditor, EditorContent, type Extension } from "@tiptap/react";
import { getMiniExtensions } from "./extensions/index";
import { ToolbarProvider } from "./toolbars/toolbar-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BoldToolbar } from "./toolbars/bold";
import { ItalicToolbar } from "./toolbars/italic";
import { UnderlineToolbar } from "./toolbars/underline";
import { LinkToolbar } from "./toolbars/link";
import { BulletListToolbar } from "./toolbars/bullet-list";
import { OrderedListToolbar } from "./toolbars/ordered-list";
import { UndoToolbar } from "./toolbars/undo";
import { RedoToolbar } from "./toolbars/redo";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SearchAndReplaceToolbar } from "./toolbars/search-and-replace-toolbar";

interface TiptapMiniEditorProps {
    value?: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    error?: boolean;
}

export function TiptapMiniEditor({ value = "", onChange, placeholder, className, error = false }: TiptapMiniEditorProps) {
    const [charCount, setCharCount] = useState(0)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: getMiniExtensions(placeholder) as Extension[],
        content: value,
        editorProps: {
            attributes: {
                class: "mini-editor focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            setCharCount(editor.getText().length)
            onChange(editor.getHTML());
        },
        onCreate: ({ editor }) => {
            setCharCount(editor.getText().length)
        }
    });

    if (!editor) return null;

    return (
        <div className={cn(
            "tiptap-mini-wrapper group flex flex-col w-full rounded-md border bg-background focus-within:ring-1 focus-within:ring-ring transition-all",
            error ? "border-destructive" : "border-input",
            className
        )}>
            <ToolbarProvider editor={editor}>
                <TooltipProvider>
                    <div className="flex items-center gap-0.5 border-b bg-muted/30 p-1">
                        <div className="flex items-center">
                            <UndoToolbar />
                            <RedoToolbar />
                        </div>

                        <div className="mx-1 h-4 w-[1px] bg-border" />

                        <div className="flex items-center">
                            <BoldToolbar />
                            <ItalicToolbar />
                            <UnderlineToolbar />
                        </div>

                        <div className="mx-1 h-4 w-[1px] bg-border" />

                        <div className="flex items-center">
                            <BulletListToolbar />
                            <OrderedListToolbar />
                            <LinkToolbar />
                        </div>
                        <div className="ml-auto">
                            <SearchAndReplaceToolbar />
                        </div>
                    </div>
                </TooltipProvider>
            </ToolbarProvider>

            {/* Area Ketik */}
            <EditorContent
                editor={editor}
                className="min-h-[160px] p-3 prose prose-sm dark:prose-invert max-w-none focus:outline-none"
            />

            {/* Info Footer (Character Count) */}
            <div className="flex justify-end border-t bg-muted/10 px-3 py-1">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {charCount} Karakter
                </span>
            </div>
        </div>
    );
}