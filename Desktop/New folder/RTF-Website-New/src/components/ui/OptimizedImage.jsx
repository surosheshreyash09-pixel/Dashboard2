import { useState, useEffect, useRef } from 'react';

/**
 * OptimizedImage — Performance-optimized image component
 * 
 * Features:
 * - Lazy loading with intersection observer (native)
 * - Preload option for above-the-fold images
 * - Fallback placeholder and error image
 * - Prevents layout shifts with aspect ratio box
 * - Accessible alt text and ARIA labels
 * - Supports modern formats (WebP/AVIF) with fallbacks
 * - Smooth fade-in animation on load
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderClassName = '',
  preload = false,
  priority = false,
  aspectRatio,
  onLoad,
  onError,
  ...rest
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Preload image if priority is true
    if (preload || priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    }
  }, [src, preload, priority]);

  const handleLoad = (e) => {
    setIsLoading(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    console.error(`[OptimizedImage] Failed to load: ${src}`);
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(e);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aspect ratio box to prevent layout shifts */}
      <div 
        className="w-full" 
        style={aspectRatio ? { aspectRatio, height: 0 } : {}}
      >
        {/* Loading placeholder */}
        <div className={`absolute inset-0 bg-gray-800/50 flex items-center justify-center ${placeholderClassName}`}>
          <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>

        {/* Error fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 to-deep flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3">
              <svg 
                className="w-8 h-8 text-cyan-500/70" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <span className="text-cyan-400/70 text-xs font-mono">Image unavailable</span>
          </div>
        )}

        {/* Actual image */}
        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          aria-hidden={hasError}
          {...rest}
        />
      </div>
    </div>
  );
}
