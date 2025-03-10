export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      success: false,
      status: 'error',
      message: error.message,
    });
  }
};

// with promises

// export const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };
