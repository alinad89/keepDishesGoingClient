import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

interface PageLoadAnimationOptions {
  /** Duration of the animation in milliseconds (default: 800) */
  duration?: number;
  /** Delay before animation starts in milliseconds (default: 100) */
  delay?: number;
  /** Stagger delay between child elements in milliseconds (default: 100) */
  stagger?: number;
  /** Starting Y offset in pixels (default: 20) */
  translateY?: number;
  /** Easing function (default: 'easeOutCubic') */
  easing?: string;
}

/**
 * Custom hook for smooth page-load animations using Anime.js
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   const containerRef = usePageLoadAnimation({
 *     stagger: 150,
 *     duration: 1000
 *   });
 *
 *   return (
 *     <div ref={containerRef}>
 *       <div className="animate-item">Item 1</div>
 *       <div className="animate-item">Item 2</div>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageLoadAnimation(options: PageLoadAnimationOptions = {}) {
  const {
    duration = 800,
    delay = 100,
    stagger = 100,
    translateY = 20,
    easing = 'easeOutCubic'
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all direct children with class 'animate-item' or all direct children
    const targets = containerRef.current.querySelectorAll('.animate-item');
    const elements = targets.length > 0
      ? Array.from(targets)
      : Array.from(containerRef.current.children);

    if (elements.length === 0) {
      // If no children, animate the container itself
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [translateY, 0],
        duration,
        delay,
        easing
      });
      return;
    }

    // Set initial state
    elements.forEach((el) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = `translateY(${translateY}px)`;
    });

    // Animate with stagger
    anime({
      targets: elements,
      opacity: [0, 1],
      translateY: [translateY, 0],
      duration,
      delay: anime.stagger(stagger, { start: delay }),
      easing
    });

    // Cleanup function
    return () => {
      elements.forEach((el) => {
        (el as HTMLElement).style.opacity = '';
        (el as HTMLElement).style.transform = '';
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array = runs once on mount (animation options are intentionally not dependencies)

  return containerRef;
}

/**
 * Simpler version for single-element animations
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const ref = useSimpleAnimation();
 *   return <div ref={ref}>Content</div>;
 * }
 * ```
 */
export function useSimpleAnimation(options: PageLoadAnimationOptions = {}) {
  const {
    duration = 600,
    delay = 0,
    translateY = 15,
    easing = 'easeOutCubic'
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    anime({
      targets: elementRef.current,
      opacity: [0, 1],
      translateY: [translateY, 0],
      duration,
      delay,
      easing
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array = runs once on mount (animation options are intentionally not dependencies)

  return elementRef;
}
