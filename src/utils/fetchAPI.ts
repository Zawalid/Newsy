export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<APIResult<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const result = await response.json();

    // Our API always returns either {success: true, data: ...} or {success: false, error: ...}
    return result;
  } catch (error: any) {
    // Handle network errors or JSON parsing errors
    return {
      success: false,
      error: { message: error.message || 'Network error', code: 500, type: 'NetworkError' },
    };
  }
}
