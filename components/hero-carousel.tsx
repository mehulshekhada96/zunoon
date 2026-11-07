'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type HeroSlide, defaultHeroSlides } from '@/lib/hero-slides';
import './hero-carousel.css';

interface HeroCarouselProps {
  initialSlides?: HeroSlide[];
}

export default function HeroCarousel({ initialSlides }: HeroCarouselProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(
    initialSlides && initialSlides.length > 0 ? initialSlides : defaultHeroSlides
  );
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Mouse drag tracking for desktop swipe
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);

  // Sync slides state when initialSlides prop updates (e.g. In admin live preview)
  useEffect(() => {
    if (initialSlides !== undefined) {
      setSlides(initialSlides.length > 0 ? initialSlides : defaultHeroSlides);
      setCurrent(0);
    }
  }, [initialSlides]);

  // Fetch updated slides from API on mount ONLY IF initialSlides was not provided
  useEffect(() => {
    if (initialSlides !== undefined) return;
    let active = true;
    fetch('/api/hero-slides', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (active && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
      })
      .catch(err => {
        console.warn('Using default hero slides:', err);
      });
    return () => {
      active = false;
    };
  }, [initialSlides]);

  const total = slides.length;

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setCurrent(prev => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrent(prev => (prev - 1 + total) % total);
  }, [total]);

  // Auto-swipe timer (pauses when user hovers or interacts)
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const interval = setInterval(() => {
      goToNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, total, goToNext]);

  // Touch swipe handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diffX = touchStartX.current - touchEndX.current;
      const threshold = 40; // minimum pixels to count as swipe
      if (diffX > threshold) {
        goToNext();
      } else if (diffX < -threshold) {
        goToPrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  // Mouse drag handlers (Desktop manual swipe)
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging.current && mouseStartX.current !== null) {
      const diffX = mouseStartX.current - e.clientX;
      const threshold = 50;
      if (diffX > threshold) {
        goToNext();
      } else if (diffX < -threshold) {
        goToPrev();
      }
    }
    mouseStartX.current = null;
    isDragging.current = false;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="hero-carousel-section" aria-label="Hero Carousel Banner">
      <div
        className="hero-carousel-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          isDragging.current = false;
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        role="region"
        aria-roledescription="carousel"
      >
        <div className="hero-carousel-track">
          {slides.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={slide.id || idx}
                className={`hero-carousel-slide ${isActive ? 'active' : ''}`}
                aria-hidden={!isActive}
              >
                <Image
                  src={slide.url}
                  alt={slide.alt || 'Zunoon Club Carousel Slide'}
                  fill
                  sizes="(max-width: 900px) 100vw, 1360px"
                  priority={idx === 0}
                  className="hero-carousel-image"
                />
                <div className="hero-carousel-overlay" />
                {slide.title && (
                  <div className="hero-carousel-caption">
                    <h3>{slide.title}</h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Slide Counter Badge */}
        {total > 1 && (
          <div className="hero-carousel-badge" aria-label={`Slide ${current + 1} of ${total}`}>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        )}

        {/* Navigation Buttons (Manual Swipe / Click) */}
        {total > 1 && (
          <>
            <button
              type="button"
              className="hero-carousel-btn hero-carousel-btn-prev"
              onClick={e => {
                e.stopPropagation();
                goToPrev();
              }}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              className="hero-carousel-btn hero-carousel-btn-next"
              onClick={e => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {total > 1 && (
          <div className="hero-carousel-dots" role="tablist" aria-label="Slide Selector">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-carousel-dot ${idx === current ? 'active' : ''}`}
                onClick={e => {
                  e.stopPropagation();
                  setCurrent(idx);
                }}
                role="tab"
                aria-selected={idx === current}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

