"use client";

import "./tiptap.css";
import { cn } from "@/lib/utils";
import { Editor, EditorContent, type Extension, useEditor } from "@tiptap/react";
import { TipTapFloatingMenu } from "@/components/TiptapFullEditor/extensions/floating-menu";
import { FloatingToolbar } from "@/components/TiptapFullEditor/extensions/floating-toolbar";
import { EditorToolbar } from "./toolbars/editor-toolbar";
import { useEffect } from "react";
import { getExtensions } from "./extensions";

interface TiptapFullEditorProps {
    className?: string
    value?: string
    error?: boolean
    onChange?: (html: string) => void
    onEditorReady?: (editor: Editor) => void
}

export function TiptapFullEditor({ className, value, error, onChange, onEditorReady }: TiptapFullEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: getExtensions() as Extension[],
        content: value || "",
        editorProps: {
            attributes: {
                class: "max-w-full focus:outline-none",
            },
        },
        onCreate: ({ editor }) => {
            onEditorReady?.(editor)
        },
        onUpdate: ({ editor }) => {
            // do what you want to do with output
            // Update stats
            // saving as text/json/hmtml
            // const text = editor.getHTML();
            onChange?.(editor.getHTML())
        },
    });

    useEffect(() => {
        if (!editor) return
        if (value === undefined) return

        const currentHTML = editor.getHTML()
        if (value !== currentHTML) {
            editor.commands.setContent(value, { emitUpdate: false })
        }
    }, [value, editor])

    if (!editor) return null;

    return (
        <div
            className={cn(
                "relative max-h-[calc(100dvh-6rem)]  w-full overflow-hidden overflow-y-scroll border bg-card pb-[60px] sm:pb-0",
                error ? "border-destructive" : "border-input",
                className
            )}
        >
            <EditorToolbar editor={editor} />
            <FloatingToolbar editor={editor} />
            <TipTapFloatingMenu editor={editor} />
            <EditorContent
                editor={editor}
                className=" min-h-[600px] w-full min-w-full cursor-text sm:p-6"
            />
        </div>
    );
}