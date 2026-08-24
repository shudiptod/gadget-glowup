import apiClient from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

export function useUpload() {
  return useMutation({
    mutationFn: async ({ file, folder = "default" }: { file: File; folder?: string }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<{ success: boolean; url: string }>(
        `/upload/customer?folder=${folder}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.url;
    },
    onError: (error: any) => {
      console.error("Upload Hook Error:", error);
      toast.error("Failed to upload image");
    },
  });
}
