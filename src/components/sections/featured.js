import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;

  @media (max-width: 768px) {
    ${({ theme }) => theme.mixins.boxShadow};
  }

  &:not(:last-of-type) {
    margin-bottom: 100px;

    @media (max-width: 768px) {
      margin-bottom: 70px;
    }

    @media (max-width: 480px) {
      margin-bottom: 30px;
    }
  }

  &:nth-of-type(odd) {
    .project-content {
      grid-column: 7 / -1;
      text-align: right;

      @media (max-width: 1080px) {
        grid-column: 5 / -1;
      }
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding: 40px 40px 30px;
        text-align: left;
      }
      @media (max-width: 480px) {
        padding: 25px 25px 20px;
      }
    }
    .project-tech-list {
      justify-content: flex-end;
      margin-left: auto;

      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: 0;
      }

      li {
        margin: 0 0 5px 15px;

        @media (max-width: 768px) {
          margin: 0 10px 5px 0;
        }
      }
    }
    .project-links {
      justify-content: flex-end;
      margin-left: 0;
      margin-right: -10px;

      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: -10px;
        margin-right: 0;
      }
    }
    .project-image {
      grid-column: 1 / 8;

      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }

  .project-content {
    position: relative;
    grid-column: 1 / 7;
    grid-row: 1 / -1;
    min-width: 0;

    > div {
      min-width: 0;
      max-width: 100%;
    }

    @media (max-width: 1080px) {
      grid-column: 1 / 9;
    }

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      grid-column: 1 / -1;
      padding: 40px 40px 30px;
      z-index: 5;
    }

    @media (max-width: 480px) {
      padding: 30px 25px 20px;
    }
  }

  .project-overline {
    margin: 10px 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 28px);

    @media (min-width: 768px) {
      margin: 0 0 20px;
    }

    @media (max-width: 768px) {
      color: var(--white);

      a {
        position: static;

        &:before {
          content: '';
          display: block;
          position: absolute;
          z-index: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }

  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    color: var(--light-slate);
    font-size: var(--fz-lg);

    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;

      &:hover {
        box-shadow: none;
      }
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    strong {
      color: var(--white);
      font-weight: normal;
    }

    p {
      margin: 0;
    }
  }

  .project-details-btn {
    ${({ theme }) => theme.mixins.smallButton};
    margin: 0 10px 0 0;
    background-color: transparent;
    cursor: pointer;
    font-family: var(--font-mono);
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 90%;
    min-width: 0;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 15px 5px 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      max-width: 100%;
      margin: 10px 0;

      li {
        margin: 0 10px 5px 0;
        color: var(--lightest-slate);
      }
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 10px;
    margin-left: -10px;
    color: var(--lightest-slate);

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 10px;

      &.external {
        svg {
          width: 22px;
          height: 22px;
          margin-top: -4px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .cta {
      ${({ theme }) => theme.mixins.smallButton};
      margin: 10px;
    }
  }

  .project-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 6 / -1;
    grid-row: 1 / -1;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      height: 100%;
      opacity: 0.25;
    }

    a {
      width: 100%;
      height: 100%;
      background-color: var(--green);
      border-radius: var(--border-radius);
      vertical-align: middle;

      &:hover,
      &:focus {
        background: transparent;
        outline: 0;

        &:before,
        .img {
          background: transparent;
          filter: none;
        }
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--navy);
        mix-blend-mode: screen;
      }
    }

    .img {
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1) brightness(90%);

      @media (max-width: 768px) {
        object-fit: cover;
        width: auto;
        height: 100%;
        filter: grayscale(100%) contrast(1) brightness(50%);
      }
    }
  }
