export interface ApiRequestParams {
    url: string; // API endpoint
    method?: "GET" | "POST" | "PUT" | "DELETE"; // HTTP method
    body?: Record<string, any>; // Request payload
    headers?: Record<string, string>; // Additional headers
  }
  
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export const apiRequest = async <T = any>({
    url,
    method = "GET",
    body,
    headers = {},
  }: ApiRequestParams): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include", // Include cookies for authentication
      });
  
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP Error: ${response.status} - ${response.statusText}`,
        };
      }
  
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: `Network Error: ${error.message}`,
      };
    }
  };
  
