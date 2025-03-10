import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import { ApiError } from './ApiError.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    throw new ApiError(500, 'Error uploading file to Cloudinary', error);
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    await fs
      .unlink(filePath)
      .catch((err) => console.warn('Failed to delete temp file:', err));

    console.log('File uploaded to Cloudinary:', result.secure_url);

    return result;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    fs.unlink(filePath).catch((err) =>
      console.warn('Failed to delete temp file:', err)
    );
    throw new ApiError(500, 'Error uploading file to Cloudinary');
  }
};
