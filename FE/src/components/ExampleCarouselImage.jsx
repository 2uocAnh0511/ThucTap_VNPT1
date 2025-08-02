import React from 'react';

function ExampleCarouselImage({ src, alt = "Carousel Image" }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ 
        width: '100%', 
        height: '400px', 
        objectFit: 'cover' 
      }} 
    />
  );
}

export default ExampleCarouselImage;
