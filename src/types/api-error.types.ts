// ========================================
// API Error Types
// ========================================

export interface ApiErrorResponse {
  timestamp: string; // ISO-8601
  status: number;
  error: string; // e.g. "BAD_REQUEST", "NOT_FOUND"
  message: string;
  path: string;
}
