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
  getAllVideos,
  transformToGalleryImages,
  type GalleryImage
} from '@/lib/cloudinary';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const tag = searchParams.get('tag');
    const type = searchParams.get('type'); // 'image' | 'video'

    let cloudinaryImages;

    if (type === 'video') {
      cloudinaryImages = await getAllVideos();
    } else if (tag) {
      cloudinaryImages = await getImagesByTag(tag);
    } else if (folder) {
      cloudinaryImages = await getImagesFromFolder(folder);
    } else {
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
