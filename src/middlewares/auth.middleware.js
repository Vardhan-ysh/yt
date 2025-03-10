import { verify } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Access denied.');
  }

  const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
  const userId = decoded._id;
  req.userId = userId;
  next();
});

export default authMiddleware;
