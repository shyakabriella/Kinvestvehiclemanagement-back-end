export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface MessageResponse {
  message: string;
}
