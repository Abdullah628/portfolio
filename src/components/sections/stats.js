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
        if (!response.ok) {throw new Error('Failed to fetch');}
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
