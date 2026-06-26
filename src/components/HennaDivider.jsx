import React from 'react';

/**
 * HennaDivider - Decorative signature SVG divider.
 * Renders an inline, responsive, gold SVG floral scroll pattern.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Extra Tailwind classes.
 */
const HennaDivider = ({ className = "" }) => {
  return (
    <div className={`flex justify-center items-center my-8 md:my-12 px-4 select-none ${className}`}>
      <svg 
        viewBox="0 0 800 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full max-w-2xl h-auto text-gold transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Center Mandala/Flower */}
        <path d="M400 10 C395 20, 385 20, 380 30 C385 40, 395 40, 400 50 C405 40, 415 40, 420 30 C415 20, 405 20, 400 10 Z" fill="currentColor"/>
        <path d="M400 20 C397 25, 392 25, 390 30 C392 35, 397 35, 400 40 C403 35, 408 35, 410 30 C408 25, 403 25, 400 20 Z" fill="#FDF6EC" fillOpacity="0.9"/>
        <circle cx="400" cy="30" r="4" fill="currentColor"/>
        
        {/* Left Side Vines and Leaves */}
        <path d="M380 30 Q300 15, 200 30 T20 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M340 23 C345 15, 355 18, 358 24 C350 25, 342 28, 340 23 Z" fill="currentColor"/>
        <path d="M260 21 C265 10, 275 12, 280 20 C270 20, 262 25, 260 21 Z" fill="currentColor"/>
        <path d="M180 23 C182 15, 192 18, 195 24 C187 25, 182 28, 180 23 Z" fill="currentColor"/>
        <path d="M120 28 C122 35, 132 38, 135 32 C127 30, 122 25, 120 28 Z" fill="currentColor"/>

        {/* Right Side Vines and Leaves */}
        <path d="M420 30 Q500 15, 600 30 T780 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M460 23 C455 15, 445 18, 442 24 C450 25, 458 28, 460 23 Z" fill="currentColor"/>
        <path d="M540 21 C535 10, 525 12, 520 20 C530 20, 538 25, 540 21 Z" fill="currentColor"/>
        <path d="M620 23 C618 15, 608 18, 605 24 C613 25, 618 28, 620 23 Z" fill="currentColor"/>
        <path d="M680 28 C678 35, 668 38, 665 32 C673 30, 678 25, 680 28 Z" fill="currentColor"/>
        
        {/* Decorative Dots */}
        <circle cx="220" cy="22" r="2" fill="currentColor"/>
        <circle cx="300" cy="28" r="3" fill="currentColor"/>
        <circle cx="500" cy="28" r="3" fill="currentColor"/>
        <circle cx="580" cy="22" r="2" fill="currentColor"/>
      </svg>
    </div>
  );
};

export default HennaDivider;
