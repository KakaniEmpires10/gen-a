import { useCallback, useEffect, useRef, useState } from "react";

interface UseImageUploadProps {
  onUpload?: (url: string) => void;
  onError?: (error: string) => void;
  folder?: string;
}

export function useImageUpload({
  onUpload,
  onError,
  folder = "/drafts",
}: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloudinary = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        );
        formData.append("folder", folder);

        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          true,
        );

        xhr.upload.onprogress = event => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const res = JSON.parse(xhr.responseText);
            resolve(res.secure_url);
          } else {
            reject(new Error("Gagal mengupload gambar ke server"));
          }
        };

        xhr.onerror = () => reject(new Error("Koneksi terputus saat upload"));

        xhr.send(formData);
      });
    },
    [folder],
  );

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setError(null);
      setProgress(0);

      // Tampilkan preview lokal dulu supaya UX terasa cepat
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      previewRef.current = localUrl;

      setUploading(true);
      try {
        const cloudinaryUrl = await uploadToCloudinary(file);
        // Revoke local URL setelah dapat URL cloudinary
        URL.revokeObjectURL(localUrl);
        previewRef.current = null;
        onUpload?.(cloudinaryUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload gagal";
        setError(message);
        onError?.(message);
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
        setFileName(null);
        previewRef.current = null;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [uploadToCloudinary, onUpload, onError],
  );

  const handleRemove = useCallback(() => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    setPreviewUrl(null);
    setFileName(null);
    previewRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    uploading,
    progress,
    error,
  };
}