/**
 * Cloudinary Configuration & Utilities
 * 
 * Server-side utilities for interacting with Cloudinary API
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Type definitions for Cloudinary resources
 */
export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  folder?: string;
  context?: {
    custom?: {
      alt?: string;
      caption?: string;
      category?: string;
    };
  };
}

export interface GalleryImage {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  alt: string;
  aspect: 'tall' | 'wide' | 'square';
  category?: string;
}

/**
 * Get all videos from Cloudinary
 */
export async function getAllVideos(maxResults: number = 10): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.search
      .expression('resource_type:video')
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .with_field('context')
      .execute();

    return result.resources as CloudinaryImage[];
  } catch (error) {
    console.error('Error fetching videos from Cloudinary:', error);
    return [];
  }
}

/**
 * Get all images from Cloudinary (no folder filter)
 *
 * @param maxResults - Maximum number of results to return
 */
export async function getAllImages(maxResults: number = 50): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.search
      .expression('resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .with_field('context')
      .execute();

    return result.resources as CloudinaryImage[];
  } catch (error) {
    console.error('Error fetching all images from Cloudinary:', error);
    return [];
  }
}

/**
 * Get all images from Cloudinary (root folder or specific folder)
 * 
 * @param folder - The folder path in Cloudinary (empty string for root)
 * @param maxResults - Maximum number of results to return
 */
export async function getImagesFromFolder(
  folder: string = '',
  maxResults: number = 50
): Promise<CloudinaryImage[]> {
  try {
    // Search for images - if no folder specified, get all images
    const expression = folder 
      ? `folder:${folder}/* AND resource_type:image`
      : 'resource_type:image';
    
    const result = await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .with_field('context')
      .execute();

    return result.resources as CloudinaryImage[];
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error);
    return [];
  }
}

/**
 * Get images with a specific tag
 * 
 * @param tag - The tag to search for (e.g., 'gallery', 'before-after')
 */
export async function getImagesByTag(tag: string): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.search
      .expression(`tags:${tag}`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .with_field('context')
      .execute();

    return result.resources as CloudinaryImage[];
  } catch (error) {
    console.error('Error fetching images by tag:', error);
    return [];
  }
}

/**
 * Determine aspect ratio category based on image dimensions
 */
function getAspectRatio(width: number, height: number): 'tall' | 'wide' | 'square' {
  const ratio = width / height;
  
  if (ratio > 1.3) return 'wide';
  if (ratio < 0.77) return 'tall';
  return 'square';
}

/**
 * Transform Cloudinary resources to gallery-friendly format
 */
export function transformToGalleryImages(images: CloudinaryImage[]): GalleryImage[] {
  return images.map((img, index) => ({
    id: `gallery-${index}-${img.public_id}`,
    publicId: img.public_id,
    url: img.secure_url,
    width: img.width,
    height: img.height,
    alt: img.context?.custom?.alt || `Imagen de galería ${index + 1}`,
    aspect: getAspectRatio(img.width, img.height),
    category: img.context?.custom?.category,
  }));
}

/**
 * Get optimized URL for an image with transformations
 * 
 * @param publicId - The public ID of the image
 * @param options - Transformation options
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif';
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;

  return cloudinary.url(publicId, {
    transformation: [
      {
        width,
        height,
        crop: 'fill',
        gravity: 'auto',
        quality,
        fetch_format: format,
      },
    ],
  });
}

export default cloudinary;
