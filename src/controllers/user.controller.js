import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, fullName, password } = req.body;

  // Check if any field is missing or empty or password is less than 8 characters
  if (!username || !email || !fullName || !password) {
    throw new ApiError(400, 'All fields are required');
  } else if ([username, email, fullName].some((field) => field.trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  } else if (password.length < 8) {
    return next(
      new ApiError(400, 'Password must be at least 8 characters long')
    );
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, 'User already exists with this email');
  }

  req.files = req.files || {};
  const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

  // Check if the avatar is provided
  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required');
  }

  // Upload the avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = null;
  if (coverImageLocalPath != null) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  if (!avatar) {
    throw new ApiError(400, 'Avatar is required');
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'User creation failed');
  }

  // Send the response
  const response = new ApiResponse(201, 'User registered successfully', {
    user: createdUser,
  });

  res.status(response.statusCode).json(response);
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;

  // Check if email/username and password are provided
  if ((!email && !username) || !password) {
    throw new ApiError(400, 'Email/Username and password are required');
  }

  // Find the user by email
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  // Check if the user exists
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check if the password is correct
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate access and refresh tokens
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  // Save the refresh token to the user document
  user.refreshToken = refreshToken;
  await user.save();

  // Set the refresh token in the cookie
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  const response = new ApiResponse(200, 'User logged in successfully', {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      coverImage: user.coverImage,
    },
  });

  // Send the response
  res
    .status(response.statusCode)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(response);
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);

  // Remove the refresh token from the user document
  user.refreshToken = null;
  await user.save();

  // Clear the cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  };

  const response = new ApiResponse(200, 'User logged out successfully');
  res
    .status(response.statusCode)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(response);
});
