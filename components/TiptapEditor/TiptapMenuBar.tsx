"use client"

import { Editor } from "@tiptap/react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Code,
    Quote
} from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

// Note: You'll need to install these packages:
// npm install @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-placeholder zod @hookform/resolvers

const linkSchema = z.object({
    href: z.string().url({ message: "Please enter a valid URL" }),
    text: z.string().min(1, { message: "Text is required" }),
})

const imageSchema = z.object({
    src: z.string().url({ message: "Please enter a valid image URL" }),
    alt: z.string().optional(),
})

interface MenuBarProps {
    editor: Editor | null
}

const TiptapMenuBar = ({ editor }: MenuBarProps) => {
    const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false)
    const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false)

    const linkForm = useForm<z.infer<typeof linkSchema>>({
        resolver: zodResolver(linkSchema),
        defaultValues: {
            href: "https://",
            text: "",
        },
    })

    const imageForm = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            src: "https://",
            alt: "",
        },
    })

    const onSubmitLink = (values: z.infer<typeof linkSchema>) => {
        if (editor) {
            if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run()
            } else {
                editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: values.href })
                    .run()
            }
            setIsLinkPopoverOpen(false)
            linkForm.reset()
        }
    }

    const onSubmitImage = (values: z.infer<typeof imageSchema>) => {
        if (editor) {
            editor
                .chain()
                .focus()
                .setImage({
                    src: values.src,
                    alt: values.alt || ''
                })
                .run()
            setIsImagePopoverOpen(false)
            imageForm.reset()
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-wrap items-center gap-1 border-b p-2">
            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    aria-label="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    aria-label="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    aria-label="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    aria-label="Underline"
                >
                    <Underline className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    aria-label="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('orderedList')}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Quote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('codeBlock')}
                    onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                    aria-label="Code Block"
                >
                    <Code className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    aria-label="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    aria-label="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    aria-label="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: 'justify' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
                    aria-label="Justify"
                >
                    <AlignJustify className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('link')}
                            aria-label="Link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Toggle>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <Form {...linkForm}>
                            <form onSubmit={linkForm.handleSubmit(onSubmitLink)} className="space-y-4">
                                <FormField
                                    control={linkForm.control}
                                    name="href"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={linkForm.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Link text" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsLinkPopoverOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Insert Link</Button>
                                </div>
                            </form>
                        </Form>
                    </PopoverContent>
                </Popover>

                <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
                    <PopoverTrigger asChild>
                        <Toggle
                            size="sm"
                            aria-label="Image"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Toggle>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <Form {...imageForm}>
                            <form onSubmit={imageForm.handleSubmit(onSubmitImage)} className="space-y-4">
                                <FormField
                                    control={imageForm.control}
                                    name="src"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/image.jpg" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={imageForm.control}
                                    name="alt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alt Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Image description" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsImagePopoverOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Insert Image</Button>
                                </div>
                            </form>
                        </Form>
                    </PopoverContent>
                </Popover>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default TiptapMenuBar