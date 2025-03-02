import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'User registered successfully',
  });
});
