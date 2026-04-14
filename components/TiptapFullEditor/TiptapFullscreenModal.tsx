"use client"

import { useEffect, useState } from "react"
import { EditorContent, useEditor, type Extension } from "@tiptap/react"
import { Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { EditorToolbar } from "./toolbars/editor-toolbar"
import { FloatingToolbar } from "./extensions/floating-toolbar"
import { TipTapFloatingMenu } from "./extensions/floating-menu"
import { getExtensions } from "./extensions"

interface TiptapFullscreenModalProps {
    open: boolean
    onClose: () => void
    value: string
    onChange: (html: string) => void
}

export function TiptapFullscreenModal({
    open,
    onClose,
    value,
    onChange,
}: TiptapFullscreenModalProps) {
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: getExtensions() as Extension[],
        content: value || "",
        editorProps: {
            attributes: { class: "max-w-full focus:outline-none" },
        },
        onUpdate: ({ editor }) => {
            const text = editor.getText().trim()
            setWordCount(text ? text.split(/\s+/).length : 0)
            setCharCount(editor.getText().length)
            onChange(editor.getHTML())
        },
        onCreate: ({ editor }) => {
            const text = editor.getText().trim()
            setWordCount(text ? text.split(/\s+/).length : 0)
            setCharCount(editor.getText().length)
        }
    })

    // Saat modal dibuka, sync konten terbaru dari inline editor ke sini
    useEffect(() => {
        if (!editor || !open) return
        const current = editor.getHTML()
        if (value !== current) {
            editor.commands.setContent(value, { emitUpdate: false })
        }
        // Fokus otomatis saat modal terbuka
        setTimeout(() => editor.commands.focus("end"), 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
            <DialogContent
                className="max-w-none max-h-none w-screen h-screen p-0 gap-0 flex flex-col [&>button]:hidden"
            >
                <DialogTitle className="sr-only">Fullscreen Editor</DialogTitle>

                {/* Navbar toolbar — sticky, centered, floating style */}
                <div className="sticky top-0 z-50 flex flex-col items-center px-4 pt-4 pb-2 bg-background/0 pointer-events-none">
                    <div className="relative flex items-start w-full max-w-5xl p-1.5 rounded-2xl border bg-background/95 shadow-xl backdrop-blur-md pointer-events-auto">

                        <div className="flex-1 overflow-hidden">
                            {editor && (
                                <EditorToolbar
                                    editor={editor}
                                    isFullscreen={true}
                                    className="border-none"
                                />
                            )}
                        </div>

                        <div className="flex items-start pt-1 pr-1 border-l ml-1 pl-1">
                            <Button
                                type="button"
                                variant="ghost-destructive"
                                size="icon"
                                onClick={onClose}
                                title="Keluar Fullscreen (Esc)"
                            >
                                <Minimize2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>


                {/* Scrollable writing area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-4xl px-4 py-8">
                        {editor && (
                            <>
                                <FloatingToolbar editor={editor} />
                                <TipTapFloatingMenu editor={editor} />
                                <EditorContent
                                    editor={editor}
                                    className="min-h-[80vh] w-full cursor-text"
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur px-6 py-1.5 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {wordCount} kata
                        &nbsp;·&nbsp;
                        {charCount} karakter
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Tekan <kbd className="rounded border px-1 py-0.5 text-[10px] font-mono bg-muted">Esc</kbd> untuk keluar
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    )
}