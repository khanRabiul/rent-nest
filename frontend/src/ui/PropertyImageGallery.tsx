"use client";

import Image from 'next/image';
import { useState } from 'react';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-8 flex items-center justify-center text-[--foreground-muted]">
        <Image
          src="/images/property/property_placeholder.jpg"
          alt="No image available"
          fill={true}
          style={{ objectFit: 'cover' }}
          className="blur-sm"
        />
        <p className="z-10 text-xl">No image available</p>
      </div>
    );
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const currentImageUrl = images[currentImageIndex];

  return (
    <div className="relative w-full rounded-lg overflow-hidden mb-8">

      <div className="relative w-full h-[500px] bg-gray-200 flex items-center justify-center">
        <Image
          src={currentImageUrl}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          fill={true}
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          className="transition-opacity duration-300"
          priority={currentImageIndex === 0}
        />
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 p-2 bg-black/30 backdrop-blur-sm rounded-lg">
          {images.map((imgUrl, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-20 h-16 rounded-md cursor-pointer overflow-hidden border-2 ${currentImageIndex === index ? 'border-[--primary]' : 'border-transparent'
                } hover:border-[--primary] transition-all duration-200`}
            >
              <Image src={imgUrl} alt={`Thumbnail ${index + 1}`} width={80} height={64} style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}