import { ImageExtension } from "./image";
import { ImagePlaceholder } from "./image-placeholder";
import SearchAndReplace from "./search-and-replace";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export function getExtensions() {
  return [
    StarterKit.configure({
      orderedList: { HTMLAttributes: { class: "list-decimal" } },
      bulletList: { HTMLAttributes: { class: "list-disc" } },
      heading: { levels: [1, 2, 3, 4] },
    }),
    Placeholder.configure({
      emptyNodeClass: "is-editor-empty",
      placeholder: ({ node }) => {
        switch (node.type.name) {
          case "heading":
            return `Heading ${node.attrs.level}`;
          case "detailsSummary":
            return "Section title";
          case "codeBlock":
            return "";
          default:
            return "Tulis konten berita di sini, ketik '/' untuk perintah...";
        }
      },
      includeChildren: false,
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TextStyle,
    Subscript,
    Superscript,
    Color,
    Highlight.configure({ multicolor: true }),
    ImageExtension,
    ImagePlaceholder,
    SearchAndReplace,
    Typography,
  ];
}

export const getMiniExtensions = (placeholder?: string) => [
  StarterKit.configure({
    codeBlock: false,
    blockquote: false,
    heading: false,
  }),
  Placeholder.configure({
    placeholder: placeholder || "Tulis bio singkat di sini...",
  })
];