`;

const StyledModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: rgba(2, 12, 27, 0.85);
  backdrop-filter: blur(6px);
  animation: modalFade 0.25s ease;
  overflow-y: auto;

  @keyframes modalFade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    padding: 20px 14px;
  }

  .modal-panel {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    width: 100%;
    max-width: 1000px;
    max-height: 88vh;
    overflow-y: auto;
    padding: 45px 50px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    animation: modalRise 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    @keyframes modalRise {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 600px) {
      padding: 30px 22px;
    }
  }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 38px;
    height: 38px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--green);
    border-radius: 50%;
    background: transparent;
    color: var(--green);
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    transition: var(--transition);

    &:hover,
    &:focus-visible {
      outline: 0;
      background: var(--green-tint);
      transform: rotate(90deg);
    }
  }

  .modal-overline {
    margin: 0 0 8px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .modal-title {
    margin: 0 0 18px;
    color: var(--lightest-slate);
    font-size: clamp(22px, 4vw, 28px);
    line-height: 1.2;
    padding-right: 40px;
  }

  .modal-overview {
    margin: 0 0 30px;
    max-width: 75ch;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    line-height: 1.6;

    @media (max-width: 600px) {
      font-size: var(--fz-md);
    }
  }

  .modal-subhead {
    margin: 0 0 14px;
    color: var(--lightest-slate);
    font-size: var(--fz-md);
    font-weight: 600;
  }

  .modal-features {
    ${({ theme }) => theme.mixins.resetList};
    margin: 0 0 30px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 10px 32px;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    li {
      position: relative;
      padding-left: 20px;
      color: var(--light-slate);
      font-size: var(--fz-sm);
      line-height: 1.5;

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        line-height: 1.5;
      }
    }
  }

  .modal-tech {
    ${({ theme }) => theme.mixins.resetList};
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 30px;

    li {
      padding: 4px 12px;
      border: 1px solid rgba(100, 255, 218, 0.25);
      border-radius: 14px;
      background: rgba(100, 255, 218, 0.06);
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      white-space: nowrap;
    }
  }

  .modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;

    a {
      ${({ theme }) => theme.mixins.smallButton};
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 0;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    a.secondary {
      color: var(--light-slate);
      border-color: var(--slate);

      &:hover,
      &:focus-visible {
        color: var(--green);
        border-color: var(--green);
        background-color: var(--green-tint);
      }
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              summary
              overview
              features
              cover {
                childImageSharp {
                  gatsbyImageData(
                    width: 1200
                    quality: 100
                    placeholder: DOMINANT_COLOR
                    formats: [AUTO, WEBP, AVIF]
                  )
                }
              }
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  useEffect(() => {
    if (!activeProject) {
      return;
    }

    const onKey = e => {
      if (e.key === 'Escape') {
        setActiveProject(null);
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  const closeModal = () => setActiveProject(null);
  const onBackdropClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Some Things I’ve Built
      </h2>

      <StyledProjectsGrid>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, tech, github, cover, summary } = frontmatter;
            const image = getImage(cover);

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <div className="project-content">
                  <div>
                    <p className="project-overline">Featured Project</p>

                    <h3 className="project-title">
                      <a
                        href={external}
                        onClick={e => {
                          e.preventDefault();
                          setActiveProject(frontmatter);
                        }}>
                        {title}
                      </a>
                    </h3>

                    {summary ? (
                      <div className="project-description">
                        <p>{summary}</p>
                      </div>
                    ) : (
                      <div
                        className="project-description"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    )}

                    {tech.length && (
                      <ul className="project-tech-list">
                        {tech.map((tech, i) => (
                          <li key={i}>{tech}</li>
                        ))}
                      </ul>
                    )}

                    <div className="project-links">
                      <button
                        type="button"
                        className="project-details-btn"
                        onClick={() => setActiveProject(frontmatter)}
                        aria-label={`View details for ${title}`}>
                        View Details
                      </button>
                      {github && (
                        <a href={github} aria-label="GitHub Link">
                          <Icon name="GitHub" />
                        </a>
                      )}
                      {external && (
                        <a href={external} aria-label="External Link" className="external">
                          <Icon name="External" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="project-image">
                  <a
                    href={external ? external : github ? github : '#'}
                    onClick={e => {
                      e.preventDefault();
                      setActiveProject(frontmatter);
                    }}
                    aria-label={`View details for ${title}`}>
                    <GatsbyImage image={image} alt={title} className="img" />
                  </a>
                </div>
              </StyledProject>
            );
          })}
      </StyledProjectsGrid>

      {activeProject && (
        <StyledModal onClick={onBackdropClick} role="dialog" aria-modal="true">
          <div className="modal-panel">
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Close project details">
              &times;
            </button>

            <p className="modal-overline">Featured Project</p>
            <h3 className="modal-title">{activeProject.title}</h3>

            <p className="modal-overview">{activeProject.overview || activeProject.summary}</p>

            {activeProject.features && activeProject.features.length > 0 && (
              <>
                <h4 className="modal-subhead">Key Features</h4>
                <ul className="modal-features">
                  {activeProject.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </>
            )}

            {activeProject.tech && activeProject.tech.length > 0 && (
              <>
                <h4 className="modal-subhead">Built With</h4>
                <ul className="modal-tech">
                  {activeProject.tech.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="modal-actions">
              {activeProject.external && (
                <a href={activeProject.external} target="_blank" rel="noopener noreferrer">
                  <Icon name="External" />
                  Visit Live Site
                </a>
              )}
              {activeProject.github && (
                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary">
                  <Icon name="GitHub" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </StyledModal>
      )}
    </section>
  );
};

export default Featured;
