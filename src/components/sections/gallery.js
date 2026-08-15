import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledGallerySection = styled.section`
  max-width: 1000px;

  h2.numbered-heading {
    margin-bottom: 50px;
  }

  .gallery-intro {
    max-width: 600px;
    margin: -30px 0 50px;
    color: var(--slate);
    font-size: var(--fz-lg);
    line-height: 1.5;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 240px);
    gap: 16px;

    @media (max-width: 900px) {
      grid-template-rows: repeat(2, 200px);
      gap: 12px;
    }

    @media (max-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, 200px);
      gap: 12px;
    }

    @media (max-width: 380px) {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(5, 240px);
    }
  }

  .gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: var(--border-radius);
    background-color: var(--green);
    cursor: pointer;
    padding: 0;
    border: 0;
    transition: transform 0.35s cubic-bezier(0.645, 0.045, 0.355, 1),
      box-shadow 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);

    &:hover,
    &:focus {
      outline: 0;
      transform: translateY(-6px);
      box-shadow: 0 20px 30px -15px var(--navy-shadow);

      .gallery-img-wrap img {
        filter: none !important;
        mix-blend-mode: normal !important;
        transform: scale(1.05);
      }

      .gallery-overlay {
        opacity: 1;
      }

      .gallery-caption {
        transform: translateY(0);
      }

      &:before {
        background: transparent;
      }
    }

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 3;
      background-color: var(--navy);
      mix-blend-mode: screen;
      transition: var(--transition);
      pointer-events: none;
    }
  }

  .gallery-item.featured {
    grid-column: 1 / span 2;
    grid-row: 1 / span 2;

    @media (max-width: 600px) {
      grid-column: 1 / -1;
      grid-row: 1 / span 2;
    }

    @media (max-width: 380px) {
      grid-row: auto;
    }
  }

  .gallery-img-wrap {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: grayscale(100%) contrast(1) brightness(85%);
      mix-blend-mode: multiply;
      transition: filter 0.4s ease, transform 0.5s ease, mix-blend-mode 0.4s ease;
    }
  }

  .gallery-overlay {
    position: absolute;
    inset: 0;
    z-index: 4;
    background: linear-gradient(
      to top,
      rgba(2, 12, 27, 0.95) 0%,
      rgba(2, 12, 27, 0.55) 45%,
      rgba(2, 12, 27, 0) 100%
    );
    opacity: 0.5;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }

  .gallery-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    padding: 18px 20px;
    text-align: left;
    transform: translateY(8px);
    transition: transform 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    pointer-events: none;

    @media (max-width: 600px) {
      padding: 14px 16px;
    }
  }

  .caption-tag {
    display: inline-block;
    margin-bottom: 6px;
    padding: 3px 10px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    background: rgba(100, 255, 218, 0.1);
    border: 1px solid rgba(100, 255, 218, 0.3);
    border-radius: 12px;
    letter-spacing: 0.5px;
  }

  .caption-title {
    margin: 0;
    color: var(--white);
    font-size: var(--fz-md);
    font-weight: 600;
    line-height: 1.3;

    @media (max-width: 600px) {
      font-size: var(--fz-sm);
    }
  }

  .caption-sub {
    margin: 4px 0 0;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.4;
  }
`;

