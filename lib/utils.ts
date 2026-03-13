/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileMetadata } from "@/hooks/use-file-upload";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface FetchError extends Error {
  status?: number;
  info?: any;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, { cache: "no-cache" });

    const contentType = res.headers.get("content-type");

    let data: any = null;
    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const error: FetchError = new Error(
        data?.message || data?.error || "Terjadi kesalahan",
      );
      error.status = res.status;
      error.info = data;
      throw error;
    }

    return data;
  } catch (err: any) {
    // Network error (internet mati, DNS error, dll)
    if (!err.status) {
      const networkError: FetchError = new Error("Server Error");
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
};

export function calculateAge(birthday: Date | string): number {
  const birthDate =
    typeof birthday === "string" ? new Date(birthday) : birthday;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with single dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

export const createInitialFile = (
  url?: string | null,
  id: string = "existing-file",
): FileMetadata[] => {
  if (!url) return [];

  return [
    {
      id,
      name: url.split("/").pop() || "existing-file",
      size: 0,
      type: "image/*",
      url,
    },
  ];
};