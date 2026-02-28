import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledStatsSection = styled.section`
  max-width: 1000px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 20px;
    margin-bottom: 60px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 40px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .stat-item {
    padding: 30px 20px;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    transition: var(--transition);

    &:hover {
      transform: translateY(-5px);
      background-color: var(--lightest-navy);
    }

    @media (max-width: 768px) {
      padding: 25px 15px;
    }
  }

  .stat-number {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(40px, 8vw, 60px);
    font-weight: 600;
    line-height: 1;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: clamp(35px, 8vw, 50px);
    }
  }

  .stat-label {
    color: var(--slate);
    font-size: var(--fz-lg);
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: var(--fz-md);
    }
  }

  .github-section {
    margin-top: 80px;

    @media (max-width: 768px) {
      margin-top: 50px;
    }

    h3 {
      color: var(--lightest-slate);
      font-size: clamp(24px, 5vw, 28px);
      margin-bottom: 40px;

      @media (max-width: 768px) {
        margin-bottom: 30px;
      }
    }
  }

  .github-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }

  .github-stat-item {
    padding: 25px;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    border: 1px solid var(--lightest-navy);
    transition: var(--transition);

    &:hover {
      border-color: var(--green);
      transform: translateY(-3px);
    }

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  .github-stat-number {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(32px, 6vw, 42px);
    font-weight: 600;
    margin-bottom: 8px;
  }

  .github-stat-label {
    color: var(--light-slate);
    font-size: var(--fz-md);
  }

  .github-heatmap {
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
    padding: 20px;
    overflow-x: auto;
    border: 1px solid var(--lightest-navy);

    @media (max-width: 768px) {
      padding: 15px;
    }

    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }

    /* Custom scrollbar for heatmap container */
    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: var(--navy);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--slate);
      border-radius: 10px;

      &:hover {
        background: var(--light-slate);
      }
    }
  }

  .loading {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
  }

  .error {
    color: var(--slate);
    font-size: var(--fz-sm);
    padding: 20px;
    background-color: var(--light-navy);
    border-radius: var(--border-radius);
  }

  /* YouTube Playlist Section */
  .youtube-section {
    margin-bottom: 80px;
    position: relative;

    @media (max-width: 768px) {
      margin-top: 50px;
      margin-bottom: 50px;
    }

    .youtube-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      margin-bottom: 50px;

      @media (max-width: 768px) {
        margin-bottom: 35px;
        gap: 10px;
      }
    }

    .youtube-icon {
      width: 40px;
      height: 40px;
      filter: drop-shadow(0 0 8px rgba(255, 0, 0, 0.4));
      margin-bottom: 6px;

      @media (max-width: 768px) {
        width: 32px;
        height: 32px;
      }
    }

    .youtube-title {
      color: var(--lightest-slate);
      font-size: clamp(24px, 5vw, 30px);
      font-weight: 600;
      margin: 0;
      background: linear-gradient(135deg, var(--lightest-slate) 0%, var(--green) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .playlist-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--green-tint);
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 30px;
      border: 1px solid rgba(100, 255, 218, 0.2);

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }

  .youtube-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .video-card {
    position: relative;
    background: var(--light-navy);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--lightest-navy);
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--green), #ff0000, var(--green));
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: 2;
    }

    &:hover {
      transform: translateY(-8px);
      border-color: var(--green);
      box-shadow: 0 12px 40px rgba(100, 255, 218, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3);

      &::before {
        opacity: 1;
      }

      .video-overlay {
        opacity: 1;
      }

      .play-button {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }
  }

  .video-embed-wrapper {
    position: relative;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    background: var(--dark-navy);

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  .video-info {
    padding: 20px;
    text-align: left;

    @media (max-width: 768px) {
      padding: 16px;
    }
  }

  .video-number {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::after {
      content: '';
      display: block;
      width: 30px;
      height: 1px;
      background: var(--green);
    }
  }

  .video-title {
    color: var(--lightest-slate);
    font-size: var(--fz-lg);
    font-weight: 600;
    margin-bottom: 6px;
    line-height: 1.3;
  }

  .video-series {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }

  .youtube-cta {
    margin-top: 30px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      padding: 12px 28px;
      border: 1px solid var(--green);
      border-radius: var(--border-radius);
      background: transparent;
      transition: var(--transition);
      text-decoration: none;

      &:hover {
        background: var(--green-tint);
        transform: translateY(-2px);
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const Stats = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const [githubCounters, setGithubCounters] = useState({ repos: 0, contributions: 0 });
  const [githubData, setGithubData] = useState({
    repos: 0,
    contributions: 0,
    loading: true,
    error: false,
  });

  const GITHUB_USERNAME = 'Abdullah628';

  // Personal stats - easily adjustable
  const personalStats = [
    { number: 44, suffix: '+', label: 'Projects Delivered' },
    { number: 98, suffix: '%', label: 'Client Satisfaction' },
    { number: 15, suffix: '+', label: 'Technologies' },
    { number: 2, suffix: '+', label: 'Years Experience' },
  ];

  // Counter animation function
  const animateCounter = (target, index, isGithub = false, key = null, duration = 2000) => {
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = currentTime => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

      if (isGithub) {
        setGithubCounters(prev => ({ ...prev, [key]: currentValue }));
      } else {
        setCounters(prev => {
          const newCounters = [...prev];
          newCounters[index] = currentValue;
          return newCounters;
        });
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer to trigger animation when section is visible
  useEffect(() => {
    if (prefersReducedMotion || hasAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate personal stats
            personalStats.forEach((stat, index) => {
              setTimeout(() => {
                animateCounter(stat.number, index, false, null, 2000);
              }, index * 100);
            });

            // Animate GitHub stats when data is loaded
            if (!githubData.loading && !githubData.error) {
              setTimeout(() => {
                animateCounter(githubData.repos, 0, true, 'repos', 2000);
              }, 400);
              setTimeout(() => {
                animateCounter(1200, 0, true, 'contributions', 2000);
              }, 500);
            }
          }
        });
      },
      { threshold: 0.3 },
    );

    if (revealContainer.current) {
      observer.observe(revealContainer.current);
    }

    return () => {
      if (revealContainer.current) {
        observer.unobserve(revealContainer.current);
      }
    };
  }, [prefersReducedMotion, hasAnimated, githubData]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  useEffect(() => {
    // Fetch GitHub data
    const fetchGithubData = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();

        setGithubData({
          repos: data.public_repos,
          contributions: 1200,
          loading: false,
          error: false,
        });

        // Trigger GitHub counter animation if section already visible
        if (hasAnimated) {
          setTimeout(() => {
            animateCounter(data.public_repos, 0, true, 'repos', 2000);
          }, 100);
          setTimeout(() => {
            animateCounter(1200, 0, true, 'contributions', 2000);
          }, 200);
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setGithubData(prev => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchGithubData();
  }, []);

  return (
    <StyledStatsSection id="stats" ref={revealContainer}>
      {/* YouTube Playlist Section */}
      <div className="youtube-section">
        <div className="youtube-header">
          <svg className="youtube-icon" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <h3 className="youtube-title">Master System Design</h3>
        </div>

        <div className="playlist-badge">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
          </svg>
          Playlist • 2 Videos
        </div>

        <div className="youtube-grid">
          <div className="video-card">
            <div className="video-embed-wrapper">
              <iframe
                src="https://www.youtube.com/embed/dAErfzFerRQ"
                title="Master System Design - Episode 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-info">
              <div className="video-number">Episode 01</div>
              <div className="video-title">
                Why Your System Design Fails Under Load | The Physics of Software
              </div>
              <div className="video-series">Master System Design Series</div>
            </div>
          </div>

          <div className="video-card">
            <div className="video-embed-wrapper">
              <iframe
                src="https://www.youtube.com/embed/6zLV3ShjWA4"
                title="Master System Design - Episode 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-info">
              <div className="video-number">Episode 02</div>
              <div className="video-title">
                Your System Is 99% Fast — But 64% of Users Are SUFFERING | Scale Math
              </div>
              <div className="video-series">Master System Design Series</div>
            </div>
          </div>
        </div>

        <div className="youtube-cta">
          <a
            href="https://www.youtube.com/watch?v=dAErfzFerRQ&list"
            target="_blank"
            rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
            View Full Playlist on YouTube
          </a>
        </div>
      </div>

      <div className="stats-container">
        {personalStats.map(({ number, suffix, label }, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-number">
              {prefersReducedMotion ? number : counters[i]}
              {suffix}
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="github-section">
        <h3>GitHub Activity</h3>

        <div className="github-stats">
          <div className="github-stat-item">
            <div className="github-stat-number">
              {githubData.loading
                ? '...'
                : githubData.error
                  ? 'N/A'
                  : prefersReducedMotion
                    ? githubData.repos
                    : githubCounters.repos}
            </div>
            <div className="github-stat-label">Public Repositories</div>
          </div>

          <div className="github-stat-item">
            <div className="github-stat-number">
              {githubData.loading
                ? '...'
                : githubData.error
                  ? 'N/A'
                  : prefersReducedMotion
                    ? '1200+'
                    : `${githubCounters.contributions}+`}
            </div>
            <div className="github-stat-label">Total Contributions</div>
          </div>
        </div>

        <div className="github-heatmap">
          {githubData.loading ? (
            <div className="loading">Loading contribution graph...</div>
          ) : githubData.error ? (
            <div className="error">Unable to load contribution graph</div>
          ) : (
            <img
              src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
              alt={`${GITHUB_USERNAME}'s GitHub contribution chart`}
            />
          )}
        </div>
      </div>
    </StyledStatsSection>
  );
};

export default Stats;