const StyledLightbox = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(2, 12, 27, 0.92);
  backdrop-filter: blur(6px);
  animation: fadeIn 0.25s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    padding: 20px;
  }

  .lightbox-content {
    position: relative;
    max-width: 1100px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lightbox-img-wrap {
    position: relative;
    width: 100%;
    max-height: 78vh;
    display: flex;
    justify-content: center;

    .gatsby-image-wrapper {
      max-height: 78vh;
      border-radius: var(--border-radius);
      box-shadow: 0 30px 60px -15px var(--navy-shadow);
    }

    img {
      max-height: 78vh;
      object-fit: contain !important;
    }
  }

  .lightbox-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    pointer-events: none;

    .spinner-ring {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      border: 3px solid rgba(100, 255, 218, 0.2);
      border-top-color: var(--green);
      animation: spin 0.8s linear infinite;
    }

    .spinner-label {
      margin: 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      letter-spacing: 0.5px;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lightbox-spinner .spinner-ring {
      animation-duration: 2.4s;
    }
  }

  .lightbox-meta {
    margin-top: 18px;
    text-align: center;

    h4 {
      margin: 0 0 4px;
      color: var(--lightest-slate);
      font-size: var(--fz-lg);
      font-weight: 600;
    }

    p {
      margin: 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }
  }

  .lightbox-close {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 110;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid var(--green);
    background: var(--navy);
    color: var(--green);
    font-size: 26px;
    line-height: 1;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);

    &:hover,
    &:focus {
      outline: 0;
      background: var(--green-tint);
      transform: rotate(90deg);
    }

    @media (max-width: 600px) {
      top: 14px;
      right: 14px;
      width: 42px;
      height: 42px;
      font-size: 22px;
    }
  }
