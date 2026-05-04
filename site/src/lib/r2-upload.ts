const R2_UPLOAD_URL = import.meta.env.VITE_R2_UPLOAD_URL || "";

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadToR2(file: File, folder = "images"): Promise<UploadResult> {
  if (!R2_UPLOAD_URL) {
    return uploadAsDataUrl(file);
  }

  const ext = file.name.split(".").pop() || "bin";
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const response = await fetch(`${R2_UPLOAD_URL}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, contentType: file.type }),
  });

  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { uploadUrl, publicUrl } = await response.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload to R2 failed");
  }

  return { url: publicUrl, key };
}

async function uploadAsDataUrl(file: File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      resolve({ url, key: `local-${Date.now()}` });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
  const r2Base = import.meta.env.VITE_R2_PUBLIC_URL || "";
  return r2Base ? `${r2Base}/${path}` : path;
}
