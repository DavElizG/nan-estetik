/**
 * Gallery API Route
 * 
 * Fetches images from Cloudinary for the gallery section
 */

import { NextResponse } from 'next/server';
import { 
  getImagesFromFolder, 
  getImagesByTag, 
  getAllImages,
  transformToGalleryImages,
  type GalleryImage 
} from '@/lib/cloudinary';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const tag = searchParams.get('tag');
    
    let cloudinaryImages;
    
    // Fetch images by tag, folder, or all images
    if (tag) {
      cloudinaryImages = await getImagesByTag(tag);
    } else if (folder) {
      cloudinaryImages = await getImagesFromFolder(folder);
    } else {
      // Default: get all images
      cloudinaryImages = await getAllImages();
    }
    
    // Transform to gallery-friendly format
    const galleryImages: GalleryImage[] = transformToGalleryImages(cloudinaryImages);
    
    return NextResponse.json({
      success: true,
      data: galleryImages,
      count: galleryImages.length,
    });
  } catch (error) {
    console.error('Gallery API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar las imágenes de la galería',
        data: [] 
      },
      { status: 500 }
    );
  }
}
