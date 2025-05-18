export const handleGmailError = (error: any): APIError['error'] => {
  let message = 'An unknown error occurred accessing Gmail.';
  let code: number = 500; // Default code

  if (error && typeof error === 'object') {
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
      message = error.errors[0].message || message;
      if (error.errors[0].reason) message += ` (Reason: ${error.errors[0].reason})`;
    } else if (error.message) {
      message = error.message;
    }

    if (typeof error.code === 'number') code = error.code;
    else if (typeof error.status === 'number') code = error.status;

    // Specific checks
    if (
      code === 401 ||
      message.toLowerCase().includes('unauthorized') ||
      message.toLowerCase().includes('invalid credentials')
    ) {
      message = 'Authentication failed. Please reconnect your Gmail account.';
      code = 401;
    } else if (
      code === 403 ||
      code === 429 ||
      message.toLowerCase().includes('rate limit') ||
      message.toLowerCase().includes('quota exceeded')
    ) {
      message = 'Gmail API limit reached. Please wait and try again later.';
      code = 429;
    } else if (
      code === 403 &&
      (message.toLowerCase().includes('access not configured') || message.toLowerCase().includes('api is not enabled'))
    ) {
      message = 'Gmail API access may not be enabled for this project.';
      code = 403;
    } else if (code === 404 || message.toLowerCase().includes('not found')) {
      message = 'The requested resource (e.g., email) was not found.';
      code = 404;
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  // Ensure a code is always set
  if (code === undefined || typeof code !== 'number') {
    code = 500;
  }

  return { message, code };
};
