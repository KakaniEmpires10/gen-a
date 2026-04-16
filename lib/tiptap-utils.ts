import { type Editor } from "@tiptap/core";
import { parse } from "node-html-parser";

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME =
  "node-handles-selected-style";

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export const duplicateContent = (editor: Editor) => {
  const { view } = editor;
  const { state } = view;
  const { selection } = state;

  editor
    .chain()
    .insertContentAt(
      selection.to,
      /* eslint-disable */
      // @ts-nocheck
      selection.content().content.firstChild?.toJSON(),
      {
        updateSelection: true,
      },
    )
    .focus(selection.to)
    .run();
};

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) {
    return str;
  }
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    return null;
  }
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}

/** Ekstrak semua src gambar dari Tiptap HTML content */
export function extractCloudinaryUrlsFromContent(content: unknown): string[] {
  if (!content || typeof content !== "string") return [];

  const root = parse(content);
  const images = root.querySelectorAll("img");

  return images
    .map(img => img.getAttribute("src") ?? "")
    .filter(src => src.includes("res.cloudinary.com"));
}

export function replaceUrlsInContent(
  content: string,
  urlMap: Map<string, string>,
): string {
  let result = content;
  urlMap.forEach((newUrl, oldUrl) => {
    result = result.replaceAll(oldUrl, newUrl);
  });
  return result;
}