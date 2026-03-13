import { FileWithPreview } from "@/hooks/use-file-upload";
import toast from "react-hot-toast";

interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export const uploadToCloudinaryClient = async (
  files: FileWithPreview[],
  toastId: string,
  folder: string = "profile",
  required: boolean = false,
  existingUrl?: string | null,
): Promise<UploadResponse> => {
  // Cek apakah ada file asli di dalam array (asumsi properti .file)
  const fileItem = files?.[0];
  const hasNewFile = fileItem?.file instanceof File;

  // 1. Validasi Required
  if (required && !hasNewFile && !existingUrl) {
    return {
      success: false,
      message: `Gambar ${folder} wajib di-upload!`,
    };
  }

  // 2. Jika tidak ada file baru tapi tidak required (misal saat edit saja tanpa ganti gambar)
  if (!hasNewFile) {
    return { success: true, url: existingUrl || undefined };
  }

  return new Promise(resolve => {
    const formData = new FormData();
    formData.append("file", files[0].file as File);
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
        const percent = Math.round((event.loaded / event.total) * 100);
        toast.loading(`Mengupload Gambar ${folder}: ${percent}%`, { id: toastId });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          success: true,
          url: response.secure_url,
        });
      } else {
        resolve({
          success: false,
          message: `Gagal mengunggah gambar ${folder} ke server`,
        });
      }
    };

    xhr.onerror = () => {
      resolve({
        success: false,
        message: `Koneksi internet terputus, gagal mengupload gambar ${folder}`,
      });
    };

    xhr.send(formData);
  });
};