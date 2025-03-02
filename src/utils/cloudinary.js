import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (file) => {
  if (!file?.path) {
    throw new Error('Invalid file');
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto',
    });

    await fs
      .unlink(file.path)
      .catch((err) => console.warn('Failed to delete temp file:', err));

    console.log('File uploaded to Cloudinary:', result.secure_url);

    return result;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    fs.unlink(file.path).catch((err) =>
      console.warn('Failed to delete temp file:', err)
    );
    return null;
  }
};
