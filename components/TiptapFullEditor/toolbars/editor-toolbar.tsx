import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToolbarProvider } from "./toolbar-provider";
import { Editor } from "@tiptap/core";
import { UndoToolbar } from "./undo";
import { RedoToolbar } from "./redo";
import { HeadingsToolbar } from "./headings";
import { BlockquoteToolbar } from "./blockquote";
// import { CodeToolbar } from "./code";
import { BoldToolbar } from "./bold";
import { ItalicToolbar } from "./italic";
import { UnderlineToolbar } from "./underline";
import { StrikeThroughToolbar } from "./strikethrough";
import { LinkToolbar } from "./link";
import { BulletListToolbar } from "./bullet-list";
import { OrderedListToolbar } from "./ordered-list";
import { HorizontalRuleToolbar } from "./horizontal-rule";
import { AlignmentTooolbar } from "./alignment";
import { ImagePlaceholderToolbar } from "./image-placeholder-toolbar";
import { ColorHighlightToolbar } from "./color-and-highlight";
import { SearchAndReplaceToolbar } from "./search-and-replace-toolbar";
import { cn } from "@/lib/utils";
// import { CodeBlockToolbar } from "./code-block";

interface EditorToolbarProps {
    editor: Editor;
    className?: string;
    isFullscreen?: boolean;
}

export const EditorToolbar = ({ editor, className, isFullscreen = false }: EditorToolbarProps) => {
    const ToolbarContent = (
        <div className={cn(
            "flex items-center gap-1 px-2 py-1",
            isFullscreen ? "flex-wrap justify-center" : "min-w-max"
        )}>
            <UndoToolbar />
            <RedoToolbar />
            <Separator orientation="vertical" className="mx-1 h-7" />

            <HeadingsToolbar />
            <BlockquoteToolbar />
            <HorizontalRuleToolbar />
            <Separator orientation="vertical" className="mx-1 h-7" />

            <BoldToolbar />
            <ItalicToolbar />
            <UnderlineToolbar />
            <StrikeThroughToolbar />
            <LinkToolbar />
            <Separator orientation="vertical" className="mx-1 h-7" />

            <BulletListToolbar />
            <OrderedListToolbar />
            <Separator orientation="vertical" className="mx-1 h-7" />

            <AlignmentTooolbar />
            <Separator orientation="vertical" className="mx-1 h-7" />

            <ImagePlaceholderToolbar />
            <ColorHighlightToolbar />

            {!isFullscreen && <div className="flex-1" />}
            <SearchAndReplaceToolbar />
        </div>
    );

    return (
        <div className={cn("w-full",
            !isFullscreen ? "sticky top-0 z-20 bg-background border-b hidden sm:block" : "bg-transparent",
            className
        )}>
            <ToolbarProvider editor={editor}>
                <TooltipProvider>
                    {isFullscreen ? (
                        /* Di Fullscreen, biarkan meluber ke bawah (wrap) */
                        <div className="w-full">
                            {ToolbarContent}
                        </div>
                    ) : (
                        /* Di Normal mode, gunakan ScrollArea */
                        <ScrollArea className="w-full whitespace-nowrap">
                            {ToolbarContent}
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    )}
                </TooltipProvider>
            </ToolbarProvider>
        </div>
    );
};