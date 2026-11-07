'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import './skeleton-image.css';

interface SkeletonImageProps extends Omit<ImageProps, 'onLoad'> {
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  aspectRatio?: string;
}

export default function SkeletonImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  containerStyle,
  aspectRatio,
  fill,
  width,
  height,
  priority,
  sizes,
  style,
  ...rest
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no source is provided or image failed, render skeleton state
  if (!src || hasError) {
    return (
      <div
        className={`skeleton-image-wrapper empty-skeleton ${containerClassName}`}
        style={{
          ...(aspectRatio ? { aspectRatio } : {}),
          ...containerStyle
        }}
        aria-hidden="true"
      >
        <div className="skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div
      className={`skeleton-image-wrapper ${isLoaded ? 'is-loaded' : 'is-loading'} ${containerClassName}`}
      style={{
        ...(aspectRatio ? { aspectRatio } : {}),
        ...containerStyle
      }}
    >
      {!isLoaded && <div className="skeleton-shimmer" aria-hidden="true" />}
      <Image
        src={src}
        alt={alt || ''}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={`skeleton-real-image ${isLoaded ? 'loaded' : 'loading'} ${className}`}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...rest}
      />
    </div>
  );
}

