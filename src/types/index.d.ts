// API response interfaces
interface APIError {
  success: false;
  error: {
    message: string;
    code: number;
    type?: string;
    details?: any;
  };
}

interface APISuccess<T> {
  success: true;
  data?: T;
}

type APIResult<T> = APISuccess<T> | APIError;