`;

const ThumbImage = ({ slug, alt }) => {
  switch (slug) {
    case 'prize_ceremony02':
      return (
        <StaticImage
          src="../../images/gellary/prize_ceremony02.jpg"
          alt={alt}
          width={700}
          quality={80}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
          style={{ width: '100%', height: '100%' }}
        />
      );
    case 'prize_ceremony01':
      return (
        <StaticImage
          src="../../images/gellary/prize_ceremony01.jpg"
          alt={alt}
          width={350}
          quality={80}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
          style={{ width: '100%', height: '100%' }}
        />
      );
    case 'graduation_day':
      return (
        <StaticImage
          src="../../images/gellary/graduation_day.jpg"
          alt={alt}
          width={350}
          quality={80}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
          style={{ width: '100%', height: '100%' }}
        />
      );
    case 'office_work':
      return (
        <StaticImage
          src="../../images/gellary/office_work.jpg"
          alt={alt}
          width={350}
          quality={80}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
          style={{ width: '100%', height: '100%' }}
        />
      );
    case 'meetup':
      return (
        <StaticImage
          src="../../images/gellary/meetup.jpg"
          alt={alt}
          width={350}
          quality={80}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
          style={{ width: '100%', height: '100%' }}
        />
      );
    default:
      return null;
  }
};

const FullImage = ({ slug, alt }) => {
  switch (slug) {
    case 'prize_ceremony02':
      return (
        <StaticImage
          src="../../images/gellary/prize_ceremony02.jpg"
          alt={alt}
          width={1200}
          quality={90}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
        />
      );
    case 'prize_ceremony01':
      return (
        <StaticImage
          src="../../images/gellary/prize_ceremony01.jpg"
          alt={alt}
          width={1200}
          quality={90}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
        />
      );
    case 'graduation_day':
      return (
        <StaticImage
          src="../../images/gellary/graduation_day.jpg"
          alt={alt}
          width={1200}
          quality={90}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
        />
      );
    case 'office_work':
      return (
        <StaticImage
          src="../../images/gellary/office_work.jpg"
          alt={alt}
          width={1200}
          quality={90}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
        />
      );
    case 'meetup':
      return (
        <StaticImage
          src="../../images/gellary/meetup.jpg"
          alt={alt}
          width={1200}
          quality={90}
          layout="constrained"
          placeholder="dominantColor"
          formats={['AUTO', 'WEBP', 'AVIF']}
        />
      );
    default:
      return null;
  }
};

ThumbImage.propTypes = {
  slug: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

FullImage.propTypes = {
  slug: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

const galleryItems = [
  {
    slug: 'prize_ceremony02',
    tag: 'Employee of the Year',
    title: 'Receiving the award from our CEO & Director',
    sub: 'A moment I will always cherish — recognition from leadership',
    featured: true,
  },
  {
    slug: 'prize_ceremony01',
    tag: 'Recognition',
    title: 'Employee of the Year Announcement',
    sub: 'The moment the name was called',
  },
  {
    slug: 'graduation_day',
    tag: 'Milestone',
    title: 'Graduation Day',
    sub: 'The day I completed my degree',
  },
  {
    slug: 'office_work',
    tag: 'On the Job',
    title: 'A Day at the Office',
    sub: 'Heads-down on real-world problems',
  },
  {
    slug: 'meetup',
    tag: 'Client Work',
    title: 'Client Meeting',
    sub: 'Walking through features I built for their product',
  },
];

const Gallery = () => {
  const revealContainer = useRef(null);
  const revealItems = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgWrap = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
    revealItems.current.forEach((ref, i) => ref && sr.reveal(ref, srConfig(i * 100)));
  }, []);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKey = e => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  // StaticImage does not forward onLoad to the underlying <img>, so watch the
  // real element instead. It renders two <img> tags — [data-placeholder-image]
  // and [data-main-image] — and only the latter tracks the full-size download.
  // The main image also mounts a tick after activeIndex changes, hence the
  // observer: without it we would query too early, find nothing, and leave the
  // spinner up forever. Cached images are already complete on mount, which is
  // why the spinner used to linger on reopen.
  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    let cleanupImg = null;

    const attach = img => {
      if (img.complete && img.naturalWidth > 0) {
        setImgLoaded(true);
        return true;
      }
      const done = () => setImgLoaded(true);
      img.addEventListener('load', done);
      img.addEventListener('error', done);
      cleanupImg = () => {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
      };
      return true;
    };

    const find = () => {
      const wrap = imgWrap.current;
      if (!wrap) {
        return false;
      }
      const img = wrap.querySelector('img[data-main-image]');
      return img ? attach(img) : false;
    };

    if (find()) {
      return () => cleanupImg && cleanupImg();
    }

    // Main image not in the DOM yet — watch for it.
    const observer = new MutationObserver(() => {
      if (find()) {
        observer.disconnect();
      }
    });
    if (imgWrap.current) {
      observer.observe(imgWrap.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      if (cleanupImg) {
        cleanupImg();
      }
    };
  }, [activeIndex]);

  const openLightbox = i => {
    setImgLoaded(false);
    setActiveIndex(i);
  };
  const closeLightbox = () => setActiveIndex(null);
  const onBackdropClick = e => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  return (
    <StyledGallerySection id="gallery" ref={revealContainer}>
      <h2 className="numbered-heading">Moments & Milestones</h2>

      <p className="gallery-intro">
        A few snapshots from my journey — milestones I’m proud of, the spaces I work from, and
        moments that shaped who I am as an engineer.
      </p>

      <div className="gallery-grid">
        {galleryItems.map((item, i) => (
          <button
            type="button"
            key={item.slug}
            className={`gallery-item${item.featured ? ' featured' : ''}`}
            ref={el => (revealItems.current[i] = el)}
            onClick={() => openLightbox(i)}
            aria-label={`Open ${item.title}`}>
            <div className="gallery-img-wrap">
              <ThumbImage slug={item.slug} alt={item.title} />
            </div>
            <div className="gallery-overlay" />
            <div className="gallery-caption">
              <span className="caption-tag">{item.tag}</span>
              <h3 className="caption-title">{item.title}</h3>
              {item.sub && <p className="caption-sub">{item.sub}</p>}
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <StyledLightbox onClick={onBackdropClick} role="dialog" aria-modal="true">
          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close gallery image">
            &times;
          </button>
          <div className="lightbox-content">
            <div className="lightbox-img-wrap" ref={imgWrap}>
              {!imgLoaded && (
                <div className="lightbox-spinner" role="status" aria-live="polite">
                  <div className="spinner-ring" />
                  <p className="spinner-label">Loading image…</p>
                </div>
              )}
              <FullImage
                key={galleryItems[activeIndex].slug}
                slug={galleryItems[activeIndex].slug}
                alt={galleryItems[activeIndex].title}
              />
            </div>
            <div className="lightbox-meta">
              <h4>{galleryItems[activeIndex].title}</h4>
              <p>{galleryItems[activeIndex].sub}</p>
            </div>
          </div>
        </StyledLightbox>
      )}
    </StyledGallerySection>
  );
};

export default Gallery;
