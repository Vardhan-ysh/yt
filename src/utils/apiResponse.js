class ApiResponse {
  constructor(statusCode, message = 'Success', data = {}) {
    if (
      typeof statusCode !== 'number' ||
      statusCode < 100 ||
      statusCode > 599
    ) {
      console.error('Invalid statusCode:', statusCode);
      statusCode = 500;
    }

    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}

export { ApiResponse };
