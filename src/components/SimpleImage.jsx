import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import './lazyimage.css';

const SimpleImage = ({ src, alt, className, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
    };
    img.src = src;
  }, [src]);

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div 
      className={`lazy-image-container ${className || ''} ${loaded ? 'loaded' : ''}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      onClick={onClick}
    >
      <img 
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s'
        }}
      />
    </motion.div>
  );
};

export default SimpleImage;
