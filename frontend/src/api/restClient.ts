/**
 * Base REST Client for HTTP requests
 */

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/** バックエンドから返される検証エラーを保持するカスタムエラークラス */
export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly messages: string[],
    public readonly raw: unknown,
  ) {
    super(`API Error ${statusCode}: ${messages.join(', ')}`);
    this.name = 'ApiError';
  }
}

export class RestClient {
  protected baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Performs a GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * Performs a POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Performs a PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Performs a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Core request method
   */
  protected async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = { message: response.statusText };
      }
      const rawMessages = (body as Record<string, unknown>)?.message;
      const messages: string[] = Array.isArray(rawMessages)
        ? rawMessages.map(String)
        : [String(rawMessages ?? response.statusText)];
      throw new ApiError(response.status, messages, body);
    }

    const data: T = await response.json();
    return data;
  }
}
