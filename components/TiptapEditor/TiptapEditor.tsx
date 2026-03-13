"use client"

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { cn } from "@/lib/utils"
import TiptapMenuBar from './TiptapMenuBar'

export interface TiptapEditorProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    error?: boolean
    className?: string
    editorClassName?: string
    disableMenuBar?: boolean
    loading?: boolean
}

const TiptapEditor = ({
    value = '',
    onChange,
    placeholder = 'Mulai menulis...',
    error = false,
    className,
    editorClassName,
    disableMenuBar = false,
    loading = false,
}: TiptapEditorProps) => {
    const [isMounted, setIsMounted] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 hover:text-primary/80',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-md mx-auto my-4',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none',
            }),
            Underline,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(
                    'prose dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none',
                    error ? 'prose-stone' : 'prose-slate',
                    editorClassName
                ),
                'data-placeholder': placeholder,
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    // Handle Next.js hydration
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Sync content with external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!isMounted) {
        return null
    }

    return (
        <div
            className={cn(
                "relative flex flex-col w-full rounded-md border",
                error ? "border-destructive ring-destructive/50" : "border-input",
                loading && "opacity-60 cursor-not-allowed",
                className
            )}
        >
            {!disableMenuBar && <TiptapMenuBar editor={editor} />}
            <EditorContent
                editor={editor}
                disabled={loading}
                className="w-full overflow-hidden"
            />
        </div>
    )
}

export default TiptapEditor