"use client";

import "./tiptap.css";
import { cn } from "@/lib/utils";
import { Editor, EditorContent, type Extension, useEditor } from "@tiptap/react";
import { TipTapFloatingMenu } from "@/components/TiptapFullEditor/extensions/floating-menu";
import { FloatingToolbar } from "@/components/TiptapFullEditor/extensions/floating-toolbar";
import { EditorToolbar } from "./toolbars/editor-toolbar";
import { useEffect } from "react";
import { getExtensions } from "./extensions";

// const extensions = [
//     StarterKit.configure({
//         orderedList: {
//             HTMLAttributes: {
//                 class: "list-decimal",
//             },
//         },
//         bulletList: {
//             HTMLAttributes: {
//                 class: "list-disc",
//             },
//         },
//         heading: {
//             levels: [1, 2, 3, 4],
//         },
//     }),
//     Placeholder.configure({
//         emptyNodeClass: "is-editor-empty",
//         placeholder: ({ node }) => {
//             switch (node.type.name) {
//                 case "heading":
//                     return `Heading ${node.attrs.level}`;
//                 case "detailsSummary":
//                     return "Section title";
//                 case "codeBlock":
//                     // never show the placeholder when editing code
//                     return "";
//                 default:
//                     return "Write, type '/' for commands";
//             }
//         },
//         includeChildren: false,
//     }),
//     TextAlign.configure({
//         types: ["heading", "paragraph"],
//     }),
//     TextStyle,
//     Subscript,
//     Superscript,
//     Underline,
//     Link,
//     Color,
//     Highlight.configure({
//         multicolor: true,
//     }),
//     ImageExtension,
//     ImagePlaceholder,
//     SearchAndReplace,
//     Typography,
// ];

interface TiptapFullEditorProps {
    className?: string
    value?: string
    onChange?: (html: string) => void
    onEditorReady?: (editor: Editor) => void
}

export function TiptapFullEditor({ className, value, onChange, onEditorReady }: TiptapFullEditorProps) {
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