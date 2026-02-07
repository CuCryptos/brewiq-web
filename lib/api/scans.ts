import { api } from "./client";
import type { Scan, ScanResult, ScanType, PaginatedResponse } from "@/lib/types";

// API wraps responses in { success: boolean, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateScanParams {
  image: File;
  scanType: ScanType;
}

export const scansApi = {
  async create(params: CreateScanParams): Promise<Scan> {
    const formData = new FormData();
    formData.append("image", params.image);
    formData.append("scanType", params.scanType);

    const response = await api.post<ApiResponse<Scan>>("/scans", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // Longer timeout for image upload
    });
    return response.data.data;
  },

  async getById(scanId: string): Promise<Scan> {
    const response = await api.get<ApiResponse<Scan>>(`/scans/${scanId}`);
    return response.data.data;
  },

  async getResults(scanId: string): Promise<ScanResult[]> {
    const response = await api.get<ApiResponse<ScanResult[]>>(`/scans/${scanId}/results`);
    return response.data.data;
  },

  async getHistory(page = 1, limit = 20): Promise<PaginatedResponse<Scan>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Scan>>>("/scans", {
      params: { page, limit },
    });
    return response.data.data;
  },

  async delete(scanId: string): Promise<void> {
    await api.delete(`/scans/${scanId}`);
  },

  // Poll for scan status until complete
  async waitForCompletion(scanId: string, maxAttempts = 30, interval = 2000): Promise<Scan> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const scan = await this.getById(scanId);

      if (scan.status === "completed" || scan.status === "failed") {
        return scan;
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error("Scan timed out");
  },
};
