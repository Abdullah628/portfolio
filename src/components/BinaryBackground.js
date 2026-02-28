import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
`;

const BinaryBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    let animationId;
    let columns;
    let drops;

    const fontSize = 20;
    const chars = '01';

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    initCanvas();

    const draw = () => {
      // Semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(10, 25, 47, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'SF Mono', 'Fira Code', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Vary brightness for depth effect
        const brightness = Math.random();
        if (brightness > 0.7) {
          ctx.fillStyle = 'rgba(100, 255, 218, 1)'; // bright green
        } else if (brightness > 0.3) {
          ctx.fillStyle = 'rgba(100, 255, 218, 0.7)'; // medium green
        } else {
          ctx.fillStyle = 'rgba(100, 255, 218, 0.4)'; // dim green
        }

        ctx.fillText(char, x, y);

        // Reset drop to top with random delay
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += 0.4 + Math.random() * 0.3; // Slow, varied speed
      }

      animationId = requestAnimationFrame(draw);
    };

    // Small delay to let the page render first
    const startTimeout = setTimeout(() => {
      draw();
    }, 500);

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <StyledCanvas ref={canvasRef} aria-hidden="true" />;
};

export default BinaryBackground;
