// Frontend-only mode - store files as base64 data URLs
export interface UploadedFile {
  filename: string;
  path: string;
  size: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: UploadedFile | UploadedFile[];
}

// Convert file to base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadService = {
  /**
   * Tek bir resim yükle - Frontend-only mode: convert to base64
   */
  async uploadImage(file: File): Promise<UploadedFile> {
    // Convert to base64
    const base64 = await fileToBase64(file);
    
    const uploadedFile: UploadedFile = {
      filename: file.name,
      path: base64, // Store as data URL
      size: file.size,
    };

    return uploadedFile;
  },

  /**
   * Birden fazla resim yükle - Frontend-only mode: convert to base64
   */
  async uploadImages(files: File[]): Promise<UploadedFile[]> {
    const uploadedFiles: UploadedFile[] = [];
    
    for (const file of files) {
      const base64 = await fileToBase64(file);
      uploadedFiles.push({
        filename: file.name,
        path: base64, // Store as data URL
        size: file.size,
      });
    }

    return uploadedFiles;
  },

  /**
   * Yüklenen dosyayı sil - Frontend-only mode: no-op
   */
  async deleteFile(filename: string): Promise<void> {
    // Frontend-only mode: nothing to delete on server
    console.log('File deletion skipped in frontend-only mode:', filename);
  },

  /**
   * Dosya yolunu tam URL'ye dönüştür - Frontend-only mode: return as is
   */
  getFileUrl(path: string): string {
    // If already a data URL or http URL, return as is
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // For other paths, assume it's a valid URL
    return path;
  },
};

