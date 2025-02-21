export class ApiError extends Error {
  constructor(status, message, errors = [], stack = '', success = false) {
    super(message);
    this.status = status;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, ApiError);
    }
    this.message = message;
    this.success = false;
  }
}
